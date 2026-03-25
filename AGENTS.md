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
- **`src/components/ui/`** — generic, reusable UI primitives with no domain/business logic (e.g., `CoverImage`, `Button`, `Card`). Props are generic types, no `Book` imports.
- **`src/components/`** — domain-specific components that depend on business types like `Book`, app routes, or domain utilities (e.g., `BookCard`, `BookCardMini`, `GenreSection`)

## Testing

- Uses `node:test` with real HTML fixtures (no external test frameworks)
- Tests co-located with source; fixtures in `src/test/fixtures/`
- When tests fail due to website changes: check selectors, re-download fixtures with `curl`

## Storybook

- **Prefer Storybook over the dev server** for tweaking components and pages — it's faster to iterate, doesn't need real data, and lets you test edge cases easily.
- **Run with preview tools**: Storybook is configured in `.claude/launch.json` as `storybook` (port 6006). Use `preview_start` to launch it. To screenshot a specific story without Storybook's sidebar/chrome, navigate to the iframe URL: `/iframe.html?id={story-id}&viewMode=story` (e.g., `/iframe.html?id=pages-homepage--default&viewMode=story`). The story ID format is `{title}--{story-name}` in kebab-case.
- **Stories co-located** with components (e.g., `book-card.stories.tsx` next to `book-card.tsx`)
- **Shared sample data**: Import from `src/components/stories/sample-books.ts` — don't duplicate `Book` fixtures in individual story files
- **Page components must be presentational**: No server function imports in components. Pass callbacks as props (e.g., `onLoadMore`) so components render in Storybook without a server.
- **Every page/component should have a story file** with multiple variants covering edge cases (empty state, missing optional fields, long content)
