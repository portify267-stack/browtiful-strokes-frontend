import { MEDIA_URL } from '../config/constants';

/**
 * Standard preset category cover images corresponding to the website's Categories section.
 */
export const CATEGORY_IMAGE_PRESETS = [
  {
    id: 'cones',
    name: 'Henna Cones',
    path: '/images/products/bridal-henna-cone.png',
    keywords: ['cone', 'bridal cone'],
  },
  {
    id: 'powder',
    name: 'Henna Powder',
    path: '/images/henna-powder.png',
    keywords: ['powder', 'mehendi powder'],
  },
  {
    id: 'oils',
    name: 'Essential Oils',
    path: '/images/essential-oils.png',
    keywords: ['oil', 'eucalyptus', 'tea tree', 'bridal blend'],
  },
  {
    id: 'aftercare',
    name: 'Aftercare',
    path: '/images/aftercare-products.png',
    keywords: ['aftercare', 'balm', 'sealant'],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    path: '/images/products/accessories-category.jpg',
    keywords: ['accessories', 'pin', 'piping', 'bag', 'filter', 'cutter'],
  },
  {
    id: 'combos',
    name: 'Combos',
    path: '/images/products/combo-category.jpg',
    keywords: ['combo', 'kit', 'set', 'bundle'],
  },
];

/**
 * Case-insensitive mapper to retrieve the website's default cover image for a category by name.
 *
 * @param {string} categoryName
 * @returns {string|null}
 */
export const getCategoryLocalImage = (categoryName) => {
  if (!categoryName || typeof categoryName !== 'string') return null;
  const lowerName = categoryName.toLowerCase().trim();

  for (const preset of CATEGORY_IMAGE_PRESETS) {
    if (preset.keywords.some((kw) => lowerName.includes(kw))) {
      return preset.path;
    }
  }

  return null;
};

/**
 * Unified category image URL resolver.
 * Priority:
 * 1. Explicit custom image (uploaded / selected URL or asset path)
 * 2. Automatic category-based preset image (based on category name)
 * 3. Fallback placeholder SVG
 *
 * @param {string|null} image - Image path or URL from category document
 * @param {string|null} categoryName - Category name for intelligent fallback
 * @returns {string} Fully resolved image URL
 */
export const resolveCategoryImageUrl = (image, categoryName) => {
  if (image && typeof image === 'string' && image.trim() !== '' && !image.includes('fallback.svg')) {
    const trimmed = image.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:')
    ) {
      return trimmed;
    }

    if (trimmed.startsWith('/images/')) {
      return trimmed;
    }

    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${MEDIA_URL}${cleanPath}`;
  }

  const localPreset = getCategoryLocalImage(categoryName);
  if (localPreset) {
    return localPreset;
  }

  return '/images/fallback.svg';
};
