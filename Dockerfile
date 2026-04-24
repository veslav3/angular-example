# BuildKit: pnpm store cache. Docker Scout: `pnpm docker:scout:recommendations` after `pnpm docker:build`.
# syntax=docker/dockerfile:1

ARG NODE_VERSION=22-alpine
FROM node:${NODE_VERSION} AS build

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
RUN pnpm run build

FROM node:${NODE_VERSION} AS production

LABEL org.opencontainers.image.description="Angular SSR (Express)"

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store-prod,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

RUN chown -R node:node /app
USER node

CMD ["node", "dist/angular-example/server/server.mjs"]
