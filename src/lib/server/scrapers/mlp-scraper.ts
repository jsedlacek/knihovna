import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { createUrl, fetchHtml } from "#@/lib/server/utils/fetch-utils.ts";
import {
  MAX_PAGES,
  MLP_BASE_URL,
  MLP_START_URL,
} from "#@/lib/shared/config/scraper-config.ts";
import type {
  MlpBookDetails,
  MlpBookListing,
} from "#@/lib/shared/types/book-types.ts";
import {
  cleanAuthorName,
  cleanTitle,
  getBestImageUrl,
  parsePublisherInfo,
} from "#@/lib/shared/utils/text-utils.ts";

/**
 * Parse book data from MLP listing page items.
 */
function parseMlpBookData(
  item: cheerio.Cheerio<AnyNode>,
  layoutType: "grid" | "row",
): MlpBookListing | null {
  try {
    let titleElement: cheerio.Cheerio<AnyNode>;
    let authorElement: cheerio.Cheerio<AnyNode>;
    let publisherElement: cheerio.Cheerio<AnyNode>;
    let coverLinkElement: cheerio.Cheerio<AnyNode>;

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
): Omit<MlpBookDetails, "pdfUrl" | "epubUrl"> {
  try {
    const $detail = cheerio.load(detailHtml);

    let subtitle: string | null = null;
    let partTitle: string | null = null;
    let genreId: string | null = null;
    let genre: string | null = null;

    $detail(".book-content.book-info-table table tbody tr").each(
      (_: number, element: AnyNode) => {
        const fieldName = $detail(element).find("td.itemlefttd").text().trim();
        const fieldValue = cleanTitle(
          $detail(element).find("td").eq(1).text().trim(),
        );

        if (fieldName === "Podnázev") {
          subtitle = fieldValue;
        } else if (fieldName === "Název části") {
          partTitle = fieldValue;
        } else if (fieldName === 'Obsahová char. "OCH"') {
          genreId = fieldValue;
        } else if (fieldName === "Obsah OCHu") {
          genre = fieldValue;
        }
      },
    );

    const imageUrl = $detail(".cover-img").attr("src") || null;

    const descriptionText = $detail("p.book-info-preview").text().trim();
    const description =
      descriptionText && descriptionText.length > 0 ? descriptionText : null;

    return {
      subtitle,
      partTitle,
      imageUrl,
      description,
      genreId,
      genre,
    };
  } catch (error) {
    console.error("Error parsing MLP book details:", error);
    return {
      subtitle: null,
      partTitle: null,
      imageUrl: null,
      description: null,
      genreId: null,
      genre: null,
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
 * Scrape details and download links from an MLP book detail page.
 */
export async function scrapeMlpBookDetails(
  detailUrl: string,
): Promise<MlpBookDetails> {
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

  return {
    ...details,
    ...downloadLinks,
    imageUrl: bestImageUrl,
  };
}

/**
 * Scrape books from MLP listing pages.
 */
export async function scrapeMlpListingPages(): Promise<MlpBookListing[]> {
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
