import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import type {
  MlpBook,
  DownloadLinks,
  CombinedBook,
} from "#@/lib/shared/types/book-types.ts";
import { fetchHtml, createUrl } from "#@/lib/server/utils/fetch-utils.ts";
import {
  cleanTitle,
  cleanAuthorName,
  parsePublisherInfo,
  getBestImageUrl,
} from "#@/lib/shared/utils/text-utils.ts";
import {
  MLP_START_URL,
  MLP_BASE_URL,
  CONCURRENCY,
  MAX_PAGES,
} from "#@/lib/shared/config/scraper-config.ts";

/**
 * Parse book data from MLP listing page items.
 */
function parseMlpBookData(
  item: cheerio.Cheerio<AnyNode>,
  layoutType: "grid" | "row",
): Omit<
  MlpBook,
  "pdfUrl" | "epubUrl" | "partTitle" | "imageUrl" | "description"
> | null {
  try {
    let titleElement, authorElement, publisherElement, coverLinkElement;

    if (layoutType === "grid") {
      titleElement = item.find(".title-info-title a");
      authorElement = item.find(".title-info-author");
      publisherElement = item.find(".title-info-publisher");
      coverLinkElement = item.find("a.cover");
    } else {
      titleElement = item.find(".katalog-row-title a");
      authorElement = item.find(".katalog-row-author");
      publisherElement = item.find(".katalog-row-publishments[title]");
      coverLinkElement = item.find(".katalog-row-img a.cover");
    }

    const title = cleanTitle(titleElement.attr("title"));
    const rawAuthor = authorElement.attr("title")?.trim() || "";
    const author = cleanAuthorName(rawAuthor) || "Unknown Author";

    const publisherInfo = publisherElement.attr("title")?.trim() || "";
    const { publisher, year } = parsePublisherInfo(publisherInfo);

    const detailHref = coverLinkElement.attr("href");
    if (!detailHref) return null;
    const detailUrl = createUrl(MLP_BASE_URL, detailHref);

    if (!title || title === "Title Not Found") return null;

    return { title, author, publisher, year, detailUrl };
  } catch (error) {
    console.error("Error parsing MLP book item:", error);
    return null;
  }
}

/**
 * Parse details from MLP book detail page HTML.
 */
export function parseMlpBookDetails(
  detailHtml: string,
): Omit<DownloadLinks, "pdfUrl" | "epubUrl"> {
  try {
    const $detail = cheerio.load(detailHtml);

    let partTitle: string | null = null;
    $detail(".book-content.book-info-table table tbody tr").each(
      (_: number, element: AnyNode) => {
        if (
          $detail(element).find("td.itemlefttd").text().trim() === "Název části"
        ) {
          partTitle = cleanTitle(
            $detail(element).find("td").eq(1).text().trim(),
          );
        }
      },
    );

    const imageUrl = $detail(".cover-img").attr("src") || null;

    const descriptionText = $detail("p.book-info-preview").text().trim();
    const description =
      descriptionText && descriptionText.length > 0 ? descriptionText : null;

    return { partTitle, imageUrl, description };
  } catch (error) {
    console.error("Error parsing MLP book details:", error);
    return {
      partTitle: null,
      imageUrl: null,
      description: null,
    };
  }
}

/**
 * Parse download links from MLP reservation page HTML.
 */
export function parseMlpDownloadLinks(reservationHtml: string): {
  pdfUrl: string | null;
  epubUrl: string | null;
} {
  try {
    const $reserv = cheerio.load(reservationHtml);

    let pdfUrl: string | null = null;
    let epubUrl: string | null = null;

    $reserv("a[download]").each((_: number, element: AnyNode) => {
      const href = $reserv(element).attr("href");
      if (href) {
        const fullUrl = createUrl(MLP_BASE_URL, href);
        if (href.includes(".pdf") && !pdfUrl) pdfUrl = fullUrl;
        if (href.includes(".epub") && !epubUrl) epubUrl = fullUrl;
      }
    });

    return { pdfUrl, epubUrl };
  } catch (error) {
    console.error("Error parsing MLP download links:", error);
    return {
      pdfUrl: null,
      epubUrl: null,
    };
  }
}

/**
 * Scrape download links and additional details from MLP book detail page.
 */
export async function scrapeMlpDownloadLinks(
  detailUrl: string,
): Promise<DownloadLinks> {
  try {
    const detailHtml = await fetchHtml(detailUrl);
    const details = parseMlpBookDetails(detailHtml);

    // Get the best available image URL (high-res if it exists, otherwise original)
    const bestImageUrl = await getBestImageUrl(details.imageUrl);

    const bookIdMatch = detailUrl.match(/\/(\d+)\/$/);
    if (!bookIdMatch) {
      return {
        pdfUrl: null,
        epubUrl: null,
        ...details,
        imageUrl: bestImageUrl,
      };
    }

    const reservationUrl = `${MLP_BASE_URL}/cz/vypujcka/${bookIdMatch[1]}`;
    const reservationHtml = await fetchHtml(reservationUrl);
    const downloadLinks = parseMlpDownloadLinks(reservationHtml);

    return { ...details, ...downloadLinks, imageUrl: bestImageUrl };
  } catch (error) {
    console.error(`Error scraping download links for ${detailUrl}:`, error);
    return {
      pdfUrl: null,
      epubUrl: null,
      partTitle: null,
      imageUrl: null,
      description: null,
    };
  }
}

