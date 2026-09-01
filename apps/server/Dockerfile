FROM node:24.19-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV HUSKY=0
ENV PNPM_CONFIG_FETCH_TIMEOUT=300000
ENV PNPM_CONFIG_FETCH_RETRIES=5
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.13.1 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/server/prisma apps/server/prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json tsconfig.base.json ./
COPY apps/server apps/server
COPY packages packages
ENV NODE_ENV=production
RUN pnpm build:api

FROM node:24.19-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 neatly \
  && useradd --system --uid 1001 --gid neatly --create-home neatly
WORKDIR /app
COPY --from=build --chown=neatly:neatly /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build --chown=neatly:neatly /app/node_modules ./node_modules
COPY --from=build --chown=neatly:neatly /app/apps/server ./apps/server
COPY --from=build --chown=neatly:neatly /app/packages ./packages
WORKDIR /app/apps/server
USER neatly
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/health').then((res)=>process.exit(res.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "dist/server.js"]
