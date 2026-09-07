import React, { useState, useEffect, useMemo } from 'react';
import { X, Minus, Plus, ShoppingBag, Scale, Check, ShieldCheck } from 'lucide-react';
import VariantSelector from './VariantSelector';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { LOCAL_IMAGES } from '../../config/images';
import { resolveProductImageUrl } from '../../utils/productUtils';

const formatWeight = (weightInGrams) => {
  if (!weightInGrams || typeof weightInGrams !== 'number' || weightInGrams <= 0) {
    return null;
  }
  if (weightInGrams >= 1000) {
    const inKg = weightInGrams / 1000;
    return `${inKg % 1 === 0 ? inKg : inKg.toFixed(2)} kg`;
  }
  return `${weightInGrams} g`;
};

const ProductDetailsModal = ({
  product,
  initialVariant,
  isOpen,
  onClose,
}) => {
  const { addToCart, cart, openCart } = useCart();
  const { showToast } = useToast();

  const safeVariants = useMemo(() => {
    return Array.isArray(product?.variants) && product.variants.length > 0
      ? product.variants
      : [{
          _id: product?._id || 'default-var',
          label: 'Default',
          price: typeof product?.price === 'number' ? product.price : 0,
          stock: typeof product?.stock === 'number' ? product.stock : 10,
          images: Array.isArray(product?.images) ? product.images : [],
          originalProduct: product,
        }];
  }, [product]);

  const hasVariants = safeVariants.length > 1 || (safeVariants.length === 1 && safeVariants[0].label !== 'Default');

  const [selectedVariant, setSelectedVariant] = useState(
    initialVariant || safeVariants[0]
  );

  const minOrderQty = product?.minOrderQty || product?.minQuantity || (product?.name && product.name.toLowerCase().includes('pre-rolled') ? 20 : 1);
  const [qty, setQty] = useState(minOrderQty);

  // Sync selected variant and quantity when modal opens or initialVariant changes
  useEffect(() => {
    if (isOpen) {
      const active = initialVariant || safeVariants[0];
      setSelectedVariant(active);
      const initialMin = product?.minOrderQty || product?.minQuantity || (product?.name && product.name.toLowerCase().includes('pre-rolled') ? 20 : 1);
      setQty(initialMin);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialVariant, product, safeVariants]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const activeVariant = selectedVariant || safeVariants[0];
  const currentProductDoc = activeVariant?.originalProduct || product;

  const price = typeof activeVariant?.price === 'number'
    ? activeVariant.price
    : (typeof product?.price === 'number' ? product.price : 0);

  const stock = typeof activeVariant?.stock === 'number'
    ? activeVariant.stock
    : (typeof product?.stock === 'number' ? product.stock : 10);

  const isOutOfStock = stock <= 0;

  const targetProductId = activeVariant?._id || product?._id;
  const targetVariantLabel = activeVariant?.label || 'Default';

  // Find quantity already in cart
  const cartItem = cart.find(
    (item) => item.productId === targetProductId && item.variant === targetVariantLabel
  );
  const currentQtyInCart = cartItem ? cartItem.qty : 0;

  // Weight determination
  const rawWeight = currentProductDoc?.weight || product?.weight;
  const formattedWeight = formatWeight(rawWeight);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    const minQty = product?.minOrderQty || product?.minQuantity || (product?.name && product.name.toLowerCase().includes('pre-rolled') ? 20 : 1);
    setQty(minQty);
  };

  const handleIncrement = () => {
    if (qty + 1 + currentQtyInCart > stock) {
      showToast("Cannot select more than available stock.", "error");
      return;
    }
    setQty((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQty((prev) => Math.max(minOrderQty, prev - 1));
  };

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      showToast("Please select a size/variant first.", "error");
      return;
    }

    if (isOutOfStock) {
      showToast("Product is currently out of stock.", "error");
      return;
    }

    if (qty + currentQtyInCart > stock) {
      showToast(
        `Cannot add ${qty} more. You already have ${currentQtyInCart} in your cart (Available stock: ${stock}).`,
        "error"
      );
      return;
    }

    addToCart(currentProductDoc, targetVariantLabel, qty);

    const variantStr = targetVariantLabel !== 'Default' ? ` (${targetVariantLabel})` : '';
    const qtyNoteStr = qty > 1 ? ` (${qty} pcs)` : '';
    showToast(
      `${product.name || 'Product'}${variantStr}${qtyNoteStr} added to cart.`,
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

  const imageUrl = activeVariant?.images?.[0] || product.images?.[0] || '';
  const resolvedImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== ''
    ? resolveProductImageUrl(imageUrl)
    : LOCAL_IMAGES.productFallback;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-charcoal/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name || 'Product Details'}
    >
      {/* Modal Container */}
      <div
        className="bg-[#fdfbf7] border border-beige/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative animate-scale-in flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 bg-white/90 hover:bg-white text-charcoal hover:text-forest border border-beige/60 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 h-52 sm:h-64 md:h-auto bg-white/70 relative shrink-0 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-beige/60">
          <img
            src={resolvedImageUrl}
            alt={product.name || 'Product'}
            className="w-full h-full object-contain max-h-[280px] md:max-h-[380px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = LOCAL_IMAGES.productFallback;
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isBestSeller && (
              <span className="bg-gold text-cream text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-xs">
                Best Seller
              </span>
            )}
            {product.isCombo && (
              <span className="bg-forest text-cream text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-xs">
                Combo Offer
              </span>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-cream/80 backdrop-blur-[1.5px] flex items-center justify-center">
              <span className="bg-errorred text-errorred-text border border-errorred-text/20 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-7 flex flex-col justify-between overflow-y-auto max-h-[calc(90vh-13rem)] md:max-h-[90vh]">
          <div className="space-y-4">
            {/* Title & Price */}
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-gold uppercase tracking-widest block mb-1">
                {product.category?.name || 'Handcrafted Henna'}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest leading-tight">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-forest">
                  ₹{price}
                </span>
                {formattedWeight && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal/70 bg-beige/30 px-2.5 py-1 rounded-md border border-beige/60">
                    <Scale className="w-3.5 h-3.5 text-forest" />
                    <span>Weight: {formattedWeight}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-beige/60 pt-3">
              <h3 className="text-xs font-bold text-charcoal/70 uppercase tracking-wider mb-1.5">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed whitespace-pre-line">
                {product.description || 'Pure, organic, hand-mixed henna crafted with the finest natural ingredients.'}
              </p>
            </div>

            {/* Variant / Size Options */}
            {hasVariants && (
              <div className="border-t border-beige/60 pt-3">
                <VariantSelector
                  variants={safeVariants}
                  selectedVariant={selectedVariant}
                  onSelect={handleVariantChange}
                />
              </div>
            )}

            {/* Minimum Order Quantity Note if applicable */}
            {minOrderQty > 1 && (
              <div className="p-2.5 bg-beige/25 border border-beige/60 rounded-lg text-xs text-charcoal/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
                <span>Minimum order quantity for this item is <strong>{minOrderQty} pcs</strong>.</span>
              </div>
            )}

            {/* Stock status indicator */}
            <div className="text-xs">
              {isOutOfStock ? (
                <span className="text-errorred-text font-semibold">Currently Out of Stock</span>
              ) : stock <= 5 ? (
                <span className="text-amber-700 font-semibold">Only {stock} left in stock - order soon</span>
              ) : (
                <span className="text-forest font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-beige/60 pt-4 mt-4 flex flex-col gap-3">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal/70">
                  Quantity {minOrderQty > 1 ? `(Min: ${minOrderQty})` : ''}
                </span>

                <div className="flex items-center border border-beige rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={qty <= minOrderQty}
                    className="p-2 hover:bg-cream text-charcoal hover:text-forest transition-colors disabled:text-charcoal/30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-charcoal min-w-[40px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={qty + currentQtyInCart >= stock}
                    className="p-2 hover:bg-cream text-charcoal hover:text-forest transition-colors disabled:text-charcoal/30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Increase quantity"
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
              className={`w-full py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-beige/40 text-charcoal/30 border border-beige/60 cursor-not-allowed'
                  : 'bg-forest hover:bg-forest-light text-cream shadow-md hover:shadow-lg cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Out of Stock' : `Add to Cart • ₹${price * qty}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
