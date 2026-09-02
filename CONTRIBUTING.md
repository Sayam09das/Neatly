# Contributing to Neatly

Thank you for your interest in contributing to Neatly!

## Production Principles & Engineering Rules

Before contributing, please review our strict production engineering rules outlined in [`AGENTS.md`](./AGENTS.md) and [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md):

1. **Strict TypeScript Compliance:** No `any` types, un-narrowed `unknown` types, or compiler suppressions (`@ts-ignore`, `@ts-expect-error`).
2. **Server Components by Default:** Keep components in `app/` as React Server Components (RSC) unless interactive client state (`"use client"`) is required.
3. **No Fake Data:** Never commit fake testimonials, dummy pricing, or invented customer statistics.
4. **Service Layer Architecture:** Business logic belongs in `/services/*`, keeping route handlers thin and UI components presentation-focused.

## Local Development Commands

- **Install Dependencies:** `pnpm install`
- **Start Web Application:** `pnpm dev`
- **Start Backend API:** `pnpm dev:api`
- **Run Typechecking & Linting:** `pnpm check`
- **Run Unit & Integration Tests:** `pnpm test`
- **Build Server:** `pnpm build:api`
- **Build Web App:** `pnpm --filter @neatly/web build`
