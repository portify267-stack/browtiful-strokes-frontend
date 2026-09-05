import React from 'react';

const VariantSelector = ({ variants, selectedVariant, onSelect }) => {
  if (!variants || variants.length <= 1 || (variants.length === 1 && variants[0].label === 'Default')) {
    return null;
  }

  return (
    <div className="my-2 sm:my-3">
      <span className="text-[10px] sm:text-xs font-semibold text-charcoal/60 uppercase tracking-wider block mb-1">
        {variants.some(v => v.label && (v.label.toLowerCase().includes('pc') || v.label.toLowerCase().includes('pack'))) ? 'Select Pack' : 'Select Size'}
      </span>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {variants.map((v) => {
          const isSelected = selectedVariant && selectedVariant._id === v._id;
          const isOutOfStock = v.stock <= 0;

          return (
            <button
              key={v._id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelect(v)}
              className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium border rounded-md transition-all duration-200 ${
                isSelected
                  ? 'border-forest bg-forest text-cream font-semibold ring-1 ring-forest'
                  : isOutOfStock
                  ? 'border-beige/50 text-charcoal/30 bg-beige/10 cursor-not-allowed line-through'
                  : 'border-beige bg-white hover:border-forest text-charcoal hover:bg-cream/40'
              }`}
              aria-label={`Select variant ${v.label} - price ${v.price} rupees ${isOutOfStock ? '(out of stock)' : ''}`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
