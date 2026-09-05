# Browtiful Strokes — Frontend Accessibility (a11y) Guide

## 1. Semantic Structure & Heading Hierarchy
* Exactly one `<h1>` per page (Hero banner on Home, page titles on Shop / Checkout / Policies).
* Proper nesting: `<h2>` for section headings, `<h3>` for individual product cards and modal dialog titles.
* Semantic elements utilized throughout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<dialog>` / `role="dialog"`.

## 2. Keyboard Navigation
* **Cart Drawer**: Pressing `Escape` closes the drawer; focus returns to the triggering cart button.
* **Combo Details & Gallery Modal**: Supports `Escape` to close, and left/right arrows for gallery navigation.
* **Focus States**: High-contrast gold focus rings (`focus:ring-2 focus:ring-gold/60 focus:outline-none`) on all form inputs and interactive buttons.

## 3. Screen Reader & ARIA Enhancements
* Meaningful `aria-label` tags on icon-only buttons (Cart counter, search clear, modal close icons, social links).
* Form error messaging connected with `aria-invalid="true"` and `role="alert"`.
* Decorative images include descriptive `alt` attributes depicting the mehendi work or product package.
