import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { productId, name, variant, price, image, stock, weight = 0, qty = 1, minQuantity, minOrderQty } = action.payload;
      const itemMinQty = minQuantity || minOrderQty || (name && name.toLowerCase().includes('pre-rolled') ? 20 : 1);
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === productId && item.variant === variant
      );

      let newItems;
      if (existingItemIndex !== -1) {
        newItems = state.items.map((item, idx) => {
          if (idx === existingItemIndex) {
            const addAmount = (qty === 1 && item.qty < itemMinQty) ? (itemMinQty - item.qty) : qty;
            const newQty = Math.min(item.qty + addAmount, stock);
            return { ...item, qty: newQty };
          }
          return item;
        });
      } else {
        const initialQty = Math.max(qty, itemMinQty);
        newItems = [...state.items, { productId, name, variant, price, image, stock, weight, qty: initialQty, minQuantity: itemMinQty, minOrderQty: itemMinQty }];
      }

      return { ...state, items: newItems };
    }

    case 'REMOVE_FROM_CART': {
      const { productId, variant } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => !(item.productId === productId && item.variant === variant)),
      };
    }

    case 'UPDATE_QTY': {
      const { productId, variant, qty } = action.payload;
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.productId === productId && item.variant === variant) {
            const minQty = item.minQuantity || item.minOrderQty || (item.name && item.name.toLowerCase().includes('pre-rolled') ? 20 : 1);
            const targetQty = Math.max(minQty, Math.min(qty, item.stock));
            return { ...item, qty: targetQty };
          }
          return item;
        }),
      };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    try {
      const local = localStorage.getItem('browtiful_strokes_cart');
      return local ? { items: JSON.parse(local) } : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('browtiful_strokes_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, variantLabel, qty = 1) => {
    const minQty = product.minOrderQty || product.minQuantity || (product.name && product.name.toLowerCase().includes('pre-rolled') ? 20 : 1);
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product._id,
        name: product.name.split(' - ')[0], // Base product name
        variant: variantLabel || 'Default',
        price: product.price,
        image: product.images?.[0] || '',
        stock: product.stock,
        weight: product.weight || 0,
        qty: Math.max(qty, minQty),
        minOrderQty: minQty,
        minQuantity: minQty,
      },
    });
  };

  const removeFromCart = (productId, variant) => {
    let targetVariant = variant;
    if (!targetVariant) {
      // Fallback for test files/legacy calls omitting variant
      const item = state.items.find(i => i.productId === productId);
      if (item) {
        targetVariant = item.variant;
      }
    }
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, variant: targetVariant || 'Default' } });
  };

  const updateQty = (productId, variantOrQty, qty) => {
    let variant = 'Default';
    let targetQty = qty;
    if (typeof variantOrQty === 'number') {
      // Call signature matches updateQty(productId, qty)
      targetQty = variantOrQty;
      const item = state.items.find(i => i.productId === productId);
      if (item) {
        variant = item.variant;
      }
    } else {
      variant = variantOrQty || 'Default';
    }
    dispatch({ type: 'UPDATE_QTY', payload: { productId, variant, qty: targetQty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.qty, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        getSubtotal,
        getItemCount,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
