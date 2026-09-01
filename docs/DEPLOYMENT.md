# Neatly Production Deployment

* **Project:** Neatly
* **Source of truth:** [`docs/PRD.md`](PRD.md), [`docs/ARCHITECTURE.md`](ARCHITECTURE.md), [`docs/DATABASE.md`](DATABASE.md)
* **Purpose:** Host-level production setup for the existing architecture. This document does not change application behavior.

---

## Architecture

Production is two Node processes plus managed services:

| Piece | Role |
| :--- | :--- |
| Web | Next.js App Router (`apps/web`). Serves marketing, customer, admin, and cleaner UI, plus same-origin auth BFF routes. |
| API | Node HTTP server (`apps/server`). Owns `/api/v1`, sessions, business logic, Prisma, SMTP, and storage uploads. |
| Database | PostgreSQL. Application traffic uses `DATABASE_URL`. Migrations use `DIRECT_URL`. |
| Storage | Supabase Storage. Service-role uploads stay on the API. Only public thumbnail URLs reach the browser. |
| Email | Brevo SMTP through Nodemailer. Do not send via `api.brevo.com`. |

Production data stores stay external: PostgreSQL, Supabase Storage, and Brevo SMTP. Docker images package the web and API processes only. Do not add Kubernetes, nginx, or a replacement email or database provider.

---

## Prerequisites

| Requirement | Value |
| :--- | :--- |
| Node.js | `>=24.19.0` (`.nvmrc`: `24.19.0`) |
| pnpm | `>=11.13.1` (`packageManager`: `pnpm@11.13.1`) |
| PostgreSQL | Hosted Postgres compatible with Prisma (for example Supabase) |
| HTTPS | Required for both the public site origin and the API origin |
| Production domain | The real public frontend origin. Do not invent one in this repository |

Set `NODE_ENV=production` on both hosts.

---

## Environment Variables

Copy names from [`.env.example`](../.env.example) and [`apps/server/.env.example`](../apps/server/.env.example). Never commit `.env` or `.env.local`. Never put real credentials in examples or this document.

### Web host (`apps/web` / Next.js)

| Name | Required | Notes |
| :--- | :--- | :--- |
| `NEATLY_API_URL` | Yes | HTTPS origin of the API. Server-only. No trailing path. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public frontend origin. Browser-safe. No trailing path. |
| `PORT` | Host-defined | `next start` default is `3000` if unset. |
| `NODE_ENV` | Yes | Must be `production`. |

### API host (`apps/server`)