/**
 * Scrape books from MLP listing pages.
 */
async function scrapeMlpListingPages(): Promise<
  Omit<
    MlpBook,
    "pdfUrl" | "epubUrl" | "partTitle" | "imageUrl" | "description"
  >[]
> {
  console.log("Starting MLP listing pages scraping...");
  let currentPageUrl: string | null = MLP_START_URL;
  let pageCount = 0;
  const booksWithBasicInfo: ReturnType<typeof parseMlpBookData>[] = [];

  while (currentPageUrl && pageCount < MAX_PAGES) {
    pageCount++;
    console.log(`Scraping MLP page ${pageCount}: ${currentPageUrl}`);
    try {
      const html = await fetchHtml(currentPageUrl);
      const $ = cheerio.load(html);

      let bookItems = $("li.kat-tile.titul");
      let layoutType: "grid" | "row" = "grid";
      if (bookItems.length === 0) {
        bookItems = $("li.katalog-row.titul");
        layoutType = "row";
      }

      if (bookItems.length === 0) {
        console.log(`No books found on page ${pageCount}. Stopping.`);
        break;
      }

      bookItems.each((_: number, item: AnyNode) => {
        const bookData = parseMlpBookData($(item), layoutType);
        if (bookData) {
          booksWithBasicInfo.push(bookData);
        }
      });

      const nextPage = $("a.pagination-arrow.next").attr("href");
      currentPageUrl = nextPage ? createUrl(MLP_BASE_URL, nextPage) : null;
    } catch (error) {
      console.error(`Failed to scrape page ${currentPageUrl}:`, error);
      break;
    }
  }

  const validBooks = booksWithBasicInfo.filter(
    (b): b is NonNullable<typeof b> => b !== null,
  );
  console.log(`Found ${validBooks.length} books from listing pages.`);

  return validBooks;
}

/**
 * Enrich basic book data with download links and additional details.
 */
async function enrichBooksWithDetails(
  basicBooks: Omit<
    MlpBook,
    "pdfUrl" | "epubUrl" | "partTitle" | "imageUrl" | "description"
  >[],
  existingBooks: CombinedBook[],
): Promise<MlpBook[]> {
  const existingDetailUrls = new Set(
    existingBooks.map((book) => book.detailUrl),
  );

  // Separate books into those that need detail scraping and those that don't
  const booksNeedingDetails = basicBooks.filter(
    (book) => !existingDetailUrls.has(book.detailUrl),
  );
  const booksWithExistingDetails = basicBooks.filter((book) =>
    existingDetailUrls.has(book.detailUrl),
  );

  console.log(
    `${booksNeedingDetails.length} books need detail scraping, ${booksWithExistingDetails.length} already have details.`,
  );

  const enrichedBooks: MlpBook[] = [];
  const queue = [...booksNeedingDetails];

  // Only scrape details for books that don't already exist
  const processDetail = async () => {
    while (queue.length > 0) {
      const basicBook = queue.shift();
      if (!basicBook) continue;

      const progress = enrichedBooks.length + 1;
      console.log(
        `[${progress}/${booksNeedingDetails.length}] Fetching details: ${basicBook.title}`,
      );
      const details = await scrapeMlpDownloadLinks(basicBook.detailUrl);
      enrichedBooks.push({ ...basicBook, ...details });
    }
  };

  if (booksNeedingDetails.length > 0) {
    const workers = Array(CONCURRENCY).fill(null).map(processDetail);
    await Promise.all(workers);
  }

  // For books with existing details, create MlpBook objects from existing data
  const existingMlpBooks: MlpBook[] = booksWithExistingDetails.map(
    (basicBook) => {
      const existingBook = existingBooks.find(
        (book) => book.detailUrl === basicBook.detailUrl,
      );
      if (existingBook) {
        // Return the existing book data (which includes detail info)
        return {
          title: existingBook.title,
          partTitle: existingBook.partTitle,
          author: existingBook.author,
          publisher: existingBook.publisher,
          year: existingBook.year,
          detailUrl: existingBook.detailUrl,
          pdfUrl: existingBook.pdfUrl,
          epubUrl: existingBook.epubUrl,
          imageUrl: existingBook.imageUrl,
          description: existingBook.description,
        };
      }
      // Fallback to basic info (shouldn't happen but just in case)
      return {
        ...basicBook,
        partTitle: null,
        pdfUrl: null,
        epubUrl: null,
        imageUrl: null,
        description: null,
      };
    },
  );

  return [...enrichedBooks, ...existingMlpBooks];
}

/**
 * Main function to scrape all MLP book data.
 */
export async function scrapeMlp(
  existingBooks: CombinedBook[],
): Promise<MlpBook[]> {
  console.log("Starting MLP scraping...");

  // First, scrape all books from listing pages
  const basicBooks = await scrapeMlpListingPages();

  // Then enrich with detailed information
  const enrichedBooks = await enrichBooksWithDetails(basicBooks, existingBooks);

  console.log(`✅ Found ${enrichedBooks.length} books from MLP.`);
  return enrichedBooks;
}
