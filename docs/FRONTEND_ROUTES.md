# Browtiful Strokes — Frontend Routes Guide

## 1. Route Map Overview
Routing is managed by `react-router-dom` in `src/App.jsx`. Customer pages are wrapped in `CustomerLayout` (providing the persistent Header, CartDrawer, and Footer).

| Route | Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public | Main one-page storefront (Hero, Trust, Categories, Best Sellers, Combos, All Products, Studio, Gallery, Contact) |
| `/shop` | `Shop.jsx` | Public | Dedicated full-page product browsing and category filtering |
| `/checkout` | `Checkout.jsx` | Public | Shipping details entry, weight-based shipping calculation & Razorpay checkout |
| `/order-success` | `OrderSuccess.jsx` | Public | Verified order confirmation screen displaying order ID and WhatsApp support CTA |
| `/privacy-policy` | `PrivacyPolicy.jsx` | Public | Privacy policy disclosure for customer data protection |
| `/terms-and-conditions` | `TermsAndConditions.jsx` | Public | Legal terms of service, orders, and studio bookings |
| `/shipping-delivery-policy` | `ShippingDeliveryPolicy.jsx` | Public | Delivery zones (Tamil Nadu / Chennai), shipping charges, and dispatch timelines |
| `/cancellation-refund-policy` | `CancellationRefundPolicy.jsx` | Public | Policies on order cancellations, perishable henna items, and damaged goods |
| `/admin/login` | `AdminLogin.jsx` | Public | Administrative authentication credentials form |
| `/admin/*` | `AdminLayout.jsx` | Protected | Authenticated administration dashboard for products, categories, and orders |

## 2. Navigation & Hash Scrolling Rules
* When navigating on the Home page (`/`), links like `#categories`, `#bestsellers`, `#combos`, `#allproducts`, `#gallery`, `#contact` execute smooth in-page scrolling with navbar offset compensation.
* When navigating to hash anchors from a secondary page (e.g. `/shop` or `/privacy-policy`), the application smoothly transitions back to `/` before scrolling to the desired section.
