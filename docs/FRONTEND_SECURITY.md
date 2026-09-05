# Browtiful Strokes — Frontend Security Best Practices

## 1. Zero Sensitive Storage
* No credit card numbers, CVVs, netbanking credentials, or admin passwords are ever captured or stored on the frontend.
* The frontend relies entirely on Razorpay's PCI-DSS compliant checkout iframe.
* `localStorage` stores only public product IDs, variant labels, and quantities (`browtiful_strokes_cart`).

## 2. Input Sanitization & Cross-Site Scripting (XSS)
* Customer inputs in checkout (Name, Address, Phone) are sanitized through React's native JSX escaping and validated using strict Zod regex schemas.
* Dangerous APIs (`dangerouslySetInnerHTML`) are strictly forbidden across the codebase.

## 3. Cryptographic Signature Verification
* Client-side Razorpay callbacks pass `razorpay_signature`, `razorpay_order_id`, and `razorpay_payment_id` directly to the backend verification endpoint.
* The frontend never issues order fulfillment or success states without an affirmative `200 OK` and `{ paymentStatus: 'PAID' }` from the server.
