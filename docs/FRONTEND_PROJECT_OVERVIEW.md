# Browtiful Strokes — Frontend Project Overview

## 1. Brand & Business Context
**Browtiful Strokes** is an organic Mehendi brand providing natural Rajasthani henna products and customized mehendi artistry services. Based out of Chennai, Tamil Nadu, the brand balances a direct-to-consumer e-commerce model with physical studio bookings and consultations.

## 2. Core Frontend Principles
* **Frictionless Shopping**: The customer can arrive on the site, inspect categories, choose powder/oil sizes, add items to a slide-out cart, fill in delivery details, and pay securely via Razorpay without navigating through bloated, multi-step page funnels.
* **Warm Natural Aesthetic**: Adheres strictly to the brand identity palette—Deep Forest Green (`#173D2D`), Henna Olive (`#556B2F`), Warm Cream (`#FBF6EC`), Soft Beige (`#EFE2CC`), and Muted Gold (`#B6924B`), paired with elegant serif typography (`Playfair Display`) and clean sans-serif UI typography (`Inter`).
* **Source of Truth Integrity**: Frontend calculates preview subtotals for user delight, but delegates all final price calculations, weight rules, and stock commitments to the Node.js backend.
* **Offline Studio Co-Existence**: The storefront showcases the physical studio's address, working hours, directions, and sample bridal mehendi artwork, allowing customers to easily book services via direct WhatsApp channels.

## 3. Key Modules
1. **Catalog & Showcase**: Dynamic fetching of categories, bestsellers, combo kits, and standard products with debounced search and category filter pills.
2. **Cart & Local Persistence**: State powered by Context API and `useReducer` with automatic synchronization to browser `localStorage`.
3. **Checkout & Gateway**: React Hook Form with Zod schema verification and direct client integration with Razorpay Checkout SDK.
4. **Studio & Gallery**: Responsive gallery grid with modal lightbox navigation, keyboard escapes, and direct directions to the studio.
