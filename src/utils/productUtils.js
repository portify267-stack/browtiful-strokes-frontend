import { MEDIA_URL } from '../config/constants';

/**
 * Universal product image URL resolver.
 * Safely resolves local public assets, external URLs, and Render backend uploads.
 */
export const resolveProductImageUrl = (image) => {
  if (!image || typeof image !== 'string' || image.trim() === '') {
    return '/images/fallback.svg';
  }
  const trimmed = image.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('/images/') || trimmed.startsWith('images/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${MEDIA_URL}${cleanPath}`;
};

/**
 * Utility to group flat product lists from the database by base name
 * to support size/volume variants dynamically on the frontend.
 */
export const groupProducts = (productsList) => {
  if (!productsList || !Array.isArray(productsList)) return [];

  const groups = {};

  productsList.forEach((prod) => {
    if (!prod || typeof prod !== 'object') return;

    const rawName = typeof prod.name === 'string' && prod.name.trim() !== ''
      ? prod.name
      : 'Natural Henna Product';

    const parts = prod.isCombo ? [rawName] : rawName.split(' - ');
    const baseName = parts[0].trim();
    const variantLabel = parts.length > 1 ? parts[1].trim() : null;

    // Standardize images array
    const rawImages = Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images
      : (typeof prod.image === 'string' && prod.image.trim() !== '' ? [prod.image] : []);

    const validPrice = typeof prod.price === 'number'
      ? prod.price
      : (parseFloat(prod.price) || 0);

    const validStock = typeof prod.stock === 'number'
      ? prod.stock
      : (parseInt(prod.stock, 10) || 0);

    const categoryVal = prod.categoryId || prod.category || null;

    if (!groups[baseName]) {
      groups[baseName] = {
        _id: prod._id || `group-${Math.random().toString(36).substring(2, 9)}`,
        name: baseName,
        description: prod.description || 'Premium organic mehendi product crafted with natural ingredients.',
        images: rawImages,
        categoryId: categoryVal,
        isBestSeller: Boolean(prod.isBestSeller),
        isCombo: Boolean(prod.isCombo),
        variants: []
      };
    }

    if (prod.isBestSeller) groups[baseName].isBestSeller = true;
    if (prod.isCombo) groups[baseName].isCombo = true;

    groups[baseName].variants.push({
      _id: prod._id || `var-${Math.random().toString(36).substring(2, 9)}`,
      label: variantLabel || 'Default',
      price: validPrice,
      stock: validStock,
      images: rawImages,
      originalProduct: {
        ...prod,
        _id: prod._id || `prod-${Math.random().toString(36).substring(2, 9)}`,
        name: rawName,
        price: validPrice,
        stock: validStock,
        images: rawImages,
        description: prod.description || 'Premium organic mehendi product crafted with natural ingredients.',
        isBestSeller: Boolean(prod.isBestSeller),
        isCombo: Boolean(prod.isCombo)
      }
    });
  });

  return Object.values(groups).map((group) => {
    // Sort variants by price ascending
    group.variants.sort((a, b) => a.price - b.price);
    return group;
  });
};

