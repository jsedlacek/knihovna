# Knihovna

Czech e-books static site showcasing free e-books from Prague Municipal Library (ratings 4.0+ from Goodreads). Built with TanStack Start, React, Tailwind CSS v4, TypeScript strict mode. Uses pnpm.

## Agent Instructions

**Run `pnpm check` after every change before committing.**

**Commit after each increment without asking** — run `pnpm check` first, then commit the working change immediately before moving on. Do not wait for user confirmation.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` — typecheck + lint + format check + test (CI runs this)
- `pnpm test` / `pnpm test:watch`
- `pnpm lint` / `pnpm lint:fix` — oxlint
- `pnpm format` / `pnpm format:check` — oxfmt
- `pnpm scrape` — book scraping CLI
- `pnpm storybook` / `pnpm storybook:build`

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
