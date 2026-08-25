# Tailwind CSS Architecture Skill — Neatly

This skill provides guidelines for utility-first styling, design system tokens, responsive utilities, and clean class composition in **Neatly**.

---

## 1. Core Styling Rules

1. **Utility-First Exclusively:** Use Tailwind CSS utility classes exclusively. Inline `style={...}` attributes are forbidden except for dynamic calculated values (e.g., dynamic drag coordinates).
2. **Design Tokens:** Stick strictly to configured design system tokens for colors (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`), font families, and container bounds.
3. **No Arbitrary Hardcoded Values:** Arbitrary values (e.g., `h-[373px]`, `bg-[#fa3211]`) are forbidden unless explicitly required for external media embed dimensions.

---

## 2. Clean Class Composition (`cn()` Helper)

Use the standard `cn()` utility (`clsx` + `tailwind-merge`) when combining conditional classes:

```tsx
import { cn } from "@/lib/utils";

interface CardProps {
  isFeatured?: boolean;
  className?: string;
}

export function ServiceCard({ isFeatured, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-md",
        isFeatured && "border-primary/50 bg-primary/5 ring-1 ring-primary/20",
        className
      )}
    >
      {/* Card Content */}
    </div>
  );
}
```
