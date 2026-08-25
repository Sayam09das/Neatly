# Neatly Design System

Concise visual and interaction rules for the Neatly web application. Implementation lives in `apps/web/src/app/globals.css`. Use semantic Tailwind utilities (`bg-background`, `text-foreground`, `text-h1`) instead of hard-coded values.

## Principles

Clean, minimal, high-trust, premium, and calm. Clarity beats decoration. Prefer whitespace, surface contrast, and a restrained forest/emerald palette over gradients, glass, heavy shadows, or oversized rounding.

## Color

Semantic tokens (light and dark): `background`, `foreground`, `surface`, `muted`, `border`, `input`, `primary`, `secondary`, `accent`, `destructive`, `ring` (plus matching `*-foreground` tokens).

- **Light:** white canvas, deep forest text, emerald primary for actions.
- **Dark:** forest surfaces (not inverted gray), brighter emerald primary, lifted borders.

Do not invent per-component colors. Do not use color as the only state indicator.

## Typography

**Geist Sans** is the UI/display family. **Geist Mono** is reserved for code. Files are self-hosted from `apps/web/public/fonts` (SIL Open Font License) and loaded with `next/font/local`.

| Token | Use |
| :--- | :--- |
| `text-display` | Hero / marketing display |
| `text-h1` | Page title (one per page) |
| `text-h2` | Section title |
| `text-h3` | Card / subsection title |
| `text-h4` | Small heading |
| `text-body` | Body copy |
| `text-body-small` | Compact body |
| `text-caption` | Supporting meta |
| `text-label` | Uppercase labels |
| `text-button` | Button labels |

Body line length: `max-w-prose` or `max-w-content`. Headings use tight tracking; body uses relaxed leading.

## Spacing and layout

Scale is 4px-based via Tailwind spacing. Semantic layout tokens:

- `px-gutter` — page gutters (`1rem` → `1.5rem` → `2rem`)
- `py-section` — section padding (`4rem` mobile, `6rem` desktop)
- `gap-grid` — card/grid gaps
- `min-h-touch` — 44px minimum control height
- `max-w-page` — 1280px marketing container
- `max-w-content` — 768px reading/form container

Breakpoints stay Tailwind’s: `sm` `md` `lg` `xl` `2xl`. Mobile-first.

## Radius, borders, shadows

- Radius: `rounded-sm` inputs, `rounded-md`/`rounded-lg` cards, `rounded-xl` large media, `rounded-full` pill actions.
- Borders: `border-border` only. Avoid stacked nested frames.
- Shadows: `shadow-sm`–`shadow-xl`, used sparingly. Prefer border and spacing for depth.

## Focus, motion, layering

- Keyboard focus: `focus-visible` ring using `--ring` (2px, 2px offset). Do not remove outlines.
- Motion tokens: `duration-fast|normal|slow`, `ease-standard|emphasized|enter|exit`. Honor `prefers-reduced-motion`.
- Z-index: `z-base`, `z-dropdown`, `z-sticky`, `z-overlay`, `z-modal`, `z-toast`, `z-tooltip`.

## Interaction states

Interactive elements must support idle, hover, focus-visible, active, disabled, selected, loading, and error. Hover/active may use color or `active:scale-[0.98]`. Do not animate width, height, or margin.

## Component philosophy

Components stay typed, composable, free of business logic, and Server Components by default. Interactive overlays (`Dialog`, `Sheet`, `DropdownMenu`, `Tooltip`) are Client Components.

## Primitive UI vs application UI

Keep composition in three layers. Do not collapse them.

```text
packages/ui            → primitive UI
apps/web/src/components → application components
app routes / sections   → page sections
```

- **`packages/ui`** — generic, accessible primitives (Button, Input, Dialog, Sheet, and the rest of the restrained shadcn/Radix set). Import only from `@neatly/ui`. These are unopinionated building blocks styled with Neatly semantic tokens, not a visual redesign of default shadcn.
- **`apps/web/src/components`** — Neatly-specific compositions (forms, navbar, marketing blocks, admin tables). They consume primitives; they do not live in the UI package.
- **Page sections** — route-level layouts that assemble application components. Do not put landing sections in `packages/ui`.

shadcn/ui is the implementation foundation (Radix behavior, composition API). Neatly’s design tokens in `globals.css` remain the visual language.

## Accessibility

WCAG 2.1 AA: semantic HTML, 4.5:1 body contrast, 3:1 large text, visible focus, 44px touch targets, reduced motion.