| Name | Required | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | Must be `production`. Startup validates config when this is set. |
| `PORT` | Yes on most hosts | Default `4000` if unset. |
| `HOST` | Optional | Default `0.0.0.0`. |
| `DATABASE_URL` | Yes | Application / pooler connection. Server-only. |
| `DIRECT_URL` | Yes | Direct connection for `prisma migrate deploy`. Server-only. |
| `SESSION_SECRET` | Yes | At least 32 characters. Server-only. |
| `SITE_URL` | Yes | Public site origin used in auth emails. HTTPS. No trailing path. |
| `CORS_ORIGIN` | Yes in production | Must equal the real frontend origin. See [CORS](#cors). |
| `SMTP_HOST` | Yes | Brevo SMTP host. |
| `SMTP_PORT` | Yes | `587` (STARTTLS) or `465`. |
| `SMTP_USER` | Yes | Brevo SMTP username. |
| `SMTP_PASSWORD` | Yes | Brevo SMTP key. Never log. |
| `SMTP_FROM_EMAIL` | Yes | Verified sender address. |
| `SMTP_FROM_NAME` | Yes | Sender display name. |
| `SUPABASE_URL` | Yes if uploads are used | Supabase project origin. Server-only. |
| `SUPABASE_SECRET_KEY` | Yes if uploads are used | Service-role key. API-side only. Never prefix with `NEXT_PUBLIC_`. |
| `SUPABASE_SERVICES_THUMB_BUCKET` | Yes if uploads are used | Default bucket name is `Services_Thumb`. |

`NEATLY_API_URL` belongs on the web host, not the API process.

Do not set `ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, or `ADMIN_SEED_PASSWORD` on production hosts.

---

## Database Deployment

Apply pending migrations on the API release, before or as the new API process starts:

```bash
pnpm db:migrate:deploy
```

Check status without applying changes:

```bash
pnpm db:migrate:status
```

Never run against production:

```text
prisma migrate reset
pnpm db:seed
```

`pnpm db:seed` throws when `NODE_ENV=production`. Seed credentials come from the environment and are for local or controlled setup only.

---

## Web Deployment

```bash
pnpm build
pnpm start
```

| Item | Command / value |
| :--- | :--- |
| Install | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` (generates Prisma client, then Next.js production build) |
| Start | `pnpm start` → `next start` |
| Default port | `3000` unless `PORT` is set |

The web host must reach `NEATLY_API_URL` over HTTPS. Session cookies are issued by the Next.js BFF and require the site to be served on HTTPS in production (`Secure`, `HttpOnly`, `SameSite=strict`).

---

## API Deployment

```bash
pnpm build:api
pnpm start:api
```

| Item | Command / value |
| :--- | :--- |
| Install | `pnpm install --frozen-lockfile` |
| Build | `pnpm build:api` (Prisma generate + TypeScript compile to `apps/server/dist`) |
| Start | `pnpm start:api` → `node --env-file-if-exists=.env dist/server.js` |
| Default port | `4000` unless `PORT` is set |

Production startup calls `assertProductionConfig()` and fails if `DATABASE_URL`, `SESSION_SECRET`, `SITE_URL`, or SMTP settings are missing.

---

## Health Checks

Use these on the API host:

| Endpoint | Meaning | Expected |
| :--- | :--- | :--- |
| `GET /health` | Process liveness | `200` |
| `GET /ready` | Database reachable | `200` when connected; `503` with `DATABASE_UNAVAILABLE` if not |

Do not treat `/health` as proof the database is up.

---

## CORS

The API already falls back to `SITE_URL`, then `NEXT_PUBLIC_SITE_URL`, when `CORS_ORIGIN` is empty. Production must still set `CORS_ORIGIN` explicitly to the real frontend origin.

```text
CORS_ORIGIN=<REAL_FRONTEND_ORIGIN>
```

Rules:

* Use the origin only: scheme + host, optional port.
* No trailing path (`/dashboard` is invalid).
* No trailing slash.
* Format example only: `https://example.com`
* Must match the browser `Origin` header exactly.
* Must be HTTPS in production.

Do not invent the production domain in this repository. Set the value on the API host after the real site origin is known.

---

## Email

Transactional mail uses Nodemailer over Brevo SMTP (`smtp-relay.brevo.com`, port `587` STARTTLS). Do not set a Brevo HTTP API key for sending.

Required on the API host: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`.

Used for email verification, password reset, and cleaner invitation messages. Failures are logged without credentials and do not store plaintext tokens.

---

## Storage

Service thumbnails upload through the API with `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. The browser only receives public object URLs. Next.js image config allows `https://**.supabase.co/storage/v1/object/public/**`.

Unauthorized users cannot call the admin upload route. Do not expose `SUPABASE_SECRET_KEY` to client bundles.

---

## Security

These settings are already implemented. Deployment must not weaken them:

| Control | Production expectation |
| :--- | :--- |
| Session cookie | `HttpOnly`, `Secure` when `NODE_ENV=production`, `SameSite=strict`, 7-day max-age |
| HSTS | Set by Next.js in production: `max-age=31536000; includeSubDomains` |
| HTTPS | Required for both frontend and API origins |
| CORS | Allowlist only; unknown origins are rejected |
| CSRF | Cookie mutations require a matching origin against `NEXT_PUBLIC_SITE_URL` |
| Rate limiting | Auth, quote, customer, and admin mutation limiters |
| Authorization | Server-side role checks; never trust a client-supplied role |
| Ownership | Customer and cleaner resources scoped to the session identity |
| Admin registration | Public admin register is allowed only before an operator exists; afterward `403` |
| Seed | Blocked when `NODE_ENV=production` |

### CSP

Do not add a naive Content-Security-Policy in application code. Configure it at the edge (Vercel headers or Cloudflare) after the real frontend and API origins are known.

Recommended starting policy:

```text
default-src 'self'
script-src 'self' 'nonce-<per-request>'
style-src 'self' 'nonce-<per-request>'
img-src 'self' data: https://*.supabase.co
connect-src 'self' <API_ORIGIN> https://*.supabase.co
font-src 'self'
frame-ancestors 'none'
object-src 'none'
base-uri 'self'
```

Do not use `unsafe-eval`. Avoid `unsafe-inline` unless a measured Next.js or CSS requirement appears after origins are live. Do not invent `<API_ORIGIN>` or the frontend domain here.

---

## Docker

Images are built from the monorepo root.

| Image | Dockerfile | Runtime command | Default port |
| :--- | :--- | :--- | :--- |
| Web | [`apps/web/Dockerfile`](../apps/web/Dockerfile) | `pnpm start` | `3000` |
| API | [`apps/server/Dockerfile`](../apps/server/Dockerfile) | `pnpm start:api` | `4000` |

```bash
docker build -f apps/web/Dockerfile --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 -t neatly-web:local .
docker build -f apps/server/Dockerfile -t neatly-api:local .
```

`NEXT_PUBLIC_SITE_URL` is a public build argument for the web image, not a secret. Runtime secrets are injected when the container starts. Do not bake `DATABASE_URL`, `SESSION_SECRET`, `SMTP_PASSWORD`, or `SUPABASE_SECRET_KEY` into images.

The API image health check uses `GET /health`. Use `GET /ready` as an orchestrator readiness probe if you need the database; do not use `/ready` as the Docker `HEALTHCHECK` so a brief database outage does not restart the process.

Tag production images with the git SHA. `latest` is optional convenience only and is not a rollback pin.

## Local Docker

[`docker-compose.yml`](../docker-compose.yml) starts **web** and **api** for local or integration use. It does not create production PostgreSQL, Supabase, or Brevo.

```bash
docker compose build
docker compose up
```

Supply API secrets from the host environment or a gitignored env file. Map host ports with `WEB_HOST_PORT` (default `3000`) and `API_HOST_PORT` (default `4000`). Inside the compose network the web process reaches the API at `http://api:4000`.

Production Postgres remains the existing provider. Do not point compose at production credentials.

## CI

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on pull requests, merge groups, and pushes to `main`. Production verification reuses the same workflow. It does not use production secrets or the production database.

Jobs run in parallel after a frozen-lockfile install:

| Job | Command |
| :--- | :--- |
| Lint | `pnpm format:check`, `pnpm lint` |
| Typecheck | `pnpm db:validate`, `pnpm typecheck` |
| Test | `pnpm test` |
| Build | Next.js production build, `pnpm build:api` |
| Docker | Web and API images, SHA tags, no push |
| CI | Aggregator. Require this check in branch protection |

`pnpm db:validate` checks the Prisma schema only. CI supplies placeholder `DATABASE_URL` and `DIRECT_URL` values so Prisma can load the datasource. Those placeholders are not credentials, are not reachable, and are not production. The job does not connect to a database and does not run `prisma migrate deploy`.

Playwright lives under `tests/e2e`. There are no specs yet, so CI does not start browsers. Use `pnpm test:e2e` when specs exist.

Setup is shared in [`.github/actions/setup-node`](../.github/actions/setup-node/action.yml). GitHub Actions updates are grouped weekly by Dependabot.

## Docker CI

After quality and application builds pass, CI builds the web and API images in parallel with Buildx. Tags are `neatly-web:<sha>` / `neatly-api:<sha>`. Layers cache on GitHub Actions except for pull requests from forks. Images are not pushed. No registry credentials are required.

## Production Deployment

[`.github/workflows/production.yml`](../.github/workflows/production.yml) is a controlled, manual workflow (`workflow_dispatch`).

```text
CI (same gates as pull requests)
→ GitHub `production` environment approval
→ Verified SHA recorded
→ Deploy (not configured)
```

It does **not** auto-deploy on branch push, does **not** push images, and does **not** run `pnpm db:migrate:deploy` against a live database. Enable environment protection rules on the GitHub `production` environment when you are ready to require approval. Add registry and host rollout only after those credentials exist.

CI validates the application. Hosting platforms perform the actual production rollout.

Required status check for `main`: **CI**.

---

## Production Smoke Test

After both hosts are live on HTTPS, walk the existing product path (do not invent data):

1. Customer register → verification email → login → logout
2. Public `/services` and a service detail page
3. Customer quote request
4. Admin prices the quote
5. Customer accepts → booking created
6. Admin assigns a cleaner
7. Cleaner starts → cleaner completes
8. Customer sees `COMPLETED` and can submit a review

Also confirm:

* Unauthenticated `/dashboard`, `/admin`, and `/cleaner` redirect to login
* `GET /health` and `GET /ready` return `200`
* Failed login does not set `neatly_session`

---

## Rollback

High-level only. Do not reset or drop the production database.

1. Redeploy the previous known-good web and API images tagged with that release's git SHA. Do not rely on `latest`.
2. Or redeploy the previous git revision with `pnpm build` / `pnpm start` and `pnpm build:api` / `pnpm start:api`.
3. Keep web and API on the same revision so the BFF and API stay compatible.
4. If a migration was already applied, do not run `migrate reset`. Ship a follow-up forward migration if the schema must change.
5. Confirm `/health`, `/ready`, and a login smoke test before announcing recovery.
