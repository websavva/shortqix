### BASE with Node.js and pnpm pre-installned
FROM node:22-alpine AS base

RUN npm install -g pnpm@10.10.0

### BUILD
FROM base as build

WORKDIR /app-build

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# defining args for env
ARG NODE_ENV=production
ARG PORT=3000
ARG SQX_BASE_URL=http://localhost:${PORT}
ARG SQX_STAGE=production
ARG SQX_APP_NAME=Shortqix
ARG SQX_SUPPORT_EMAIL=support@sqix.pro
ARG SQX_DOMAIN=sqix.pro
ARG SQX_YM_ID

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV SQX_BASE_URL=${SQX_BASE_URL}
ENV SQX_STAGE=${SQX_STAGE}
ENV SQX_APP_NAME=${SQX_APP_NAME}
ENV SQX_SUPPORT_EMAIL=${SQX_SUPPORT_EMAIL}
ENV SQX_DOMAIN=${SQX_DOMAIN}
ENV SQX_YM_ID=${SQX_YM_ID}

ARG SQX_APP_NAME=Shortqix
ARG SQX_SUPPORT_EMAIL=support@sqix.pro
ARG SQX_DOMAIN=sqix.pro

RUN pnpm build

### PRODUCTION
FROM base as production

WORKDIR /app

# defining args for env
ARG NODE_ENV=production
ARG PORT=3000
ARG SQX_BASE_URL=http://localhost:${PORT}
ARG SQX_STAGE=production
ARG SQX_APP_NAME=Shortqix
ARG SQX_SUPPORT_EMAIL=support@sqix.pro
ARG SQX_DOMAIN=sqix.pro
ARG SQX_YM_ID

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV SQX_BASE_URL=${SQX_BASE_URL}
ENV SQX_STAGE=${SQX_STAGE}
ENV SQX_APP_NAME=${SQX_APP_NAME}
ENV SQX_SUPPORT_EMAIL=${SQX_SUPPORT_EMAIL}
ENV SQX_DOMAIN=${SQX_DOMAIN}
ENV SQX_YM_ID=${SQX_YM_ID}

RUN apk add --no-cache curl

COPY drizzle.config.ts ./
COPY server/db/entities/ ./server/db/entities/
COPY server/db/migrations/ ./server/db/migrations/
COPY server/db/schema.ts ./server/db

COPY --from=build /app-build/.output/ ./.output

EXPOSE ${PORT}

CMD node .output/server/node_modules/drizzle-kit/bin.cjs migrate && \
    node .output/server/index.mjs
