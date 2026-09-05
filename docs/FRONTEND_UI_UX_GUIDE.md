# Browtiful Strokes — Frontend UI/UX Guide

## 1. User Experience Philosophy
* **Zero Cognitive Friction**: Customers are never forced to navigate to nested product detail pages to find simple pricing and size variations. The variant selector exists directly on the card.
* **Respectful Communication**: No artificial scarcity counters ("Only 2 left!"), fake discount tickers, or deceptive popups. Transparent descriptions clearly state kit contents, weight, and delivery zones.
* **Continuous Visual Feedback**:
  * Adding an item opens a transient toast with an explicit "View Cart" action.
  * In-card quantity steppers allow immediate increment/decrement without needing to open the cart.
  * Live badge updates on the sticky header reflect cart counts.

## 2. Micro-Interactions
* **Card Hover**: Subtle `translate-y-[-2px]` lift with shadow transition.
* **Variant Pills**: Smooth background and text color transition with clear active border.
* **Cart Drawer**: Smooth ease-out slide animation with dimmed backdrop and body scroll lock.
* **Gallery Lightbox**: Smooth image magnification with modal backdrop, previous/next arrows, and keyboard ESC closure.

## 3. Responsive Adaptations
* **Mobile (320px – 640px)**:
  * Categories display as an edge-to-edge horizontally scrollable snap-strip.
  * Sticky bottom CTA appears when cart has items.
  * Compact single-column checkout form.
* **Tablet (641px – 1024px)**:
  * 2-column product grid with comfortable touch targets.
* **Desktop (1025px+)**:
  * 3 or 4-column product grid with side-by-side checkout summary.
