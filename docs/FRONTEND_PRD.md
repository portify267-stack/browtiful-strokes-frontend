# Browtiful Strokes — Frontend Product Requirements Document (PRD)

## 1. Executive Summary & Objective
**Browtiful Strokes** is a specialized Mehendi e-commerce storefront combined with physical studio presence branding. The objective of this customer-facing frontend is to provide a seamless, mobile-first, high-converting shopping experience for organic mehendi products (henna powder, essential oils, cones, aftercare kits, application accessories, and combo packs), with direct Razorpay payment integration and instant order confirmation.

---

## 2. Target Audience & Personas
1. **Professional Mehendi Artists**: Purchasing bulk henna powders (250g, 500g, 1kg), essential oils (eucalyptus, tea tree, bridal blends), piping bags, filter cloths, and cone pins.
2. **Brides & Event Planners**: Seeking luxury bridal henna cones, aftercare balms/oils, sealant sprays, and curated bridal combo kits.
3. **Retail & DIY Henna Enthusiasts**: Looking for single cones, practice powders, and ready-to-use henna dip with clear usage and storage instructions.
4. **Studio Visitors**: Seeking location directions, working hours, and WhatsApp inquiry for bridal mehendi bookings and offline studio services.

---

## 3. Product Scope

### In-Scope Features
* **Single-Page Homepage Flow**: Fixed 12-section hierarchy designed for minimal friction:
  1. Sticky, responsive Header with live cart badge
  2. Hero Section with brand identity and dual CTAs
  3. Trust Highlights (3 key value propositions)
  4. Categories Grid with dynamic filtering trigger
  5. Best Sellers Section (`isBestSeller === true`)
  6. Curated Combo Offers Section (`isCombo === true`)
  7. Shop All Products with search, category chips, and variant selector
  8. Offline Studio Section (services, location, and studio pickup note)
  9. Mehendi Work Gallery with accessible modal lightbox
  10. Contact Section with synchronized inquiry info
  11. Brand Footer with policy links and social channels
  12. Floating WhatsApp inquiry button
* **Variant System**: Client-side grouping of flat database entries (e.g. 250g, 500g, 1kg) into unified product cards with dynamic price and stock updating.
* **Cart Drawer**: Non-intrusive slide-out drawer persisting across sessions (`localStorage`), supporting item increments/decrements, minimum order quantities (e.g. 20 for pre-rolled cones), and live subtotal calculations.
* **Checkout & Validation**: Full shipping and contact capture validated via Zod + React Hook Form, state-based shipping charge computation (Tamil Nadu / Chennai rules).
* **Payment Processing**: Direct integration with Razorpay Checkout modal, verifying HMAC signature via the backend prior to showing order confirmation.
* **Order Confirmation**: Clean confirmation screen (`/order-success`) with order ID, total summary, and WhatsApp confirmation CTA.

### Explicitly Excluded Features
* Customer accounts, login, signup, passwords, or session profiles.
* Wishlists, star ratings, review comment submissions.
* Coupon code engine, discount vouchers.
* Customer order history tracking dashboard.
* Separate multi-page product detail pages (all variants and details are handled smoothly in-place).
* External marketing trackers, chat bots, or intrusive popups.

---

## 4. Variant Behavior & Business Logic
* When products share a base name followed by ` - <Variant>` (e.g. `Henna Powder Luxury - 250 gm`, `Henna Powder Luxury - 500 gm`), the frontend automatically clusters them under `Henna Powder Luxury`.
* Each variant selector button displays the label, price, and active selection state.
* If a variant has `stock <= 0`, it is marked as out-of-stock and disabled.
* The cart identity consists of `(productId, variantLabel)`. Adding the same base product in two different sizes results in two distinct line items in the cart.
* Minimum order quantities (e.g., 20 units for pre-rolled cones) are enforced in both the product card and the cart drawer.

---

## 5. Checkout & Razorpay Acceptance Criteria
1. **Form Validation**:
   * Name: Minimum 2 characters, maximum 100 characters.
   * Phone: Exactly valid phone format (7 to 15 digits), matching Indian mobile numbers.
   * Street: Minimum 5 characters.
   * City & State: Required, minimum 2 characters.
   * Zip: 4 to 10 characters.
   * Country: Defaults to India.
2. **Order Creation**:
   * Posts verified items and quantities to `POST /api/v1/orders`.
   * Server validates pricing, stock availability, and creates the Razorpay order.
3. **Payment Verification**:
   * Customer completes transaction on the Razorpay popup.
   * Razorpay credentials (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`) are posted to `POST /api/v1/payments/verify`.
   * Only upon verified `PAID` status is the cart cleared and the user redirected to `/order-success`.
   * If payment is dismissed, cancelled, or fails verification, clear error messaging is displayed and the cart remains intact.

---

## 6. Definition of Done
* All 12 homepage sections render in exact sequence without layout shifts.
* Fully responsive across mobile (320px+), tablet, laptop, and desktop viewports.
* API loading skeletons, error states with retry buttons, and friendly empty states implemented across all sections.
* Automated unit tests pass (13+ tests) covering cart actions, variant splitting, grouping, and checkout validation.
* Production build compiles cleanly with code-splitting and asset optimization.
