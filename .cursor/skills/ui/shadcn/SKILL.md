# shadcn/ui Component Customization Skill — Neatly

This skill provides guidelines for adopting, customizing, and styling **shadcn/ui** component primitives to align with Neatly's calm, clean, minimal brand aesthetic.

---

## 1. Golden Rule of shadcn/ui Adoption

> **NEVER ship default uncustomized shadcn components that make Neatly look like a generic administrative dashboard template.**

Every primitive imported into `components/ui/` MUST be styled to match Neatly's brand tokens:
* Crisp contrast typography.
* Generous component padding (`px-4 py-3`, `px-6 py-4`).
* Refined border radiuses (`rounded-lg` or `rounded-xl`).
* High-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).
* Zero unnecessary heavy drop shadows or bright neon accent rings.

---

## 2. Approved Component Primitives

| Primitive | Neatly Use Case | Customization Rule |
| :--- | :--- | :--- |
| `Button` | Primary CTAs, form triggers, filters | Refined padding, subtle hover shift, custom primary accent variant |
| `Dialog` / `Sheet` | Admin popups, mobile menu drawer | Backdrop blur (`backdrop-blur-sm`), focus trap, smooth entrance |
| `Input` / `Textarea`| Quote form inputs, contact fields | High-contrast borders (`border-border`), clear focus ring |
| `Select` | Property size & service dropdowns | Accessible ARIA popover, clean hover highlights |
| `Tabs` | Category filters, Admin views | Minimal pill background switcher or underline active tab |
| `Table` | Admin quote & message tables | Clean headers, muted row hover (`hover:bg-muted/50`), cell padding |
| `Toast` / `Alert` | Success banners, validation alerts| High contrast, accessibility ARIA live region (`aria-live="polite"`) |

---

## 3. Customizing Primitives (Button Example)

Ensure component variants reflect brand hierarchy:

```tsx
// components/ui/button.tsx customization example
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3.5 text-xs",
        lg: "h-13 rounded-xl px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## 4. Accessibility & Keyboard Traps

* All modal dialogs (`Dialog`) and drawers (`Sheet`) MUST use Radix UI focus traps to lock keyboard focus inside the overlay while open.
* Always preserve keyboard `Escape` key close triggers.
