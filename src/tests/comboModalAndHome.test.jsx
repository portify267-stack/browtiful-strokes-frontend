import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import ProductCard from '../components/product/ProductCard';
import ComboDetailsModal from '../components/product/ComboDetailsModal';
import CartDrawer from '../components/cart/CartDrawer';
import Home from '../pages/Home';
import { groupProducts } from '../utils/productUtils';
import { products as mockProducts } from '../config/demoData';

const CartInspector = () => {
  const { cart, getSubtotal } = useCart();
  return (
    <div>
      <div data-testid="cart-subtotal">{getSubtotal()}</div>
      <div data-testid="cart-item-count">{cart.length}</div>
      {cart.map((item, idx) => (
        <div key={idx} data-testid={`cart-row-${idx}`}>
          <span data-testid={`price-${idx}`}>{item.price}</span>
          <span data-testid={`qty-${idx}`}>{item.qty}</span>
          <span data-testid={`line-total-${idx}`}>{item.price * item.qty}</span>
        </div>
      ))}
    </div>
  );
};

describe('Combo Details Modal & Pricing Integrity', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const combos = mockProducts.filter((p) => p.isCombo);

  combos.forEach((rawCombo) => {
    it(`should display matching price on normal card and modal for "${rawCombo.name}" without NaN`, async () => {
      const grouped = groupProducts([rawCombo])[0];

      render(
        <MemoryRouter>
          <ToastProvider>
            <CartProvider>
              <ProductCard product={grouped} />
              <CartInspector />
            </CartProvider>
          </ToastProvider>
        </MemoryRouter>
      );

      // Verify card displays the correct price
      const cardPrice = screen.getByText(`₹${rawCombo.price}`);
      expect(cardPrice).toBeDefined();

      // Open View Details Modal
      const viewDetailsBtn = screen.getByRole('button', { name: /view details/i });
      await act(async () => {
        fireEvent.click(viewDetailsBtn);
      });

      // Verify modal is open and has the exact same price
      const modalPriceElements = screen.getAllByText(`₹${rawCombo.price}`);
      expect(modalPriceElements.length).toBeGreaterThanOrEqual(2); // One on card, one in modal

      // Verify no NaN or undefined text exists
      expect(screen.queryByText(/NaN/i)).toBeNull();
      expect(screen.queryByText(/₹undefined/i)).toBeNull();

      // Modal details container
      const modalHeader = screen.getByText('Combo Offer Details');
      const modalContainer = modalHeader.closest('.animate-scale-in') || modalHeader.closest('div');
      expect(modalContainer).toBeDefined();

      // Find the Add to Cart button specifically inside the modal
      const modalButtons = modalContainer.querySelectorAll('button');
      const addToCartModalBtn = Array.from(modalButtons).find(b => b.textContent.includes('Add to Cart'));
      expect(addToCartModalBtn).toBeDefined();

      await act(async () => {
        fireEvent.click(addToCartModalBtn);
      });

      // Verify cart subtotal is numeric and equals combo price (1 qty)
      const subtotalEl = screen.getByTestId('cart-subtotal');
      expect(subtotalEl.textContent).toBe(String(rawCombo.price));
      expect(Number(subtotalEl.textContent)).not.toBeNaN();
    });
  });

  it('should handle quantity increase in modal and calculate exact subtotal in cart', async () => {
    const rawCombo = combos[0]; // Combo 1, price: 199
    const grouped = groupProducts([rawCombo])[0];

    render(
      <MemoryRouter>
        <ToastProvider>
          <CartProvider>
            <ComboDetailsModal
              product={grouped}
              variant={grouped.variants[0]}
              isOpen={true}
              onClose={() => {}}
            />
            <CartInspector />
          </CartProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    // Verify modal price
    expect(screen.getByText(`₹${rawCombo.price}`)).toBeDefined();

    // Find increment button
    const buttons = screen.getAllByRole('button');
    // Button with plus icon is the last small button before Add to Cart
    // Let's click plus
    const plusBtn = buttons.find((b) => b.querySelector('svg.lucide-plus'));
    expect(plusBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(plusBtn);
    });

    // Qty is now 2
    expect(screen.getByText('2')).toBeDefined();

    // Click Add to Cart
    const addBtn = screen.getByRole('button', { name: /add to cart/i });
    await act(async () => {
      fireEvent.click(addBtn);
    });

    // Subtotal should be 199 * 2 = 398
    const subtotal = screen.getByTestId('cart-subtotal').textContent;
    expect(subtotal).toBe(String(rawCombo.price * 2));
    expect(Number(subtotal)).not.toBeNaN();

    // Verify line items have valid numbers
    expect(screen.getByTestId('price-0').textContent).toBe(String(rawCombo.price));
    expect(screen.getByTestId('qty-0').textContent).toBe('2');
    expect(screen.getByTestId('line-total-0').textContent).toBe(String(rawCombo.price * 2));
  });

  it('verifies full checkout total and no NaN when adding combo from modal', async () => {
    const rawCombo = combos[1]; // Combo 2, price: 999
    const grouped = groupProducts([rawCombo])[0];

    const FullAppFlow = () => {
      return (
        <MemoryRouter initialEntries={['/']}>
          <ToastProvider>
            <CartProvider>
              <ProductCard product={grouped} />
              <CartDrawer isOpen={true} onClose={() => {}} />
            </CartProvider>
          </ToastProvider>
        </MemoryRouter>
      );
    };

    render(<FullAppFlow />);

    // 1. Normal combo card has correct price
    expect(screen.getByText(`₹${rawCombo.price}`)).toBeDefined();

    // 2. Open modal
    const viewDetailsBtn = screen.getByRole('button', { name: /view details/i });
    await act(async () => {
      fireEvent.click(viewDetailsBtn);
    });

    // 3. Modal has same price
    const modalHeader = screen.getByText('Combo Offer Details');
    const modalContainer = modalHeader.closest('.animate-scale-in') || modalHeader.closest('div');
    const modalPrice = modalContainer.querySelector('.text-xl.font-bold');
    expect(modalPrice.textContent.trim()).toBe(`₹${rawCombo.price}`);

    // 4. Increase quantity to 2
    const plusBtn = modalContainer.querySelector('svg.lucide-plus').closest('button');
    await act(async () => {
      fireEvent.click(plusBtn);
    });

    // Decrease quantity back to 1
    const minusBtn = modalContainer.querySelector('svg.lucide-minus').closest('button');
    await act(async () => {
      fireEvent.click(minusBtn);
    });

    // Increase again to 2
    await act(async () => {
      fireEvent.click(plusBtn);
    });

    // 5. Add to Cart from modal
    const modalButtons = modalContainer.querySelectorAll('button');
    const addToCartModalBtn = Array.from(modalButtons).find(b => b.textContent.includes('Add to Cart'));
    await act(async () => {
      fireEvent.click(addToCartModalBtn);
    });

    // 6. Cart Drawer shows correct subtotal and line total: 999 * 2 = 1998, no NaN
    const expectedTotal = `₹${rawCombo.price * 2}`;
    expect(screen.getAllByText(expectedTotal).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/NaN/i)).toBeNull();

    // 7. Verify normal card counter now shows 2
    const cardCounter = screen.getByText(/Add to Cart 2/i);
    expect(cardCounter).toBeDefined();
  });
});

describe('Home Page Clean Removal of Specified Sections', () => {
  it('should not contain "Premium Quality Products", "Offline Mehendi Studio", or "Secure Online Payments"', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <CartProvider>
            <Home />
          </CartProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    // The three trust highlight sections must be removed
    expect(screen.queryByText('Premium Quality Products')).toBeNull();
    expect(screen.queryByText('Secure Online Payments')).toBeNull();
    // Offline Mehendi Studio was the title of highlight card #2
    expect(screen.queryByText('Offline Mehendi Studio')).toBeNull();

    // Other home sections should still be present
    expect(screen.getByText(/Visit Browtiful Strokes Studio/i)).toBeDefined();
  });
});
