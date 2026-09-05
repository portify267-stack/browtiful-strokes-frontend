# Browtiful Strokes — Frontend Folder Structure

```
frontend/
├── dist/                          # Production build output
├── docs/                          # Comprehensive technical documentation
│   ├── FRONTEND_PRD.md
│   ├── FRONTEND_ARCHITECTURE.md
│   ├── FRONTEND_TECH_STACK.md
│   ├── FRONTEND_API_INTEGRATION.md
│   ├── FRONTEND_CART_FLOW.md
│   ├── FRONTEND_CHECKOUT_PAYMENT_FLOW.md
│   ├── ...
├── public/                        # Static assets (images, fallback icons, favicon)
│   ├── images/
│   │   ├── products/
│   │   ├── fallback.svg
│   │   └── ...
├── src/
│   ├── admin/                     # Admin management panel (code-split)
│   │   ├── components/            # Admin UI components
│   │   ├── layouts/               # Admin layout wrapper
│   │   ├── pages/                 # Dashboard, Orders, Products, Categories
│   │   ├── routes/                # Protected admin route guards
│   │   └── services/              # Admin Axios API layer
│   ├── api/                       # Centralized client API communication
│   │   ├── client.js              # Axios instance configuration
│   │   ├── categoryApi.js         # Fetch categories
│   │   ├── productApi.js          # Fetch products with filters
│   │   ├── orderApi.js            # Submit order creation
│   │   └── paymentApi.js          # Razorpay signature verification
│   ├── assets/                    # Bundled images and brand photography
│   ├── components/
│   │   ├── cart/                  # CartDrawer, CartItem, EmptyCart
│   │   ├── common/                # UIStates (Skeleton, Error, Empty), FloatingWhatsApp
│   │   ├── layout/                # Header (sticky & mobile menu), Footer
│   │   └── product/               # ProductCard, VariantSelector, ComboDetailsModal
│   ├── config/
│   │   ├── constants.js           # API base URLs, phone, email, Razorpay keys
│   │   └── images.js              # Local fallback and asset mapping
│   ├── context/
│   │   ├── CartContext.jsx        # Shopping cart state & localStorage sync
│   │   └── ToastContext.jsx       # Global in-app toast notification queue
│   ├── pages/
│   │   ├── Home.jsx               # Fixed 12-section customer storefront
│   │   ├── Shop.jsx               # Dedicated catalog browsing page
│   │   ├── Checkout.jsx           # Customer shipping form & Razorpay flow
│   │   ├── OrderSuccess.jsx       # Verified order confirmation screen
│   │   ├── PrivacyPolicy.jsx      # Legal policy
│   │   ├── TermsAndConditions.jsx # Legal policy
│   │   ├── ShippingDeliveryPolicy.jsx # Shipping terms & weight rules
│   │   └── CancellationRefundPolicy.jsx # Refund terms
│   ├── sections/                  # Homepage sections (in fixed sequence)
│   │   ├── HeroSection.jsx        # Section 2: Hero showcase
│   │   ├── TrustHighlights.jsx    # Section 3: Trust highlights
│   │   ├── CategoriesSection.jsx  # Section 4: Category grid
│   │   ├── BestSellersSection.jsx # Section 5: Bestselling products
│   │   ├── ComboOffersSection.jsx # Section 6: Curated combo kits
│   │   ├── AllProductsSection.jsx # Section 7: Catalog with filters
│   │   ├── StudioSection.jsx      # Section 8: Offline studio & services
│   │   ├── GallerySection.jsx     # Section 9: Mehendi work & lightbox
│   │   └── ContactSection.jsx     # Section 10: Studio contact & map
│   ├── tests/                     # Unit and integration test suites
│   │   ├── cart.test.jsx          # Cart operations & variant separation
│   │   ├── checkout.test.jsx      # Zod validation & form rules
│   │   └── catalog.test.jsx       # Variant grouping & image resolution
│   ├── utils/
│   │   ├── productUtils.js        # Grouping & variant parsing utilities
│   │   └── categoryImageHelper.js # Dynamic category image fallback
│   ├── validation/
│   │   └── checkoutSchema.js      # Zod schema for checkout details
│   ├── App.css
│   ├── App.jsx                    # Root routing & layout definition
│   ├── index.css                  # Tailwind styles & theme variables
│   └── main.jsx                   # React DOM entry point
├── .env                           # Local environment variables (ignored)
├── .env.example                   # Template environment configuration
├── package.json
├── vite.config.js                 # Vite bundler configuration
└── vitest.config.js               # Vitest runner configuration
```
