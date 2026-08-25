# Visual Hierarchy & Focal Points Skill — Neatly

This skill provides guidelines for establishing clear focal points, CTA priority, content visual flow, and scale contrast in **Neatly**.

---

## 1. The Focal Point Principle

Before designing or implementing any page section, answer this core question:

> **"What is the single most important element the user should look at first?"**

### Priority Order for Marketing Pages
1. **Primary Focal Point:** The main conversion hook or action trigger (e.g., Hero Headline + "Request a Free Quote" CTA button).
2. **Secondary Focal Point:** Immediate credibility proof (e.g., Trust Badges, Star Rating, Before/After Proof).
3. **Tertiary Focal Point:** Supporting explanatory copy and secondary navigation links.

---

## 2. CTA Hierarchy Rules

* **Primary CTA:** Exactly ONE primary solid button per section (`bg-primary text-primary-foreground shadow hover:bg-primary/90`).
* **Secondary CTA:** Ghost, outline, or subtle text button variant (`variant="outline"` or `variant="ghost"`).
* **CTA Placement:** Position primary CTAs above the fold in the Hero, sticky in mobile viewports, and prominently in the final bottom conversion banner.

---

## 3. Scale, Contrast & Visual Flow

* **Size Contrast:** Primary headings must be at least **2x the size** of body copy to establish immediate scanning structure.
* **Color Contrast:** Use high-contrast foreground color (`text-foreground`) for headings and muted text color (`text-muted-foreground`) for secondary explanatory copy.
* **Whitespace Isolation:** Surround primary conversion elements with extra whitespace (`my-6` or `my-8`) to draw the user's eye naturally without visual clutter.
