# Neatly

**Clean, minimal, high-trust** marketing site and operations platform for professional residential and commercial cleaning.

Neatly is the public website, quote pipeline, customer account area, cleaner workspace, and admin CMS in one product. Visitors can evaluate services and request a quote. Staff can price work, assign bookings, and publish catalog, journal, and review content without changing code.

This is a production system, not a template demo. Do not invent business phone numbers, addresses, reviews, or statistics.

---

## Architecture

Two Node processes plus managed services:

| Piece | Role |
| :--- | :--- |
| Web | Next.js App Router (`apps/web`). Public site, customer `/dashboard`, admin `/admin`, cleaner `/cleaner`, and same-origin auth BFF. |
| API | Node HTTP server (`apps/server`). `/api/v1`, sessions, Prisma, SMTP, and storage uploads. |
| Database | PostgreSQL. App traffic uses `DATABASE_URL`. Migrations use `DIRECT_URL`. |
| Storage | Supabase Storage. Uploads stay on the API. PostgreSQL stores `MediaAsset` metadata only. |
| Email | Brevo SMTP through Nodemailer. Do not send via `api.brevo.com`. |

```text
Browser
  → apps/web   (http://localhost:3000)
  → apps/server (/api/v1, http://localhost:4000)
  → PostgreSQL / Supabase Storage / Brevo SMTP
```

## Stack

| Layer | Choice |
| :--- | :--- |
| Language | TypeScript (strict) |
| Web | Next.js App Router, React Server Components, Tailwind CSS, shadcn/ui |
| API | Node HTTP server, Zod, service + repository layers |
| Data | PostgreSQL, Prisma |
| Auth | HttpOnly session cookie (`neatly_session`), bcrypt cost 12 |
| Motion | Lenis, GSAP + ScrollTrigger, Motion, CSS transitions |
| Tooling | pnpm workspaces, Biome, Vitest, Husky |

## Repository

```text
apps/web          Next.js UI and BFF
apps/server       HTTP API, Prisma schema, domain services
packages/         Shared config, types, UI, and utils
docs/             Product and engineering source of truth
.github/          CI, Production workflow, Dependabot
```

Source of truth, in order: [`docs/PRD.md`](docs/PRD.md) → [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) → [`docs/DATABASE.md`](docs/DATABASE.md) → [`AGENTS.md`](AGENTS.md).

| Audience | Document |
| :--- | :--- |
| Product | [PRD](docs/PRD.md) |
| Architecture | [ARCHITECTURE](docs/ARCHITECTURE.md) |
| Data model | [DATABASE](docs/DATABASE.md) |
| Hosting, Docker, CI | [DEPLOYMENT](docs/DEPLOYMENT.md) |
| Admin HTTP API | [ADMIN_API](docs/ADMIN_API.md) |
| Visual system | [DESIGN-SYSTEM](docs/DESIGN-SYSTEM.md) |
| Engineering rules | [AGENTS.md](AGENTS.md) |

## Prerequisites

| Requirement | Version |
| :--- | :--- |
| Node.js | `>=24.19.0` (`.nvmrc`: `24.19.0`) |
| pnpm | `>=11.13.1` (`packageManager`: `pnpm@11.13.1`) |
| PostgreSQL | Hosted or local, compatible with Prisma |

## Local setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment templates. Never commit filled `.env` files.

   ```bash
   cp .env.example .env.local
   cp apps/server/.env.example apps/server/.env
   ```

3. Set `NEATLY_API_URL` and `NEXT_PUBLIC_SITE_URL` in `.env.local`. Set `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET`, and `SITE_URL` in `apps/server/.env`. Production names and rules are in [DEPLOYMENT](docs/DEPLOYMENT.md).

4. Apply schema (local or controlled setup only):

   ```bash
   pnpm db:migrate:deploy
   ```

   Optional development seed. Blocked when `NODE_ENV=production`. Do not set `ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, or `ADMIN_SEED_PASSWORD` on production hosts.

   ```bash
   pnpm db:seed
   ```

5. Run both processes:

   ```bash
   pnpm dev:api
   pnpm dev
   ```

| Surface | URL |
| :--- | :--- |
| Public site | http://localhost:3000/ |
| Admin | http://localhost:3000/admin |
| Customer | http://localhost:3000/dashboard |
| Cleaner | http://localhost:3000/cleaner |
| API health | http://localhost:4000/health |

## Scripts

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Next.js web (port `3000`) |
| `pnpm dev:api` | API (port `4000`) |
| `pnpm build` | Prisma generate + Next.js production build |
| `pnpm build:api` | API production build |
| `pnpm start` / `pnpm start:api` | Run production builds |
| `pnpm check` | Typecheck + lint |
| `pnpm format` / `pnpm format:check` | Biome format |
| `pnpm lint` | Biome lint |
| `pnpm test` | Vitest |
| `pnpm db:validate` | Prisma schema check |
| `pnpm db:migrate:deploy` | Apply migrations |
| `pnpm db:seed` | Development seed only |

## Docker

Images package the web and API processes only. PostgreSQL, Supabase, and Brevo stay external. Do not bake `DATABASE_URL`, `SESSION_SECRET`, SMTP, or Supabase secrets into images.

Local:

```bash
docker compose build
docker compose up
```

CI on `main` publishes to GitHub Container Registry:

```text
ghcr.io/<owner>/<repo>/web:<sha|latest>
ghcr.io/<owner>/<repo>/api:<sha|latest>
```

Pull (private packages need a GitHub token):

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
docker pull ghcr.io/<owner>/<repo>/web:latest
docker pull ghcr.io/<owner>/<repo>/api:latest
```

Or point Compose at published tags:

```bash
NEATLY_WEB_IMAGE=ghcr.io/<owner>/<repo>/web:latest \
NEATLY_API_IMAGE=ghcr.io/<owner>/<repo>/api:latest \
docker compose pull && docker compose up
```

Details: [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, typecheck (`prisma validate`), tests, production builds, then Docker images. Pull requests build images only. Pushes to `main` push `web` and `api` to GHCR.

[`production.yml`](.github/workflows/production.yml) is a manual gate. It does not deploy hosts and does not run `pnpm db:migrate:deploy` against production.

Required status check for `main`: **CI**.

## Product surfaces

| Area | Path |
| :--- | :--- |
| Marketing | `/`, `/services`, `/quote`, `/blog`, `/testimonials`, `/process`, `/contact` |
| Legal | `/privacy`, `/terms`, `/cookies` |
| Customer | `/login`, `/register`, `/dashboard` |
| Admin | `/admin` |
| Cleaner | `/cleaner` |

Public content (services, portfolio, reviews, journal) is loaded from the database. Do not hardcode fake testimonials, metrics, or contact details.

## Security

- Never commit `.env`, `.env.local`, or production secrets.
- Never prefix `DATABASE_URL`, `SESSION_SECRET`, `SMTP_PASSWORD`, or `SUPABASE_SECRET_KEY` with `NEXT_PUBLIC_`.
- Admin and API authorization is enforced on the server. Hiding a button is not a security boundary.
- Production schema changes go through `pnpm db:migrate:deploy` on the API host. Do not run `prisma migrate reset` or `pnpm db:seed` in production.
