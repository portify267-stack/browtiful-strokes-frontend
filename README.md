# Browtiful Strokes - Customer Frontend

This is the customer-facing frontend for **Browtiful Strokes**, an e-commerce platform for organic Mehendi products with an offline studio presence.

## Features

- **Responsive Single-Page Layout**: Smooth scroll links across sections (Hero, Trust, Categories, Bestsellers, Combos, All Products, Studio, Gallery, Contact, Footer).
- **Variant Grouping**: Frontend automatically groups products by sizes/volumes (e.g. 250 gm, 500 gm, 1 kg) from flat product lists.
- **CartDrawer Slide-out**: Manages selections, quantities, prices, and persistent localStorage sync.
- **Checkout form validation**: Handled via React Hook Form + Zod matching API constraints.
- **Secure Razorpay payment integration**: Server-side price validation, Razorpay order generation, signature callback verification.
- **Order Success flow**: Redirects to verified order details, with custom WhatsApp confirmations.

## Setup Instructions

### 1. Prerequisites
Ensure you have **Node.js** installed on your machine.

### 2. Backend Server Setup
From the repository root:
1. Copy environmental variables:
   ```bash
   cp .env.example .env
   ```
2. The remote database Atlas cluster might block connection if your IP is not whitelisted. To run with a pre-seeded local in-memory database wrapper, start the server using:
   ```bash
   node -r ./mock-db.js src/server.js
   ```
   The backend API will start successfully on `http://localhost:5000`.

### 3. Frontend App Setup
From the `frontend/` directory:
1. Install client dependencies:
   ```bash
   npm install
   ```
2. Launch the frontend development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (or the printed port) in your web browser.

## Tech Stack
- **Core**: React + Vite (JS)
- **Styling**: Tailwind CSS
- **State Management**: React Context API + `useReducer`
- **Form Handling**: React Hook Form + Zod
- **API Requests**: Axios
- **Animations**: GSAP
- **Icons**: Lucide React
- **Unit Tests**: Vitest + React Testing Library
