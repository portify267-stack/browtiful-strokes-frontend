import React, { useEffect, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { LOCAL_IMAGES } from '../../config/images';
import { resolveProductImageUrl } from '../../utils/productUtils';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQty, getSubtotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckoutRedirect = () => {
    onClose();
    navigate('/checkout');
  };

  const handleIncreaseQty = (item) => {
    if (item.qty >= item.stock) {
      showToast("Quantity exceeds available stock.", "error");
      return;
    }
    updateQty(item.productId, item.variant, item.qty + 1);
  };

  const handleDecreaseQty = (item) => {
    const minQty = item.minQuantity || item.minOrderQty || (item.name && item.name.toLowerCase().includes('pre-rolled') ? 20 : 1);
    if (item.qty <= minQty) {
      if (minQty > 1) {
        showToast(`Minimum order quantity is ${minQty} pcs.`, "error");
        return;
      }
      removeFromCart(item.productId, item.variant);
      return;
    }
    updateQty(item.productId, item.variant, item.qty - 1);
  };

  const hasItems = cart && cart.length > 0;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Shopping Cart Drawer"
      >
        {/* Header */}
        <div className="p-4 border-b border-beige/60 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-forest" />
            <h2 className="font-serif text-lg font-bold text-forest">Your Cart</h2>
            {hasItems && (
              <span className="bg-gold text-cream text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-charcoal/60 hover:text-charcoal hover:bg-beige/40 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {!hasItems ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <ShoppingBag className="w-12 h-12 text-beige/80 mb-3" />
              <p className="font-serif text-lg font-semibold text-forest mb-1">Your cart is empty</p>
              <p className="text-charcoal/60 text-sm mb-6">Explore our mehendi collections and add products to start your order.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-forest hover:bg-forest-light text-cream rounded-md text-sm font-semibold transition-all duration-300 shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const image = item.image || '';
              const resolvedImage = image && typeof image === 'string' && image.trim() !== ''
                ? resolveProductImageUrl(image)
                : LOCAL_IMAGES.productFallback;

              return (
                <div
                  key={`${item.productId}_${item.variant}`}
                  className="flex gap-3 bg-white p-3 rounded-lg border border-beige/40 transition-shadow hover:shadow-sm"
                >
                  {/* Image */}
                  <img
                    src={resolvedImage}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md bg-beige/10"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = LOCAL_IMAGES.productFallback;
                    }}
                  />

                  {/* Info */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-forest leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      {item.variant !== 'Default' && (
                        <span className="text-[11px] text-charcoal/50 font-medium bg-beige/30 px-2 py-0.5 rounded block w-fit mt-0.5">
                          Size: {item.variant}
                        </span>
                      )}
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleDecreaseQty(item)}
                        className="p-1 rounded bg-cream hover:bg-beige/40 text-charcoal/70 border border-beige/30 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold w-6 text-center text-charcoal">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncreaseQty(item)}
                        className={`p-1 rounded bg-cream hover:bg-beige/40 text-charcoal/70 border border-beige/30 transition-colors ${
                          item.qty >= item.stock ? 'opacity-50 cursor-pointer' : ''
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing / Remove */}
                  <div className="flex flex-col justify-between items-end min-w-[70px]">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.variant)}
                      className="text-charcoal/40 hover:text-errorred-text p-1 rounded-full hover:bg-errorred/30 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-forest">₹{item.price * item.qty}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {hasItems && (
          <div className="p-4 border-t border-beige/60 bg-white space-y-4 bg-cream/30">
            <div className="flex justify-between items-center text-charcoal">
              <span className="text-sm font-semibold">Subtotal</span>
              <span className="text-xl font-bold text-forest">₹{getSubtotal()}</span>
            </div>
            <p className="text-[11px] text-charcoal/50">Shipping fees and taxes are calculated at checkout.</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleCheckoutRedirect}
                className="w-full py-3 bg-forest hover:bg-forest-light text-cream font-semibold rounded-md transition-all duration-300 text-center shadow-md"
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-transparent border border-beige/80 hover:border-forest text-charcoal text-sm font-medium rounded-md transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
