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
| GET/POST | `/api/v1/admin/cleaners` | Create: `name`, `email`, `phone`. Server assigns Prisma role `STAFF` and sends a hashed invitation. Response includes `invitationSent`. Query: `accountState` (`ACTIVE` \| `INVITED` \| `INACTIVE`) |
| GET/PATCH | `/api/v1/admin/cleaners/:id` | PATCH does not accept `role` or invitation tokens |
| PATCH | `/api/v1/admin/cleaners/:id/status` | `{ status: ACTIVE \| INACTIVE }`. Activate is rejected while invitation is pending. Deactivate revokes sessions |
| POST | `/api/v1/admin/cleaners/:id/resend-invitation` | Invited cleaners only. Invalidates the prior token and sends a new invitation |
| GET/POST | `/api/v1/admin/services` | Catalog offerings. Create does not accept `isActive` |
| GET/PATCH | `/api/v1/admin/services/:id` | |
| POST | `/api/v1/admin/services/:id/archive` | Sets `isActive: false` |
| GET/POST | `/api/v1/admin/bookings` | Create: `customerId`, `serviceId`, optional cleaner/schedule/notes |
| GET/PATCH | `/api/v1/admin/bookings/:id` | PATCH notes/schedule/address only |
| GET | `/api/v1/admin/quotes` | Query: `page`, `limit`, `search`, `sort`, `order`, `status`, `serviceType`, `createdFrom`, `createdTo` |
| GET | `/api/v1/admin/quotes/:id` | Full quote request including `quotedAmount` and `adminNotes` |
| PATCH | `/api/v1/admin/quotes/:id` | `{ quotedAmount?, status?, adminNotes? }`. Pricing `NEW`/`REVIEWING`/`CONTACTED` → `QUOTED`. Admin cannot set `ACCEPTED` or `CONVERTED`. |
| PATCH | `/api/v1/admin/bookings/:id/status` | Transition table from phase 30 |
| PATCH | `/api/v1/admin/bookings/:id/assign` | `{ cleanerId }` |
| GET | `/api/v1/admin/reviews` | Testimonials. Query: `active`, `category`, `rating`, dates, search |
| GET/PATCH | `/api/v1/admin/reviews/:id` | |
| POST | `/api/v1/admin/reviews/:id/hide` | Sets `isActive: false` |
| GET/POST | `/api/v1/admin/notifications` | List is always scoped to the authenticated admin. Query `recipientId` is ignored. |
| GET | `/api/v1/admin/notifications/stream` | Authenticated Admin SSE. Heartbeat comments every 25s. Rejects unauthenticated (401) and non-admin (403). |
| PATCH | `/api/v1/admin/notifications/:id/read` | Own notification; admins may also mark another admin inbox item read at the domain layer |
| POST | `/api/v1/admin/notifications/read-all` | Marks the caller’s inbox read |
| GET/PATCH | `/api/v1/admin/settings` | `SiteSettings` row `id=1`. 404 if not seeded (seed does not currently insert this row) |

Possible errors: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `400 INVALID_INPUT`, `404 NOT_FOUND`, `409 CONFLICT`, `429 RATE_LIMITED`, `500 INTERNAL_ERROR`.

Audit logging is not in the schema yet. Important mutations (status, assignment, deactivate, archive, hide) should be audited in a later phase.

## Frontend read integration (phase 32)

The Admin UI calls same-origin `GET /api/v1/admin/*` through `adminRequest()`. Next.js proxies those GETs in `apps/web/src/app/api/v1/admin/[...path]/route.ts`: it forwards the HttpOnly session cookie as `x-session-token` to `NEATLY_API_URL` and never exposes the token or server secrets to the browser. Typed clients and mappers live in `apps/web/src/lib/admin/`. List filters, search, and pagination are server-backed. HTTP 401 uses the existing login redirect; 403 stays a page error. Failed GETs show the existing error/retry UI and never fall back to mock rows.

## Frontend mutation integration (phase 33)

The same BFF now forwards `POST` and `PATCH` with `assertSameOrigin` CSRF protection. Admin dialogs and row actions call typed clients in `apps/web/src/lib/admin/` (never Prisma, never raw `fetch` in components). Success waits for the server response, then refreshes the current list and shows a toast. Failures keep the dialog open and do not invent success.

Connected UI:

* Customers: create, edit, activate/deactivate via status. Hard delete stays disabled.
* Services: create, edit, archive (`POST /services/:id/archive`). Activate stays disabled (no API). Service media is not uploaded from Admin.
* Bookings: create, edit (notes/schedule/address), status, assign cleaner, cancel (status `CANCELLED` when the backend transition allows it).
* Reviews: hide. Hard delete stays unavailable.
* Notifications: mark one read, mark all read. Real-time delivery uses SSE (`GET /api/v1/admin/notifications/stream`) through the same-origin BFF. The database remains the source of truth.
* Settings: business contact + notification email persist through `PATCH /settings` when `site_settings` id=1 exists. Profile and password remain unavailable (no Admin `/me` or password PATCH). Appearance stays local theme.

Known gaps (do not invent UI or data for these):

* Admin Cleaners (`/admin/cleaners`) creates invited cleaners, resends invitations, and activates/deactivates accounts. Job assignment remains on Bookings.
* There is no customer or service detail route. View actions stay disabled.
* There is no service activate or service media upload API. Do not add a second storage system.
* Customer and review hard delete are not supported. Use deactivate / hide.
* Notification list search is not a backend query (`search` is ignored). Unread uses `unreadOnly`; a “read only” filter is not in the API and is applied only to the current page.
* `GET /api/v1/admin/settings` returns 404 until `site_settings` id=1 is seeded. The UI treats that as empty settings; save shows an error instead of a fake success.
* Contact and blog Admin APIs are not part of this namespace. Dashboard quick actions that point at those screens remain navigation only.
* Review rating averages in the UI are computed from the current page, not a backend aggregate.
* Audit logging is not in the schema yet. Important mutations should be audited in a later phase.
## Real-time Admin notifications (phase 34)

Transport is Server-Sent Events only. There is no Socket.IO, WebSocket, or polling fallback.

Flow: business mutation succeeds → persist inbox rows for other active admins → publish an in-process domain event → connected Admin SSE clients receive `{ eventId, type, entityId, actorId, timestamp, title, message, relatedHref, notificationId }`. The acting admin still receives a refresh event (`notificationId: null`) so other tabs update without a second toast. Receiving an event never marks it read.

The Next.js BFF pipes `GET /api/v1/admin/notifications/stream` without buffering the upstream body. The browser EventSource uses the session cookie; the server derives identity from the session, never from client-supplied ids.

Deployment tradeoff: the connection manager is in-process. Multiple API instances will not share live connections. There is no Redis or worker in this MVP. Missed events are recovered from persisted notifications after reconnect. If a second API instance is added later, replace the in-process publisher with shared pub/sub rather than adding another transport.
