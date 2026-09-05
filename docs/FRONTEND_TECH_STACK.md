# Browtiful Strokes — Frontend Tech Stack

## 1. Core Framework & Build Tooling
* **React 19** (`react`, `react-dom`): Latest stable React release utilizing functional components and hooks.
* **Vite 8**: Next-generation frontend tooling providing lightning-fast Hot Module Replacement (HMR) and optimized Rolldown/ESBuild production bundling.
* **JavaScript (ES Modules)**: Strict pure JavaScript codebase without heavy TypeScript compilation overhead.

## 2. Styling & Design System
* **Tailwind CSS v4** (`@tailwindcss/postcss`, `postcss`, `autoprefixer`): Modern utility-first CSS framework configured with custom theme tokens (Forest Green, Henna Olive, Warm Cream, Beige, Gold).
* **Google Fonts**:
  * Headings: *Playfair Display* / *Cormorant Garamond* (Serif).
  * Body & Buttons: *Inter* / *Manrope* (Sans-serif).
* **Lucide React**: Crisp, modern icon set for UI indicators, shipping badges, and contact channels.

## 3. State Management & Data Fetching
* **Context API + `useReducer`**: Centralized, predictable state container for shopping cart operations (`CartContext.jsx`).
* **ToastContext**: Lightweight in-app toast notification queue for instant cart feedback and error alerts.
* **Axios**: Promised-based HTTP client with configured base URLs, timeouts, and standardized response interception.

## 4. Forms & Validation
* **React Hook Form**: High-performance, uncontrolled form management with minimal re-renders.
* **Zod**: Declarative schema validation ensuring all customer input matches backend data constraints.
* **@hookform/resolvers**: Seamless integration between React Hook Form and Zod schemas.

## 5. Payment Gateway
* **Razorpay Checkout JS**: Dynamic script loader embedding the official Razorpay test/production payment popup with HMAC verification flow.

## 6. Testing & Quality Assurance
* **Vitest**: Blazing fast native Vite unit test runner with Jest-compatible APIs.
* **React Testing Library**: DOM testing utilities for component interaction and behavior verification.
* **JSDOM**: In-memory headless browser environment for tests.
* **Oxlint**: Ultra-fast Rust-based linter ensuring code quality and hook compliance.
