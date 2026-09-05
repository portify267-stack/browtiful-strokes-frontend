# Browtiful Strokes — Frontend API Integration

## 1. API Client Configuration
All HTTP requests route through the configured Axios client in `src/api/client.js`:
* **Base URL**: `VITE_API_URL` (default: `http://localhost:5000/api/v1` locally, or production backend URL).
* **Headers**: `Content-Type: application/json`.
* **Standardized Responses**: Axios response interceptors extract `response.data.data` or `response.data`, ensuring uniform response structure.

## 2. Customer Endpoint Specifications

### Categories
* **`GET /api/v1/categories`**: Retrieves all active product categories.
  * Used in: `CategoriesSection.jsx`, category filter chips.

### Products
* **`GET /api/v1/products`**: Retrieves filtered product lists.
  * Query parameters:
    * `category`: Category ID filter
    * `search`: Debounced text search
    * `limit`: Page size (default: 8 or 20)
    * `page`: Page index
    * `isBestSeller`: Boolean filter
    * `isCombo`: Boolean filter

### Orders & Payment
* **`POST /api/v1/orders`**: Submits customer shipping details and cart items to reserve stock and generate a Razorpay order.
  * Payload:
    ```json
    {
      "customerName": "Priya Sharma",
      "phone": "9876543210",
      "address": {
        "street": "12 Temple Street",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "zip": "600017",
        "country": "India"
      },
      "items": [
        { "productId": "661b3333abcd5678ef902001", "qty": 2 }
      ],
      "subtotal": 300,
      "shippingCharge": 60,
      "totalAmount": 360
    }
    ```
  * Response: `{ order: { _id, ... }, razorpayOptions: { key, amount, currency, order_id } }`

* **`POST /api/v1/payments/verify`**: Submits the signature received from the Razorpay checkout modal for cryptographic verification.
  * Payload:
    ```json
    {
      "razorpay_order_id": "order_xyz123",
      "razorpay_payment_id": "pay_abc456",
      "razorpay_signature": "hmac_signature_string"
    }
    ```
  * Response: `{ success: true, paymentStatus: "PAID" }`
