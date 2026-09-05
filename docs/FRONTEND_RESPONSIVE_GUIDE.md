# Browtiful Strokes — Frontend Responsive Guide

## 1. Breakpoint Strategy
Tailwind standard breakpoints are strictly followed:
* **Mobile (`< 640px`)**:
  * Edge-to-edge typography and reduced section paddings (`py-8`).
  * Horizontal scroll snaps for categories.
  * Sticky bottom action bar in Cart drawer.
  * 1-column product layout.
* **Tablet (`sm: 640px` to `md: 768px`)**:
  * 2-column product catalog grid.
  * 2-column contact details and footer blocks.
* **Laptop (`lg: 1024px`)**:
  * 3 or 4-column product grid.
  * Side-by-side checkout summary and form inputs.
* **Desktop (`xl: 1280px`+)**:
  * Centered maximum container width `max-w-7xl` with balanced negative whitespace.

## 2. Touch Friendliness & Mobile Optimizations
* Minimum tap target height of 44px on all interactive buttons, quantity selectors, and mobile menu items.
* Touch-friendly swipe support on mobile category chips.
* Virtual keyboard awareness on checkout inputs (appropriate `type="tel"`, `inputMode="numeric"`, `autoComplete` attributes).
