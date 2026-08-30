FROM node:24.19-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV HUSKY=0
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@11.13.1 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/server/package.json apps/server/package.json
COPY apps/server/prisma apps/server/prisma
COPY packages/config/package.json packages/config/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/types/package.json packages/types/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json tsconfig.base.json ./
COPY apps/web apps/web
COPY apps/server apps/server
COPY packages packages
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NODE_ENV=production
RUN pnpm build

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 neatly \
  && useradd --system --uid 1001 --gid neatly --create-home neatly
COPY --from=build --chown=neatly:neatly /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build --chown=neatly:neatly /app/node_modules ./node_modules
COPY --from=build --chown=neatly:neatly /app/apps/web ./apps/web
COPY --from=build --chown=neatly:neatly /app/packages ./packages
USER neatly
EXPOSE 3000
CMD ["pnpm", "start"]
