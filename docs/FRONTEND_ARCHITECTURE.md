# Browtiful Strokes — Frontend Architecture

## 1. Architectural Overview
The Browtiful Strokes frontend architecture follows a modular, feature-oriented structure with clear separation of concerns across API communication, business state, UI presentation, and page routing.

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser View                          │
│     (Home One-Page Flow, Shop Catalog, Checkout, Success)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────┐             ┌───────────────────────┐
│     UI Components     │             │    Customer Layout    │
│ (Sections, Cards,     │             │ (Header, Nav, Footer, │
│  Modals, Drawers)     │             │  Floating WhatsApp)   │
└───────────┬───────────┘             └───────────┬───────────┘
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application State Layer                     │
│    • CartContext (useReducer + localStorage synchronization)│
│    • ToastContext (Notification dispatcher)                 │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Service Layer                       │
│    • apiClient (Axios instance with baseURL & error mapper) │
│    • categoryApi, productApi, orderApi, paymentApi          │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Node.js / Express REST Backend               │
│          (Authoritative Pricing, Stock & Razorpay)          │
└─────────────────────────────────────────────────────────────┘
```

## 2. Key Architectural Patterns
1. **Unidirectional Data Flow**: State modifications dispatch action payloads through `CartContext` which updates in-memory state and synchronizes non-sensitive cart lines to `localStorage`.
2. **Dynamic Variant Synthesis**: The backend stores products flatly. The frontend uses `groupProducts()` in `src/utils/productUtils.js` to dynamically synthesize grouped product cards with selectable weights and prices.
3. **Optimistic UI with Authoritative Verification**: Customer adds items and views subtotals instantly. However, upon submitting the checkout form, the backend re-validates stock levels, weight tiers, and calculates the exact order amount before dispatching Razorpay credentials.
4. **Resilient Network States**: Every API-dependent section exposes three clear states:
   * **Loading**: Clean animated skeletons preventing layout shifts.
   * **Error**: Friendly messages with explicit "Retry" buttons.
   * **Empty**: Polished empty state with contextual icons and friendly copy.
