# Knihovna

## Project Overview

**Knihovna** is a Czech e-books static site that showcases the best free e-books from Prague Municipal Library. The site displays books with ratings of 4.0+ from Goodreads, organized by genres, with direct download links for EPUB and PDF formats. Built with Vike (React-based SSG framework) for modern performance and developer experience.

## Agent Instructions

**CRITICAL**: You must avoid reading large files that can exceed the context window. Failure to follow these rules will cause you to exceed token limits and fail.

- **Never read test fixtures**: Files in `src/test/fixtures/` contain large HTML samples (`50KB+`).
- **Never read data files**: `data/books.json` is a large dataset.
- **Never read build artifacts**: Do not read from `dist/`, `.wrangler/`, etc.
- **Check file sizes first**: Use `ls -la` to check file sizes before reading.
- **Prefer targeted searches**: Use `grep` to search within files instead of reading entire contents.
- **Use line ranges**: When reading files, use `start_line` and `end_line` to read specific sections.

### Post-Change Review

After completing any significant changes to the project, agents should:

1. **Review AGENT.md**: Check if any new patterns, learnings, or best practices emerged during the work that should be documented
2. **Identify Outdated Information**: Look for any instructions or guidelines in AGENT.md that no longer apply
3. **Suggest AGENT.md Updates**: Propose specific updates to AGENT.md to reflect new knowledge or correct outdated information
4. **Maintain Accuracy**: Ensure AGENT.md continues to serve as an accurate guide for future development work

This practice keeps AGENT.md current and valuable. Remember: agents should not create other documentation files.

## Build & Commands

Use the following `npm` scripts for common development tasks:

- `npm run dev`: Start Vike development server.
- `npm run build`: Build for production using Vike.
- `npm run preview`: Preview production build.
- `npm run scrape`: Run book scraping CLI tool.
- `npm run type-check`: Run TypeScript type checking.
- `npm run check`: Run type-check, lint, and test together.
- `npm run lint`: Run oxlint linter checks.
- `npm run lint:fix`: Run oxlint with auto-fixes.
- `npm run format`: Run Biome formatter.
- `npm run format:check`: Check Biome formatting.
- `npm test`: Run all tests.
- `npm run test:watch`: Run tests in watch mode.
- `npm run storybook`: Start Storybook development server.
- `npm run build-storybook`: Build static Storybook for deployment.

## Code Style & Conventions

### File Naming

- **Lowercase for most files**: All file names SHOULD use lowercase letters (e.g., `book-card.tsx`).
  - **Exception**: Vike-specific files like `+Page.tsx`, `+Layout.tsx`, and `+Head.tsx` MUST use PascalCase as required by the framework.
- **Kebab-case**: Use hyphens to separate words for non-Vike files (e.g., `book-card.tsx`, `genre-data-loader.ts`).

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
- **Named Exports**: Prefer named exports for shared modules like components (e.g., `book-card.tsx`) and utilities (`genre-utils.ts`). This improves code discoverability and refactoring.
  - **Exception**: Use `default` exports for Vike's special files (`+Page.tsx`, `+data.ts`, `+config.ts`, etc.) as required by its file-based routing system.
- **Static Imports**: Prefer top-level static imports over dynamic `await import()` statements. Use dynamic imports only when truly necessary for code splitting or conditional loading.
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

### Continuous Integration

The project uses GitHub Actions for automated quality assurance on every push and pull request:

- **TypeScript Check**: `npm run check` ensures strict type compliance
- **Linting**: `npm run lint` enforces code style and quality rules via `oxlint`.
- **Formatting**: `npm run format` ensures consistent code style using `biome`.
- **Testing**: `npm test` runs the full test suite with real fixture validation

The CI pipeline must pass before code can be merged, ensuring consistent code quality across all contributions. The deployment workflow depends on successful CI completion.

### Running Tests

- Run all tests with `npm test`.
- Run tests in watch mode with `npm run test:watch`.

### Key Principles

- **Real Data Testing**: Tests use actual HTML fixtures from target websites.
- **Error Resilience**: Scrapers are tested to handle missing or malformed data gracefully.
- **No External Dependencies**: Tests rely only on Node.js built-ins and existing project dependencies (like Cheerio).
- **Static Imports**: Use top-level static imports instead of dynamic `await import()` statements for better performance and synchronous execution.
- **Comprehensive Logging**: Tests provide extensive debug output for troubleshooting failures.

### Debugging Failures

When tests fail due to website structure changes:

1.  Check console output for structure analysis logs.
2.  Review extracted data vs. expected values.
3.  Verify CSS selectors are still matching elements in the scraper modules.
4.  Update selectors if needed.
5.  Re-download fixtures if major structure changes occurred: `curl -s "TARGET_URL" > src/test/fixtures/sample-name.html`.

