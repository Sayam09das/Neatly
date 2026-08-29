# Neatly Admin API contract

All Admin endpoints live under `/api/v1/admin`. They require a session (`Authorization: Bearer …` or `x-session-token`) and an admin role from phase 27. Controllers stay thin: validate → service → JSON envelope.

Standard success envelope: `{ success: true, data, error: null, timestamp }`.  
Errors: `{ success: false, data: null, error: { code, message, requestId, details?, fields? } }`.

List payloads use `{ items, pagination: { page, limit, total, totalPages } }`. Default page size is 20 (max 100). Sort uses `sort` + `order=asc|desc` with a per-resource whitelist.

Mutations are rate-limited outside `test` (60 / 15 minutes per user + route).

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/v1/admin` | Namespace probe |
| GET | `/api/v1/admin/me` | Authenticated admin profile (no secrets) |
| GET | `/api/v1/admin/dashboard` | Live counts from `DashboardService` plus `recentCustomers` |
| GET | `/api/v1/admin/customers` | Query: `page`, `limit`, `search`, `sort`, `order`, `status`, `createdFrom`, `createdTo` |
| POST | `/api/v1/admin/customers` | Body: `name`, `email`, `phone?`, `address?`. No `role` / `status` |
| GET | `/api/v1/admin/customers/:id` | |
| PATCH | `/api/v1/admin/customers/:id` | Same allowlist as create |
| PATCH | `/api/v1/admin/customers/:id/status` | `{ status: ACTIVE \| INACTIVE }` (no hard delete) |
| GET/POST | `/api/v1/admin/cleaners` | Create: `name`, `email?`, `phone?` |
| GET/PATCH | `/api/v1/admin/cleaners/:id` | |
| PATCH | `/api/v1/admin/cleaners/:id/status` | `{ status: ACTIVE \| INACTIVE }` |
| GET/POST | `/api/v1/admin/services` | Catalog offerings. Create does not accept `isActive` |
| GET/PATCH | `/api/v1/admin/services/:id` | |
| POST | `/api/v1/admin/services/:id/archive` | Sets `isActive: false` |
| GET/POST | `/api/v1/admin/bookings` | Create: `customerId`, `serviceId`, optional cleaner/schedule/notes |
| GET/PATCH | `/api/v1/admin/bookings/:id` | PATCH notes/schedule/address only |
| PATCH | `/api/v1/admin/bookings/:id/status` | Transition table from phase 30 |
| PATCH | `/api/v1/admin/bookings/:id/assign` | `{ cleanerId }` |
| GET | `/api/v1/admin/reviews` | Testimonials. Query: `active`, `category`, `rating`, dates, search |
| GET/PATCH | `/api/v1/admin/reviews/:id` | |
| POST | `/api/v1/admin/reviews/:id/hide` | Sets `isActive: false` |
| GET/POST | `/api/v1/admin/notifications` | List is always scoped to the authenticated admin. Query `recipientId` is ignored. |
| PATCH | `/api/v1/admin/notifications/:id/read` | Own notification; admins may also mark another admin inbox item read at the domain layer |
| POST | `/api/v1/admin/notifications/read-all` | Marks the caller’s inbox read |
| GET/PATCH | `/api/v1/admin/settings` | `SiteSettings` row `id=1`. 404 if not seeded (seed does not currently insert this row) |

Possible errors: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `400 INVALID_INPUT`, `404 NOT_FOUND`, `409 CONFLICT`, `429 RATE_LIMITED`, `500 INTERNAL_ERROR`.

Audit logging is not in the schema yet. Important mutations (status, assignment, deactivate, archive, hide) should be audited in a later phase.

## Frontend read integration (phase 32)

The Admin UI calls same-origin `GET /api/v1/admin/*` through `adminRequest()`. Next.js proxies those GETs in `apps/web/src/app/api/v1/admin/[...path]/route.ts`: it forwards the HttpOnly session cookie as `x-session-token` to `NEATLY_API_URL` and never exposes the token or server secrets to the browser. Typed clients and mappers live in `apps/web/src/lib/admin/`. List filters, search, and pagination are server-backed. HTTP 401 uses the existing login redirect; 403 stays a page error. Failed GETs show the existing error/retry UI and never fall back to mock rows.

Known gaps (do not invent UI or data for these):

* There is no Admin Cleaners page. `GET /api/v1/admin/cleaners` and `src/lib/admin/cleaners.ts` exist for later UI.
* There is no customer detail route. `GET /api/v1/admin/customers/:id` is wired in the client; the customers table view action stays disabled until mutations/detail work.
* Notification list search is not a backend query (`search` is ignored). Unread uses `unreadOnly`; a “read only” filter is not in the API and is applied only to the current page.
* `GET /api/v1/admin/settings` returns 404 until `site_settings` id=1 is seeded. The UI treats that as empty settings, not an error.
* Quote, contact, and blog Admin APIs are not part of this namespace. Dashboard quick actions that point at those screens remain navigation only.
* Review rating averages in the UI are computed from the current page, not a backend aggregate.
* Write/mutation flows are phase 33. Real-time notification delivery is phase 34.
