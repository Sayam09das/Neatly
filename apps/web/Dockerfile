FROM node:24.19-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV HUSKY=0
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_CONFIG_FETCH_TIMEOUT=300000
ENV PNPM_CONFIG_FETCH_RETRIES=5
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.13.1 --activate
WORKDIR /app

FROM base AS deps
ENV DATABASE_URL="postgresql://ci:ci@127.0.0.1:5432/ci?schema=public"
ENV DIRECT_URL="postgresql://ci:ci@127.0.0.1:5432/ci?schema=public"
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/server/package.json apps/server/package.json
COPY apps/server/prisma apps/server/prisma
COPY packages/config/package.json packages/config/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/types/package.json packages/types/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json tsconfig.base.json ./
COPY apps/web apps/web
COPY apps/server apps/server
COPY packages packages
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NODE_ENV=production
RUN pnpm build

FROM node:24.19-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 neatly \
  && useradd --system --uid 1001 --gid neatly --create-home neatly
WORKDIR /app
COPY --from=build --chown=neatly:neatly /app/apps/web/public ./apps/web/public
COPY --from=build --chown=neatly:neatly /app/apps/web/.next/standalone ./
COPY --from=build --chown=neatly:neatly /app/apps/web/.next/static ./apps/web/.next/static
WORKDIR /app/apps/web
USER neatly
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/robots.txt').then((res)=>process.exit(res.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "server.js"]
