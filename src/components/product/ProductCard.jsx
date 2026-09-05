import React, { useState } from 'react';
import VariantSelector from './VariantSelector';
import ComboDetailsModal from './ComboDetailsModal';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag } from 'lucide-react';
import { LOCAL_IMAGES } from '../../config/images';
import { resolveProductImageUrl } from '../../utils/productUtils';

const parseComboItems = (description) => {
  if (!description || typeof description !== 'string') return [];
  
  if (description.includes('\n')) {
    return description
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./))
      .map(line => line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter(item => item.length > 0);
  }
  
  if (description.toLowerCase().includes('package:') || description.toLowerCase().includes('drawing:') || description.toLowerCase().includes('includes:')) {
    const parts = description.split(/[:：]/);
    if (parts.length > 1) {
      return parts[1]
        .split(/[,，.]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
  }

  if (description.includes(',')) {
    return description
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
  
  return [description];
};

const ProductCard = ({ product = {}, isBestSellersSection = false }) => {
  const { addToCart, cart, openCart, updateQty, removeFromCart } = useCart();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const comboItems = product.isCombo ? parseComboItems(product.description) : [];

  const safeVariants = Array.isArray(product?.variants) && product.variants.length > 0
    ? product.variants
    : [{
        _id: product?._id || 'default-var',
        label: 'Default',
        price: typeof product?.price === 'number' ? product.price : 0,
        stock: typeof product?.stock === 'number' ? product.stock : 10,
        images: Array.isArray(product?.images) ? product.images : [],
        originalProduct: product
      }];

  const hasVariants = safeVariants.length > 1 || (safeVariants.length === 1 && safeVariants[0].label !== 'Default');

  // Set default selected variant
  const [selectedVariant, setSelectedVariant] = useState(
    (hasVariants && !isBestSellersSection) ? null : safeVariants[0]
  );

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      showToast("Please select a variant before adding.", "error");
      return;
    }
    
    const activeVariant = selectedVariant || safeVariants[0];
    
    if (!activeVariant || activeVariant.stock <= 0) {
      showToast("Product is out of stock.", "error");
      return;
    }

    const minQty = product.minOrderQty || product.minQuantity || (product.name && product.name.toLowerCase().includes('pre-rolled') ? 20 : 1);

    // Check if adding exceeds available stock
    const cartItem = cart.find(
      (item) => item.productId === activeVariant._id && item.variant === activeVariant.label
    );
    const currentQtyInCart = cartItem ? cartItem.qty : 0;
    const addAmount = currentQtyInCart === 0 ? minQty : 1;

    if (currentQtyInCart + addAmount > activeVariant.stock) {
      showToast("Quantity exceeds available stock.", "error");
      return;
    }

    addToCart(activeVariant.originalProduct, activeVariant.label, addAmount);

    const variantStr = activeVariant.label !== 'Default' ? ` (${activeVariant.label})` : '';
    const qtyNoteStr = addAmount > 1 ? ` (${addAmount} pcs)` : '';
    showToast(
      `${product.name || 'Product'}${variantStr}${qtyNoteStr} added to cart.`,
      "success",
      {
        label: "View Cart",
        onClick: openCart,
      }
    );
  };

  const activeVariantForCart = selectedVariant || safeVariants[0];
  const cartItem = activeVariantForCart
    ? cart.find((item) => item.productId === activeVariantForCart._id && item.variant === activeVariantForCart.label)
    : null;
  const currentQty = cartItem ? cartItem.qty : 0;

  const handleIncreaseQty = () => {
    const activeVariant = selectedVariant || safeVariants[0];
    if (!activeVariant) return;

    if (currentQty >= activeVariant.stock) {
      showToast("Quantity exceeds available stock.", "error");
      return;
    }

    updateQty(activeVariant._id, activeVariant.label, currentQty + 1);
  };

  const handleDecreaseQty = () => {
    const activeVariant = selectedVariant || safeVariants[0];
    if (!activeVariant) return;

    const minQty = product.minOrderQty || product.minQuantity || (product.name && product.name.toLowerCase().includes('pre-rolled') ? 20 : 1);

    if (currentQty <= minQty) {
      removeFromCart(activeVariant._id, activeVariant.label);
      showToast(
        `${product.name || 'Product'}${activeVariant.label !== 'Default' ? ` (${activeVariant.label})` : ''} removed from cart.`,
        "info"
      );
      return;
    }

    updateQty(activeVariant._id, activeVariant.label, currentQty - 1);
  };

  // Determine price text display: single price or size-range
  const getPriceDisplay = () => {
    if (selectedVariant) return `₹${selectedVariant.price}`;
    if (safeVariants && safeVariants.length > 0) {
      const prices = safeVariants.map((v) => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) return `₹${minPrice}`;
      return `₹${minPrice} - ₹${maxPrice}`;
    }
    return 'N/A';
  };

  const allOutOfStock = safeVariants.every((v) => v.stock <= 0);
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : allOutOfStock;
  const isButtonDisabled = selectedVariant ? selectedVariant.stock <= 0 : allOutOfStock;

  const imageUrl = selectedVariant?.images?.[0] || product?.images?.[0] || '';
  const resolvedImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== ''
    ? resolveProductImageUrl(imageUrl)
    : LOCAL_IMAGES.productFallback;

  return (
    <div className="bg-white rounded-lg border border-beige/60 overflow-hidden flex flex-col h-full group hover:shadow-md transition-all duration-300 relative">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <span className="bg-gold text-cream text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
            Best Seller
          </span>
        )}
        {product.isCombo && (
          <span className="bg-forest text-cream text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
            Combo Offer
          </span>
        )}
      </div>

      {/* Image Area */}
      <div className="h-36 sm:h-52 w-full overflow-hidden bg-beige/10 relative">
        <img
          src={resolvedImageUrl}
          alt={product.name || 'Product'}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = LOCAL_IMAGES.productFallback;
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-cream/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-errorred text-errorred-text border border-errorred-text/20 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-forest hover:text-forest-light transition-colors line-clamp-2 mb-1">
            {product.name || 'Natural Henna Product'}
          </h3>
          <p className="text-charcoal/70 text-[10px] sm:text-xs line-clamp-2 mb-2 sm:mb-3 h-7 sm:h-8">
            {product.description || 'Organic, premium quality mehendi product.'}
          </p>

          <VariantSelector
            variants={safeVariants}
            selectedVariant={selectedVariant}
            onSelect={handleSelectVariant}
          />

          {product.isCombo && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-1.5 text-[11px] sm:text-xs font-semibold text-forest hover:text-cream border border-forest hover:bg-forest rounded-md transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-center gap-1"
              >
                View Details
              </button>
            </div>
          )}
        </div>

        {/* Action / Price */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-beige/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] text-charcoal/50 uppercase tracking-widest font-semibold">
              Price
            </span>
            <span className="text-base sm:text-lg font-bold text-forest">{getPriceDisplay()}</span>
            {product.isCombo ? (
              <span className="text-[9px] sm:text-[10px] font-semibold text-gold mt-0.5 whitespace-nowrap">
                {comboItems.length} Items Included
              </span>
            ) : (product.minOrderQty > 1 || product.minQuantity > 1 || (product.name && product.name.toLowerCase().includes('pre-rolled'))) ? (
              <span className="text-[9px] sm:text-[10px] font-semibold text-gold mt-0.5 whitespace-nowrap">
                Min. Order: {product.minOrderQty || product.minQuantity || 20} pcs
              </span>
            ) : null}
          </div>

          {currentQty > 0 ? (
            <div className="flex items-center justify-between bg-forest text-cream rounded-md w-full sm:w-auto select-none border border-forest overflow-hidden shrink-0">
              <button
                type="button"
                onClick={handleDecreaseQty}
                className="w-10 sm:w-auto sm:px-3 py-1.5 sm:py-2 hover:bg-forest-light transition-colors flex items-center justify-center text-sm font-bold shrink-0 border-r border-cream/20 cursor-pointer"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                −
              </button>
              <span className="px-1 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-center flex-grow whitespace-nowrap">
                <span className="inline sm:hidden">{currentQty}</span>
                <span className="hidden sm:inline">Add to Cart {currentQty}</span>
              </span>
              <button
                type="button"
                onClick={handleIncreaseQty}
                className="w-10 sm:w-auto sm:px-3 py-1.5 sm:py-2 hover:bg-forest-light transition-colors flex items-center justify-center text-sm font-bold shrink-0 border-l border-cream/20 cursor-pointer"
                aria-label={`Increase quantity of ${product.name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isButtonDisabled}
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-md transition-all duration-300 w-full sm:w-auto ${
                isButtonDisabled
                  ? 'bg-beige/40 text-charcoal/30 cursor-not-allowed border border-beige/60'
                  : 'bg-forest hover:bg-forest-light text-cream hover:shadow'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Add to Cart</span>
            </button>
          )}
        </div>
      </div>

      <ComboDetailsModal
        product={product}
        items={comboItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductCard;
