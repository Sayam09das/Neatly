# Strict TypeScript Skill — Neatly

This skill provides guidelines for enforcing 100% strict TypeScript compliance across all layers of the **Neatly** codebase.

---

## 1. Non-Negotiable Type Rules

1. **Zero `any` Usage:** Using `any` to bypass compiler checks is strictly forbidden.
2. **Explicit Function Signatures:** All exported functions, service methods, API route handlers, and component props MUST declare explicit return type annotations.
3. **No Compiler Suppression Flags:** `@ts-ignore`, `@ts-expect-error`, and `@ts-nocheck` directives are forbidden unless isolating a documented third-party library bug.
4. **Discriminated Unions for Multi-State UI:** Use discriminated unions to model multi-state workflows cleanly:

```typescript
type AsyncState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };
```

---

## 2. Type Reuse & Schema Integration

* **Import Prisma Types:** Import database domain types directly from `@prisma/client` or generated Prisma types. Do not manually redefine duplicate entity interfaces.
* **Shared Zod Infer Types:** Infer TypeScript types directly from Zod validation schemas using `z.infer<typeof schema>` to keep client form and server API types in 100% lockstep.

```typescript
import { z } from "zod";
import { quoteRequestSchema } from "@/lib/validations/quote.schema";

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
```
