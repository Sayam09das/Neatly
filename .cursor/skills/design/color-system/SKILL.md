# Semantic Color System Skill — Neatly

This skill provides guidelines for semantic color tokens, contrast boundaries, and brand palette execution in **Neatly**.

---

## 1. Brand Palette & Semantic Tokens

Neatly's color palette is **calm, clean, high-contrast, and high-trust**.

| Token | Semantic Purpose | Tailwind Classes |
| :--- | :--- | :--- |
| **`background`** | Main page background | `bg-background` (Pure clean white / ultra-light warm neutral) |
| **`foreground`** | Primary heading & body text | `text-foreground` (Deep charcoal / slate for crisp contrast) |
| **`card` / `popover`**| Surface cards & dropdowns | `bg-card text-card-foreground border-border` |
| **`primary`** | Primary CTAs & active states| `bg-primary text-primary-foreground hover:bg-primary/90` |
| **`secondary`** | Supporting badges & pills | `bg-secondary text-secondary-foreground` |
| **`muted`** | Secondary body text & borders | `text-muted-foreground bg-muted` |
| **`accent`** | Subtle hover highlights | `hover:bg-accent hover:text-accent-foreground` |
| **`destructive`** | Delete triggers & server errors| `bg-destructive text-destructive-foreground` |
| **`border`** | Standard clean borders | `border-border` |

---

## 2. Color Execution Rules

1. **Semantic Classes Only:** Always use CSS variable-backed semantic Tailwind classes (`bg-primary`, `text-muted-foreground`). Never hardcode raw hex values (e.g., `#1e293b`) inside component files.
2. **Forbidden Aesthetics:**
   * ❌ No neon greens, bright purples, or loud yellow accents.
   * ❌ No dark-mode purple grid templates.
   * ❌ No rainbow gradient text clipping (`bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text`).
3. **Contrast Verification:** Ensure all text-to-background combinations exceed 4.5:1 for body copy and 3:1 for large display titles.