### Debugging Best Practices

**Always Debug Before Implementing**: When investigating issues with scrapers or data processing:

1. **Create debug scripts** to isolate and reproduce the problem before making changes
2. **Test with real data** using the actual functions and inputs that are failing
3. **Verify assumptions** with concrete examples rather than theoretical fixes
4. **Use console logging** to trace the exact flow and transformations happening

**Example approach**:

```typescript
// Create temporary debug script in src/scripts/
import { problematicFunction } from "../lib/module.ts";

const testData = {
  /* real failing data */
};
const result = problematicFunction(testData);
console.log("Input:", testData);
console.log("Output:", result);
```

## Architecture & Design Patterns

### Core Technology Stack

- **Framework**: Vike v0.4.237 (React-based SSG)
- **UI Library**: React v19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript v5 (Strict, Node.js 24)
- **Build Tool**: Vite v6
- **Package Manager**: npm
- **Component Development**: Storybook v9

### Project Structure

The application source code is located in the `src/` directory. This includes Vike `pages/` with React components and data loaders, React `components/`, shared `lib/` modules (such as scrapers, utilities, and type definitions), and executable `scripts/`. The primary data source for the application is stored in the `data/` directory, which is gitignored.

### Data Flow & SSG

The site is statically generated at build time using Vike's pre-rendering. Each page uses `+data.ts` files to load data server-side during build time. The build process reads a local dataset of books, processes and filters them, then passes the data as props to React components. Vike renders the final static HTML with automatic client-side hydration for interactivity.

### Vike Page Architecture

Pages follow Vike's file-based routing convention:

- `+Page.tsx`: React component for the page UI
- `+data.ts`: Server-side data loading function (runs at build time)
- `+config.ts`: Page-specific configuration (meta tags, etc.)
- `+Layout.tsx`: Layout wrapper component
- `+Head.tsx`: HTML head content (global)

Example page structure:

```
src/pages/beletrie/
├── +Page.tsx      # React component
├── +data.ts       # Data loader
└── +config.ts     # Page config
```

### Modular Script Architecture

- **Separation of Concerns**: Scripts are broken into focused modules (scrapers, utils, config).
- **Type Safety**: No `any` types are used; all modules have strict TypeScript coverage with Node.js 24 types.
- **Native Node.js Execution**: Scripts are executed directly with `node script.ts`, requiring no build step.
- **Shared Data Loaders**: Reusable data loading utilities for consistent book filtering and processing across pages.

### Data Types

Core data structures, such as the `Book` interface, are defined within the `src/lib/` directory. Refer to the TypeScript files in this location for authoritative type definitions.

## Scraper Development Guidelines

### Fallback Strategies

**Prefer Fallback Over Default Changes**: When fixing scraper issues, implement fallback logic rather than changing core behavior:

- **Bad**: Modify core text cleaning functions to handle edge cases by default
- **Good**: Keep original behavior, add fallback search with alternative formatting when primary search fails

**Example pattern**:

```typescript
// Primary attempt
let result = await primarySearch(originalQuery);

// Fallback attempt if primary fails
if (!result) {
  const fallbackQuery = transformQuery(originalQuery);
  if (fallbackQuery !== originalQuery) {
    result = await primarySearch(fallbackQuery);
  }
}
```

### Search Query Handling

**Title Formatting Nuances**: Different search engines expect different formats:

- **Goodreads**: May prefer certain numeral formats, punctuation styles, or character encodings
- **MLP**: May use different punctuation or formatting conventions
- **General**: Special characters, parentheses, and encoding differences can cause search failures

**Text Transformation Best Practices**: When dealing with search queries:

1. Use strict validation patterns to avoid false transformations
2. Only apply transformations in specific, well-defined contexts
3. Implement transformations as fallback, not primary behavior
4. Test with edge cases and complex patterns
5. Preserve original behavior for existing successful cases

### Error Recovery Patterns

**Graceful Degradation**: Scrapers should handle missing data without failing completely:

- Return partial data when some fields are missing
- Log warnings for missing data but continue processing
- Use fallback selectors when primary CSS selectors fail
- Implement retry logic with exponential backoff for network requests

## Security Considerations

- **No Sensitive Data**: This is a static site that does not handle user accounts, authentication, or sensitive information.
- **External Data**: The data files are generated by an external scraping process and should be considered trusted. Do not introduce user-provided data into this file without sanitization.
- **Dependencies**: Keep dependencies up-to-date to avoid security vulnerabilities from third-party packages.
- **Scraping Ethics**: The scrapers are designed for read-only operations and should be run responsibly to avoid overwhelming the source websites.
