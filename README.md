# ASP.NET Core 10 Minimal APIs — Interactive Studio

This project is a browser-based companion to a 44-page course, organized as seven interactive labs.

## Development

- `npm run dev` starts the Vite development server.
- `npm run build` type-checks and builds the production app.
- `npm run test` runs unit and component tests with Vitest.
- `npm run test:e2e` runs browser checks with Playwright.

The lesson copy and code examples are sourced from the supplied
`index.tsx` reference file.
Course progress and edits to the simulated dish list exist only for the
current mounted app session; reloading starts with the original seed.

The interface uses scoped Vanilla CSS Modules and shared palette tokens from
`src/index.css`; component styles use native CSS nesting and logical layout
properties without a utility-class framework.

The CRUD, JWT and Scalar labs are local teaching simulations. They do not
connect to SQLite, send HTTP requests to the example URLs, or create or
validate credentials. The CRUD simulator intentionally preserves its
reference validation behavior: POST trims names and rejects fewer than two
characters but does not enforce the example's 200-character limit; PUT
accepts an empty name and preserves the entered value.
