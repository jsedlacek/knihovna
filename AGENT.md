# Knihovna

## Project Overview

**Knihovna** is a Czech e-books static site that showcases the best free e-books from Prague Municipal Library. The site displays books with ratings of 4.0+ from Goodreads, organized by genres, with direct download links for EPUB and PDF formats.

## Agent Instructions

**CRITICAL**: You must avoid reading large files that can exceed the context window. Failure to follow these rules will cause you to exceed token limits and fail.

- **Never read test fixtures**: Files in `src/test/fixtures/` contain large HTML samples (`50KB+`).
- **Never read data files**: `data/books.json` is a large dataset.
- **Never read build artifacts**: Do not read from `dist/`, `.astro/`, etc.
- **Check file sizes first**: Use `ls -la` to check file sizes before reading.
- **Prefer targeted searches**: Use `grep` to search within files instead of reading entire contents.
- **Use line ranges**: When reading files, use `start_line` and `end_line` to read specific sections.

## Build & Commands

Use the following `npm` scripts for common development tasks:

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build.
- `npm run scrape`: Run book scraping CLI tool.
- `npm run check`: Run TypeScript type checking.
- `npm test`: Run all tests.
- `npm run test:watch`: Run tests in watch mode.

## Code Style & Conventions

### File Naming

- **Lowercase only**: All file names MUST use lowercase letters. No capital letters.
- **Kebab-case**: Use hyphens to separate words (e.g., `book-card.tsx`).
- This applies to all files: components, layouts, pages, utils, etc.

### Documentation

- **Self-documenting code**: Prioritize clear, descriptive function and variable names over extensive documentation.
- **No Markdown docs**: Do not create markdown documentation for individual features or components.
- **Use TypeScript**: Define clear interfaces and type definitions.
- **Inline comments**: Use only for complex or non-obvious logic.
- **JSDoc**: Use for public APIs when necessary.

### Modern JavaScript & APIs

- **Modern Syntax**: Always use modern JavaScript features (ES2020+):
  - Use `for..of` loops instead of legacy `for (let i = 0; i < array.length; i++)`
  - Use array methods like `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`
  - Use destructuring assignment for arrays and objects
  - Use template literals instead of string concatenation
  - Use arrow functions for callbacks and short functions
  - Use `const` and `let` instead of `var`
- **Async/Await**: Prefer `async/await` over `.then()` chains for Promise handling.
- **Modern APIs**: Use modern web and Node.js APIs:
  - Use `fetch()` instead of legacy HTTP libraries where possible
  - Use `URL` constructor for URL manipulation
  - Use `setTimeout()` with Promises for delays
  - Use `AbortController` for cancellable operations
- **Array Iteration**: Use appropriate iteration methods:
  - `array.entries()` when you need both index and value
  - `Object.entries()` for object iteration
  - Spread operator `...` for array/object copying
- **Error Handling**: Use modern error handling patterns with proper error types.

### Best Practices

- **TypeScript Strict Mode**: The project uses strict mode with no `any` types.
- **ESM Modules**: Use modern `.ts` imports for direct execution in Node.js scripts.
- **Component Composition**: Favor composition over inheritance in React components.
- **Separation of Concerns**: Maintain a clean separation between layout, components, and styles.

## Testing & Quality Assurance

### Overview

The project uses Node.js's native `node:test` module with real HTML fixtures to ensure scraping accuracy and resilience. This approach avoids external testing frameworks and allows for direct execution of TypeScript test files.

### Test Architecture

The project uses a hybrid testing approach that balances discoverability with separation of concerns:

**Co-located Tests**: Tests for UI components and shared utilities should be placed alongside their source files in the `src/` directory. This improves discoverability and maintainability for component-specific tests.

**Centralized Test Assets**: Test utilities and fixtures are located in the `src/test/` directory:

- Test utilities are in `src/test/utils/`
- Large HTML fixtures are stored in `src/test/fixtures/` and should not be read directly by agents due to their large size

This approach ensures that tests live close to their implementation, while shared test resources remain centralized.

### Running Tests

- Run all tests with `npm test`.
- Run tests in watch mode with `npm run test:watch`.

### Key Principles

- **Real Data Testing**: Tests use actual HTML fixtures from target websites.
- **Error Resilience**: Scrapers are tested to handle missing or malformed data gracefully.
- **No External Dependencies**: Tests rely only on Node.js built-ins and existing project dependencies (like Cheerio).
- **Comprehensive Logging**: Tests provide extensive debug output for troubleshooting failures.

### Debugging Failures

When tests fail due to website structure changes:

1.  Check console output for structure analysis logs.
2.  Review extracted data vs. expected values.
3.  Verify CSS selectors are still matching elements in the scraper modules.
4.  Update selectors if needed.
5.  Re-download fixtures if major structure changes occurred: `curl -s "TARGET_URL" > src/test/fixtures/sample-name.html`.

## Architecture & Design Patterns

### Core Technology Stack

- **Framework**: Astro.js v5 (SSG)
- **UI Library**: React v19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript v5 (Strict)
- **Build Tool**: Vite (via Astro)
- **Package Manager**: npm

### Project Structure

The application source code is located in the `src/` directory. This includes Astro `pages/` and `layouts/`, React `components/`, shared `lib/` modules (such as scrapers, utilities, and type definitions), and executable `scripts/`. The primary data source for the application is stored in the `data/` directory, which is gitignored.

### Data Flow & SSG

The site is statically generated at build time. The build process reads a local dataset of books from the server-side, which is then passed as props to the UI components. Astro renders the final static HTML, and client-side JavaScript is used to hydrate components for interactivity where needed.

### Modular Script Architecture

- **Separation of Concerns**: Scripts are broken into focused modules (scrapers, utils, config).
- **Type Safety**: No `any` types are used; all modules have strict TypeScript coverage.
- **Native Node.js Execution**: Scripts are executed directly with `node script.ts`, requiring no build step.

### Data Types

Core data structures, such as the `Book` interface, are defined within the `src/lib/` directory. Refer to the TypeScript files in this location for authoritative type definitions.

## Security Considerations

- **No Sensitive Data**: This is a static site that does not handle user accounts, authentication, or sensitive information.
- **External Data**: The data files are generated by an external scraping process and should be considered trusted. Do not introduce user-provided data into this file without sanitization.
- **Dependencies**: Keep dependencies up-to-date to avoid security vulnerabilities from third-party packages.
- **Scraping Ethics**: The scrapers are designed for read-only operations and should be run responsibly to avoid overwhelming the source websites.
