# Browtiful Strokes — Frontend Cart Flow

## 1. Cart State Structure
The shopping cart state is managed inside `src/context/CartContext.jsx` using `useReducer`. Each item in the `cart` array contains:
```javascript
{
  productId: "661b3333abcd5678ef902001",
  name: "Henna Powder Luxury",
  variant: "250 gm",
  price: 150,
  image: "/uploads/powder.jpeg",
  stock: 50,
  weight: 250,
  qty: 1,
  minOrderQty: 1,
  minQuantity: 1
}
```

## 2. Key Business Rules
1. **Variant Identity Separation**:
   * Items are unique by the compound key `(productId, variant)`.
   * Adding "Henna Powder Luxury - 250 gm" and then "Henna Powder Luxury - 500 gm" produces two independent line items with distinct prices, weights, and quantity counters.
2. **Stock Limits**:
   * Incrementing beyond `item.stock` is prevented both on the card and in the drawer.
   * A toast notification alerts the user: `"Quantity exceeds available stock."`
3. **Minimum Order Quantities (MOQ)**:
   * Products like "Pre-Rolled Cones" enforce a minimum quantity of 20 pieces.
   * Decreasing quantity below 20 triggers: `"Minimum order quantity is 20 pcs."`
4. **Local Persistence**:
   * The `cart` state persists across page reloads and tab closures via `localStorage.getItem('browtiful_strokes_cart')`.
   * Sensitive payment state or tokens are never placed in `localStorage`.
5. **Subtotal Calculation**:
   * `getSubtotal()` calculates `sum(item.price * item.qty)` for all cart items in real time.
