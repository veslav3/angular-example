# AngularExample

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Stack

This project is configured with:

- ❯ **Sass (SCSS)** — global and component styles use SCSS (`.scss`), including `inlineStyleLanguage: scss` and the default component schematic style.
- ❯ **Angular SSR** — server-side rendering via the application builder’s server entry (`src/server.ts` / `src/main.server.ts`) and the `ssr` build options.
- ❯ **pnpm** — dependencies and scripts are managed with [pnpm](https://pnpm.io/). Enable [Corepack](https://nodejs.org/api/corepack.html) (`corepack enable`) or install pnpm globally if you do not have it yet.

## Getting started

Install dependencies from the lockfile:

```bash
pnpm install
```

## Development server

To start a local development server, run:

```bash
pnpm start
```

Alternatively, run `pnpm ng serve`. Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
pnpm ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
pnpm ng generate --help
```

## Building

To build the project run:

```bash
pnpm build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
pnpm test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
pnpm ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
