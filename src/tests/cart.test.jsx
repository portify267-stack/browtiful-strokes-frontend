import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

const TestCartConsumer = () => {
  const { cart, addToCart, removeFromCart, updateQty, getSubtotal, getItemCount } = useCart();

  const mockProduct1 = {
    _id: 'prod-1',
    name: 'Luxury Henna Powder - 250g',
    price: 150,
    stock: 5,
    images: ['/image1.jpg']
  };

  const mockProduct2 = {
    _id: 'prod-2',
    name: 'Luxury Henna Powder - 500g',
    price: 230,
    stock: 2,
    images: ['/image2.jpg']
  };

  return (
    <div>
      <div data-testid="item-count">{getItemCount()}</div>
      <div data-testid="subtotal">{getSubtotal()}</div>
      
      <button onClick={() => addToCart(mockProduct1, '250g')} data-testid="add-prod1">Add Product 1</button>
      <button onClick={() => addToCart(mockProduct2, '500g')} data-testid="add-prod2">Add Product 2</button>
      <button onClick={() => removeFromCart('prod-1')} data-testid="remove-prod1">Remove Product 1</button>
      <button onClick={() => updateQty('prod-1', 3)} data-testid="update-prod1">Update Qty Product 1</button>
      <button onClick={() => updateQty('prod-2', 5)} data-testid="update-prod2-exceed">Update Qty Product 2 Exceed</button>

      <div data-testid="cart-items">
        {cart.map(item => (
          <div key={item.productId} data-testid={`cart-item-${item.productId}`}>
            {item.name} - {item.variant} - Qty: {item.qty} - Price: {item.price}
          </div>
        ))}
      </div>
    </div>
  );
};

describe('Cart context operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with an empty cart', () => {
    render(
      <CartProvider>
        <TestCartConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('subtotal').textContent).toBe('0');
  });

  it('should add products to cart and calculate correct subtotals', async () => {
    render(
      <CartProvider>
        <TestCartConsumer />
      </CartProvider>
    );

    const btn1 = screen.getByTestId('add-prod1');
    const btn2 = screen.getByTestId('add-prod2');

    await act(async () => {
      fireEvent.click(btn1);
    });
    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('subtotal').textContent).toBe('150');

    await act(async () => {
      fireEvent.click(btn2);
    });
    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('subtotal').textContent).toBe('380');

    await act(async () => {
      fireEvent.click(btn1);
    });
    expect(screen.getByTestId('item-count').textContent).toBe('3');
    expect(screen.getByTestId('subtotal').textContent).toBe('530');
  });

  it('should update item quantities within stock constraints', async () => {
    render(
      <CartProvider>
        <TestCartConsumer />
      </CartProvider>
    );

    const btn1 = screen.getByTestId('add-prod1');
    const btnUpdate = screen.getByTestId('update-prod1');

    await act(async () => {
      fireEvent.click(btn1);
    });
    expect(screen.getByTestId('item-count').textContent).toBe('1');

    await act(async () => {
      fireEvent.click(btnUpdate);
    });
    expect(screen.getByTestId('item-count').textContent).toBe('3');
    expect(screen.getByTestId('subtotal').textContent).toBe('450');
  });

  it('should remove items from the cart', async () => {
    render(
      <CartProvider>
        <TestCartConsumer />
      </CartProvider>
    );

    const btn1 = screen.getByTestId('add-prod1');
    const btnRemove = screen.getByTestId('remove-prod1');

    await act(async () => {
      fireEvent.click(btn1);
    });
    expect(screen.getByTestId('item-count').textContent).toBe('1');

    await act(async () => {
      fireEvent.click(btnRemove);
    });
    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('subtotal').textContent).toBe('0');
  });

  it('should maintain separate lines for different variants of the same product line', async () => {
    render(
      <CartProvider>
        <TestCartConsumer />
      </CartProvider>
    );

    const btn1 = screen.getByTestId('add-prod1');
    const btn2 = screen.getByTestId('add-prod2');

    await act(async () => {
      fireEvent.click(btn1);
    });
    await act(async () => {
      fireEvent.click(btn2);
    });

    // Both products exist as separate lines in cart
    expect(screen.getByTestId('cart-item-prod-1')).toBeDefined();
    expect(screen.getByTestId('cart-item-prod-2')).toBeDefined();
    expect(screen.getByTestId('item-count').textContent).toBe('2');
    expect(screen.getByTestId('subtotal').textContent).toBe('380');
  });
});
