# Navigation Architecture & Mobile Menu Skill — Neatly

This skill provides guidelines for sticky navigation, mobile slide-over menus, active route highlights, and header transitions in **Neatly**.

---

## 1. Navigation Header Structure

* **Logo:** Brand name "Neatly" with clean, minimal typography. Links to `/`.
* **Desktop Navigation Links:** `About`, `Services`, `Portfolio`, `Blog`, `Contact`.
* **Utility Elements:** Business Phone number link (`tel:...`) + High-contrast "Get a Quote" primary CTA button.
* **Sticky Behavior:** Header stays fixed at top of viewport (`sticky top-0 z-40`). Transitions smoothly from a transparent background at scroll top (`scrollY === 0`) to a solid, elevated backdrop blur background upon scrolling down past 20px (`bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm`).

---

## 2. Mobile Navigation Overlay / Drawer

* **Trigger:** Accessible hamburger menu button (`<button aria-label="Toggle navigation menu" aria-expanded={isOpen}>`).
* **Drawer Behavior:** Slide-over or full-screen overlay animated using Motion (`AnimatePresence`).
* **Drawer Content:** Vertical list of navigation links, business contact phone number, operating hours summary, and a full-width "Get a Quote" CTA button.
* **Scroll Lock:** When the mobile menu is open, body scroll MUST be locked (`overflow-hidden`).
* **Focus Trap:** Keyboard focus MUST be trapped inside the drawer while open, and restored to the hamburger button upon closing.
