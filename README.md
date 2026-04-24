# AngularExample

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

**Live app (Vercel):** [https://angular-example-pi.vercel.app/](https://angular-example-pi.vercel.app/)

## Stack

Main technologies and tooling:

- ❯ **Node.js 22** — use **22.x** for local dev, [CI](.github/workflows/ci.yml), the [Dockerfile](Dockerfile) base, [`.nvmrc`](.nvmrc), and `package.json` `engines` (set `engine-strict=true` in an `.npmrc` if you want pnpm to enforce it).
- ❯ **Sass (SCSS)** — global and component styles use SCSS (`.scss`), including `inlineStyleLanguage: scss` and the default component schematic style.
- ❯ **Angular SSR** — server-side rendering via the application builder’s server entry (`src/server.ts` / `src/main.server.ts`) and the `ssr` build options.
- ❯ **[Vitest](https://vitest.dev/)** — unit tests run through the Angular CLI builder `@angular/build:unit-test` with Vitest in Node, using **jsdom** for DOM emulation (see Angular’s [Migrating from Karma to Vitest](https://angular.dev/guide/testing/migrating-to-vitest) guide). Spec files use `*.spec.ts` and `tsconfig.spec.json` includes `vitest/globals`.
- ❯ **[MSW](https://mswjs.io/) (Mock Service Worker)** — `https://api.chucknorris.io/jokes/random` is mocked in tests with a **pool of ten** deterministic jokes. **Unit** tests use `msw/node` (see `src/test/msw-setup.ts`, pulled in from [`src/app/app.spec.ts`](src/app/app.spec.ts)). **E2E** uses `msw/browser` by bootstrapping only when Playwright sets `window['__NG_MSW__'] = '1'` before the app runs (see `src/mocks/browser.ts` and `src/main.ts`); the worker file lives at `public/mockServiceWorker.js` (`npx msw init public` keeps it in sync).
- ❯ **pnpm** — dependencies and scripts are managed with [pnpm](https://pnpm.io/). Enable [Corepack](https://nodejs.org/api/corepack.html) (`corepack enable`) or install pnpm globally if you do not have it yet.

## Getting started

Use **Node 22** (see [`.nvmrc`](.nvmrc); with [nvm](https://github.com/nvm-sh/nvm): `nvm use`).

Install dependencies:

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

Tests use **Vitest** via `ng test` (`@angular/build:unit-test`). In a normal terminal, watch mode is on when supported; in CI, it stays off automatically.

```bash
pnpm test
```

To run a single non-watch pass (for example in scripts), use:

```bash
pnpm exec ng test --watch false
```

Background: [Migrating from Karma to Vitest](https://angular.dev/guide/testing/migrating-to-vitest) (Angular docs).

## Running end-to-end tests

End-to-end tests use [Playwright](https://playwright.dev/) and live under [`e2e/`](e2e/). The same **MSW** flow as in unit tests is used: Playwright sets `__NG_MSW__` in the page before load so the app calls [`startMsw()`](src/mocks/browser.ts); handlers return jokes from the shared list in [`src/mocks/jokes-data.ts`](src/mocks/jokes-data.ts) (in **sequence** for predictable assertions), with an optional `x-e2e-slow-ms` header to simulate a slow first response. See `e2e/jokes.spec.ts` (tests run in **serial** so a single service worker is not contended in parallel).

Install browser binaries the first time (or in CI) with:

```bash
pnpm exec playwright install
```

In CI, use `pnpm exec playwright install --with-deps` so system dependencies for Chromium are present on Linux.

Run the suite (starts the dev server automatically via `playwright.config.ts` unless one is already running locally):

```bash
pnpm test:e2e
```

**Visible browser and interactive UI (local only):**

| Command | What it does |
|--------|----------------|
| `pnpm test:e2e:headed` | Runs tests with a **real browser window** ([`--headed`](https://playwright.dev/docs/test-use-options#options)). Default `test:e2e` is headless. |
| `pnpm test:e2e:ui` | Opens Playwright’s [**Test UI mode**](https://playwright.dev/docs/test-ui-mode) (`--ui`): pick tests, watch, see steps, and use the **browser preview** / trace-style timeline while the app is driven. |

With `ng serve` already on port 4200, Playwright will reuse it ([`reuseExistingServer`](https://playwright.dev/docs/test-webserver#configuring-a-web-server) in `playwright.config.ts` when not in CI), so you can start the app once and run `pnpm test:e2e:ui` in another terminal.

## Docker

The [Dockerfile](Dockerfile) builds a production **SSR** image (Node server + prerendered assets from `ng build`, same entry as `pnpm serve:ssr:angular-example`). The server reads **`PORT`** (default **4000**; see `src/server.ts`).

| Command | What it does |
|--------|----------------|
| `pnpm docker:build` | `docker build -t angular-example:local .` |
| `pnpm docker:run` | Run the image and map [http://localhost:4000](http://localhost:4000) to the app |
| `docker compose up --build` | Build and start using [docker-compose.yml](docker-compose.yml) (optional `PORT` env, default `4000` → `4000`) |

Examples:

```bash
pnpm docker:build
pnpm docker:run
```

Or with [Compose](https://docs.docker.com/compose/):

```bash
docker compose up --build
```

**Deploying** on any host that runs containers: build and push the image, then `docker run -p 4000:4000 -e PORT=4000` (or the port your platform injects for `PORT`). The container runs as user `node`.

### Docker Scout (image analysis and base-image recommendations)

[Docker Scout](https://docs.docker.com/scout/) (the `docker scout` CLI, also distributed as the [`docker/scout-cli` image](https://hub.docker.com/r/docker/scout-cli)) can analyze the built image: vulnerabilities, size, and **recommendations** to refresh or update the base image (e.g. `node:22-alpine`).

**Local** (Desktop 4.17+ includes the plugin, or [install the CLI](https://docs.docker.com/scout/install/)):

| Command | What it does |
|--------|----------------|
| `pnpm docker:build` | Build the image tagged `angular-example:local` (required first). |
| `pnpm docker:scout:quickview` | [`docker scout quickview`](https://docs.docker.com/scout/quickview) on `local://angular-example:local` — fast summary. |
| `pnpm docker:scout:recommendations` | [`docker scout recommendations`](https://docs.docker.com/scout/recommendations) — suggested base image updates and benefits (size, CVEs). |
| `pnpm docker:scout` | Build, then quickview, then recommendations. |

**CI**: [`.github/workflows/docker-scout.yml`](.github/workflows/docker-scout.yml) builds the image and runs [`docker/scout-action`](https://github.com/docker/scout-action) (`quickview` + `recommendations`) on `main` / `workflow_dispatch` / PRs that touch the Docker-related paths. It uses `continue-on-error` so a missing Hub login does not block the run; for the richest [recommendation](https://docs.docker.com/scout/recommendations) output, sign in to Docker Hub locally or add a `docker/login-action` step with `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` in that workflow.

The [Dockerfile](Dockerfile) uses [BuildKit cache mounts](https://docs.docker.com/build/cache/optimize/) for the pnpm store to speed up repeat `docker build` steps.

## Additional resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
