# Browtiful Strokes — Frontend Testing Plan

## 1. Testing Strategy
Our automated testing strategy utilizes Vitest, React Testing Library, and JSDOM to test mission-critical customer interactions without heavy E2E runner dependencies.

## 2. Test Suites Overview

### A. Cart Context (`src/tests/cart.test.jsx`)
* Empty cart initialization
* Adding single and multiple products with correct subtotal calculations
* Separate line creation for distinct product variants
* Quantity updates respecting inventory limits
* Item removal and cart clearing

### B. Checkout Validation (`src/tests/checkout.test.jsx`)
* Successful parse of valid customer delivery payload
* Rejection of short customer names (< 2 chars)
* Rejection of invalid phone numbers (non-standard lengths or characters)
* Rejection of incomplete street addresses (< 5 chars)
* Rejection of missing cities, states, and postal codes

### C. Catalog & Grouping (`src/tests/catalog.test.jsx`)
* Dynamic variant grouping of flat backend products into multi-size cards
* Price ordering of grouped variants
* Safe resolution of product image URLs (local, remote, fallback)

## 3. Running Tests
```bash
# Run all vitest suites
npm test

# Run tests in watch mode
npx vitest

# Run linter
npm run lint
```
