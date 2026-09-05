# Browtiful Strokes — Frontend Components Guide

## 1. Layout Components
* **`Header.jsx`**: Sticky navigation bar. Includes brand logo, text "Browtiful Strokes", smooth-scroll navigation links (`Home`, `Categories`, `Best Sellers`, `Combos`, `All Products`, `Gallery`, `Contact`, `Shop`), mobile hamburger drawer, and live cart icon with quantity badge. Compacts background on scroll.
* **`Footer.jsx`**: Forest green footer with brand summary, physical address, working hours, phone, email, direct Instagram/WhatsApp/Maps links, expandable quick links, policy links, and copyright statement.

## 2. Product Components
* **`ProductCard.jsx`**: Card rendering product imagery, category tag, title, description, variant selector, price display, and stock-aware add-to-cart button.
  * Dynamically recalculates price and availability when different variant pills are selected.
  * Prevents adding items when stock is zero.
  * Shows in-card quantity incrementer once an item is present in the cart.
* **`VariantSelector.jsx`**: Pill-based radio selector displaying available weights (e.g. 250g, 500g, 1kg) with active indicators and disabled out-of-stock states.
* **`ComboDetailsModal.jsx`**: Modal dialog triggered on combo cards detailing kit components, pack contents, and application instructions.

## 3. Cart Components
* **`CartDrawer.jsx`**: Right-side slide-over panel displaying:
  * List of items with thumbnail, base name, variant label, item price, and total line price.
  * In-line increment/decrement buttons adhering to minimum order quantities (e.g. 20 for cones).
  * Direct trash button for removing line items.
  * Real-time order subtotal calculation.
  * Sticky checkout CTA directing to `/checkout`.
  * Keyboard ESC and backdrop click dismissal.

## 4. Common & Feedback Components
* **`UIStates.jsx`**:
  * `SectionHeading`: Standardized serif title with accent line and subtitle.
  * `LoadingSkeleton`: Shimmering placeholder grid matching product and category layouts.
  * `ErrorState`: Alert box with error details and prominent "Try Again" retry action.
  * `EmptyState`: Friendly notification when search returns zero results or category is empty.
* **`FloatingWhatsApp.jsx`**: Bottom-right floating badge enabling one-click customer messaging to the studio's verified WhatsApp business number.
