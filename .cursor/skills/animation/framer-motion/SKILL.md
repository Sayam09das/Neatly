# Motion (Framer Motion) Skill — Neatly

This skill provides guidelines for implementing component-level interactive UI state transitions using **Motion** (Framer Motion) in **Neatly**.

---

## 1. When to Use Motion

Motion is Neatly's designated tool for interactive UI state transitions:
* **Primary Use Cases:**
  * Modal dialog entrance and exit transitions (`AnimatePresence`).
  * Mobile navigation overlay/drawer slide-overs.
  * Accordion open/close expansion (`layoutId` & height transitions).
  * Tab switcher active indicator transitions.
  * Toast notifications and inline error alert fade-ins.
* **When NOT to Use Motion:**
  * DO NOT use Motion for full page scroll storytelling or pinned timeline reveals (use GSAP + ScrollTrigger).
  * DO NOT use Motion for global smooth scrolling (use Lenis).
  * DO NOT use Motion for simple CSS hover button color changes (use native Tailwind CSS transitions).

---

## 2. Best Practices & Optimization

### Spring Physics vs. Duration
* For UI popups, tabs, and micro-interactions, use subtle spring physics (`type: "spring", stiffness: 400, damping: 30`) or clean cubic-bezier easing (`ease: [0.16, 1, 0.3, 1]`, `duration: 0.25`).
* Avoid overly bouncy or elastic springs that make the interface feel playful or cartoonish.

### Presence & Exit Animations
Always wrap conditionally rendered components in `<AnimatePresence>` to enable smooth exit animations:

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function AccessibleModal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative z-10 w-full max-w-lg rounded-xl bg-background p-6 shadow-xl border border-border"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

---

## 3. Reduced Motion Support

Motion includes built-in hooks for respecting OS reduced motion preferences:

```tsx
import { useReducedMotion, motion } from "framer-motion";

export function MotionCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Content */}
    </motion.div>
  );
}
```
