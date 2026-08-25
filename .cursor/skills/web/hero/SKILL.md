# Conversion Hero Section Skill — Neatly

This skill provides guidelines for composing, orchestrating, and optimizing the Hero conversion experience in **Neatly**.

---

## 1. The 5-Second Hero Clarity Mandate

The Hero section MUST immediately answer four critical customer questions within 5 seconds of landing:
1. **What is Neatly?** A premium, trustworthy professional cleaning service.
2. **What service does it provide?** Residential and commercial cleaning tailored to property needs.
3. **Why trust Neatly?** Insured, background-checked staff, 100% satisfaction guarantee.
4. **What to do next?** Request a customized price quote.

---

## 2. Hero Elements & Layout

* **Headline:** Bold, high-contrast title focusing on peace of mind and pristine cleanliness (e.g., *"Pristine Spaces. Effortless Living."*).
* **Supporting Message:** 2-3 lines explaining Neatly's high standards, eco-friendly products, and reliability.
* **Primary Action:** High-contrast button labeled *"Request a Free Quote"* leading directly to `/quote`.
* **Secondary Action:** Ghost or outline button labeled *"Explore Services"* leading to `/services`.
* **Trust Badges:** Compact visual badges directly beneath CTAs (*"⭐ 4.9/5 Rating from 250+ Clients"*, *"Shield Icon: Licensed & Insured"*).
* **Hero Imagery:** Warm, bright, high-resolution photography showcasing an immaculate living room or professional workspace. Use Next.js `<Image priority>` to guarantee fast LCP.

---

## 3. Responsive Hero Behavior

* **Mobile Viewport (`< lg`):** Single column stack (Headline -> Copy -> Full-width CTAs -> Trust Badges -> Hero Image).
* **Desktop Viewport (`>= lg`):** 2-column split (Left 5 cols: Copy & CTAs; Right 7 cols: Media Showcase).
