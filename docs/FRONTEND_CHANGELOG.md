# Browtiful Strokes — Frontend Changelog

## [1.0.0] - 2026-09-05

### Added
- **Core Architecture**: React 19 + Vite 8 + Tailwind CSS design system with custom brand color tokens and serif typography.
- **Fixed 12-Section Flow**: Implemented exact section order on `Home.jsx`: Header, Hero, Trust Highlights, Categories, Best Sellers, Combos, All Products, Studio, Gallery, Contact, Footer, Floating WhatsApp.
- **Dynamic Variant Grouping**: Synthesizes multi-variant cards (e.g. 250g, 500g, 1kg) from flat backend records with reactive pricing and inventory checks.
- **Context API Cart**: Full drawer state with session `localStorage` persistence, MOQ validation, and separate line preservation per variant.
- **Checkout & Razorpay**: Integrated Zod validation, Tamil Nadu / Chennai weight-based shipping calculation, and Razorpay signature verification.
- **Test Coverage**: 13 comprehensive unit tests across Cart operations, Checkout form validation, and Catalog utilities.
- **Comprehensive Docs**: 20 synchronized technical documentation guides in `frontend/docs/`.
