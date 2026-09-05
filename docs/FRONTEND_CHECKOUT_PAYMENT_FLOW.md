# Browtiful Strokes — Frontend Checkout & Payment Flow

## 1. Flow Diagram
```
Customer Clicks "Proceed to Checkout"
               │
               ▼
Navigates to /checkout (Cart items loaded)
               │
               ▼
Customer Fills Delivery Address (Validated via Zod)
               │
               ├─ State === Tamil Nadu?
               │    ├─ City === Chennai? ──> Shipping = ₹60 / kg
               │    └─ Rest of TN?       ──> Shipping = ₹80 / kg
               └─ State !== Tamil Nadu?  ──> Shipping Blocked (TN only notice)
               │
               ▼
Customer Clicks "Pay & Place Order"
               │
               ▼
POST /api/v1/orders (Submits items, addresses & calculated amounts)
               │
               ▼
Backend Reserves Stock & Creates Razorpay Order
               │
               ▼
Opens Razorpay Modal (Cards, UPI, Netbanking, Wallets)
               │
        ┌──────┴──────┐
     Success       Dismissed / Failed
        │             │
        ▼             ▼
POST /api/v1/payments/verify   Displays error toast / modal
        │                      Cart remains intact
        ▼
Verification OK (Status: PAID)
        │
        ▼
clearCart() -> Redirects to /order-success
```

## 2. Weight-Based Shipping Calculation
* **Total Weight Calculation**: `sum(item.weight * item.qty)` in grams.
* **Chargeable Weight**: Rounded up to the nearest integer kilogram: `Math.max(1, Math.ceil(totalWeightInGrams / 1000))`.
* **Geographical Tiers**:
  * **Chennai City**: ₹60 per chargeable kg.
  * **Rest of Tamil Nadu**: ₹80 per chargeable kg.
  * **Outside Tamil Nadu**: Inline notification requesting the customer to contact the studio directly via WhatsApp for out-of-state courier arrangements.

## 3. Demo Mode Fallback
* When `VITE_DEMO_MODE=true` is set, the application bypasses the live Razorpay SDK modal and generates a confirmed demo order directly, allowing offline and staging testing without requiring test bank cards.
