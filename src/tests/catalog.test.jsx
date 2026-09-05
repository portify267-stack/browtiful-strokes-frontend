import { describe, it, expect } from 'vitest';
import { groupProducts, resolveProductImageUrl } from '../utils/productUtils';

describe('Product Catalog Utilities & Grouping', () => {
  const flatProducts = [
    {
      _id: 'prod-1',
      name: 'Henna Powder Luxury - 250 gm',
      price: 150,
      stock: 50,
      isBestSeller: true,
      categoryId: 'cat-1',
      images: ['/uploads/powder.png'],
    },
    {
      _id: 'prod-2',
      name: 'Henna Powder Luxury - 500 gm',
      price: 230,
      stock: 30,
      isBestSeller: false,
      categoryId: 'cat-1',
      images: ['/uploads/powder.png'],
    },
    {
      _id: 'prod-3',
      name: 'Henna Powder Luxury - 1 kg',
      price: 440,
      stock: 15,
      isBestSeller: false,
      categoryId: 'cat-1',
      images: ['/uploads/powder.png'],
    },
    {
      _id: 'prod-4',
      name: 'Bridal Henna Cone',
      price: 40,
      stock: 100,
      isBestSeller: true,
      categoryId: 'cat-2',
      images: ['/uploads/cone.png'],
    },
  ];

  it('should group flat variants into a single product card with multiple variants', () => {
    const grouped = groupProducts(flatProducts);

    expect(grouped.length).toBe(2);

    const luxuryPowder = grouped.find((p) => p.name === 'Henna Powder Luxury');
    expect(luxuryPowder).toBeDefined();
    expect(luxuryPowder.variants.length).toBe(3);
    expect(luxuryPowder.variants[0].label).toBe('250 gm');
    expect(luxuryPowder.variants[0].price).toBe(150);
    expect(luxuryPowder.variants[1].label).toBe('500 gm');
    expect(luxuryPowder.variants[1].price).toBe(230);
    expect(luxuryPowder.variants[2].label).toBe('1 kg');
    expect(luxuryPowder.variants[2].price).toBe(440);
    expect(luxuryPowder.isBestSeller).toBe(true);

    const bridalCone = grouped.find((p) => p.name === 'Bridal Henna Cone');
    expect(bridalCone).toBeDefined();
    expect(bridalCone.variants.length).toBe(1);
    expect(bridalCone.variants[0].label).toBe('Default');
    expect(bridalCone.variants[0].price).toBe(40);
  });

  it('should resolve local, remote, and fallback product image URLs', () => {
    expect(resolveProductImageUrl(null)).toBe('/images/fallback.svg');
    expect(resolveProductImageUrl('')).toBe('/images/fallback.svg');
    expect(resolveProductImageUrl('https://example.com/cone.jpg')).toBe('https://example.com/cone.jpg');
    expect(resolveProductImageUrl('/images/cone.jpg')).toBe('/images/cone.jpg');
  });
});
