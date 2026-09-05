import React, { useState } from 'react';
import { X, Minus, Plus, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { LOCAL_IMAGES } from '../../config/images';
import { resolveProductImageUrl } from '../../utils/productUtils';

const ComboDetailsModal = ({ product, isOpen, onClose, items = [] }) => {
  const [qty, setQty] = useState(1);
  const { addToCart, cart, openCart } = useCart();
  const { showToast } = useToast();

  if (!isOpen || !product) return null;

  // Retrieve stock status
  const stock = typeof product.stock === 'number' ? product.stock : 10;
  const isOutOfStock = stock <= 0;

  // Find quantity already in cart
  const cartItem = cart.find(
    (item) => item.productId === product._id && item.variant === 'Default'
  );
  const currentQtyInCart = cartItem ? cartItem.qty : 0;

  const handleIncrement = () => {
    if (qty + 1 + currentQtyInCart > stock) {
      showToast("Cannot select more than available stock.", "error");
      return;
    }
    setQty(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQty(prev => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast("Product is out of stock.", "error");
      return;
    }

    if (qty + currentQtyInCart > stock) {
      showToast(`Cannot add ${qty} more. You already have ${currentQtyInCart} in cart (Max stock: ${stock}).`, "error");
      return;
    }

    addToCart(product, 'Default', qty);
    showToast(
      `${product.name || 'Combo'} added to cart.`,
      "success",
      {
        label: "View Cart",
        onClick: () => {
          onClose();
          openCart();
        },
      }
    );
    onClose();
  };

  const imageUrl = product.images?.[0] || '';
  const resolvedImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== ''
    ? resolveProductImageUrl(imageUrl)
    : LOCAL_IMAGES.productFallback;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in" onClick={onClose}>
      {/* Modal Container */}
      <div 
        className="bg-cream border border-beige/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-scale-in flex flex-col md:flex-row max-h-[90vh] md:max-h-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-charcoal hover:text-forest border border-beige/40 rounded-full transition-colors focus:outline-none shadow-sm cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Area */}
        <div className="w-full md:w-1/2 h-48 md:h-auto bg-beige/10 relative shrink-0">
          <img
            src={resolvedImageUrl}
            alt={product.name}
            className="w-full h-full object-contain md:object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = LOCAL_IMAGES.productFallback;
            }}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-cream/70 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-errorred text-errorred-text border border-errorred-text/20 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details Content */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-widest font-bold block mb-1">
              Combo Offer Details
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest mb-2">
              {product.name}
            </h2>
            <div className="text-xl font-bold text-forest mb-4">
              ₹{product.price}
            </div>

            {/* "What's Inside?" items list */}
            <div className="border-t border-beige/40 pt-4 mb-6">
              <h3 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">
                What's Inside?
              </h3>
              {items.length > 0 ? (
                <ul className="space-y-2.5">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-charcoal/80">
                      <div className="bg-forest/10 p-0.5 rounded-full mt-0.5 shrink-0">
                        <Check className="w-3 h-3 text-forest stroke-[3px]" />
                      </div>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-charcoal/60 italic">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-beige/40 pt-4 flex flex-col gap-4">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal/60">
                  Select Quantity
                </span>
                
                {/* Quantity Control selector */}
                <div className="flex items-center border border-beige rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="p-2 hover:bg-cream text-charcoal hover:text-forest transition-colors disabled:text-charcoal/30 cursor-pointer"
                    disabled={qty <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-charcoal min-w-[36px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="p-2 hover:bg-cream text-charcoal hover:text-forest transition-colors disabled:text-charcoal/30 cursor-pointer"
                    disabled={qty + currentQtyInCart >= stock}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-beige/40 text-charcoal/30 border border-beige/60 cursor-not-allowed'
                  : 'bg-forest hover:bg-forest-light text-cream shadow-md hover:shadow-lg cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboDetailsModal;
