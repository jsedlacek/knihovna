# Knihovna

Czech e-books static site showcasing free e-books from Prague Municipal Library (ratings 4.0+ from Goodreads). Built with TanStack Start, React, Tailwind CSS v4, TypeScript strict mode. Uses pnpm.

## Agent Instructions

**Do not read large files** — they will exceed the context window:

- `src/test/fixtures/` — HTML samples (50KB+)
- `data/books.json` — large dataset
- `dist/`, `.wrangler/` — build artifacts

Use `ls -la` to check sizes. Prefer `grep` and line ranges over reading entire files.

**Run `pnpm check` after every change before committing.**

## Commands

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` — type-check + lint + format check + test (CI runs this)
- `pnpm test` / `pnpm run test:watch`
- `pnpm run lint` / `pnpm run lint:fix` — oxlint
- `pnpm run format` / `pnpm run format:check` — oxfmt
- `pnpm run scrape` — book scraping CLI
- `pnpm storybook` / `pnpm run build-storybook`

## Code Conventions

- **File naming**: kebab-case, lowercase (e.g., `book-card.tsx`, `genre-data-loader.ts`)
- **Named exports** for shared modules
- **No `any` types** — strict TypeScript
- **No markdown docs** — code should be self-documenting
- **Co-located tests** alongside source files using `node:test`

## Testing

- Uses `node:test` with real HTML fixtures (no external test frameworks)
- Tests co-located with source; fixtures in `src/test/fixtures/`
- When tests fail due to website changes: check selectors, re-download fixtures with `curl`

## Scraper Guidelines

- **Fallback over default changes**: when fixing scrapers, add fallback logic rather than modifying core behavior
- **Graceful degradation**: return partial data on missing fields, log warnings, continue processing
- **Debug first**: create debug scripts to reproduce issues before implementing fixes
