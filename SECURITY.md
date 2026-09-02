# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability within Neatly, please report it responsibly by contacting the maintainers directly at hello@neatly.com.

Please do not report security vulnerabilities through public GitHub issues.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Main    | :white_check_mark: |

## Security Architecture & Practices

- **Strict Server/Client Isolation:** Private API secrets, database credentials (`DATABASE_URL`), session secrets (`SESSION_SECRET`), and email keys (`EMAIL_API_KEY`) are kept strictly on the server and are never exposed via `NEXT_PUBLIC_` prefixes.
- **Authentication & Sessions:** Passwords are hashed using `bcrypt` (cost factor 12). Admin sessions are stored exclusively in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
- **Input Validation:** All incoming HTTP requests and internal API payloads pass through strict Zod schema validation.
- **Rate Limiting:** Brute-force protections enforce strict request limits per IP address on sensitive authentication routes.
- **HTTP Security Headers:** Strict Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and Referrer Policy headers are configured.
