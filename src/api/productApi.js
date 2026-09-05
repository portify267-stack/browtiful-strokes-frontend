import client from './client';
import { DEMO_MODE } from '../config/constants';
import { products as demoProducts } from '../config/demoData';

/**
 * Helper to safely extract products array and pagination from various API response shapes.
 */
const parseProductsResponse = (resData) => {
  if (!resData) return { products: [], pagination: {} };

  // Case 1: resData is directly an array
  if (Array.isArray(resData)) {
    return { products: resData, pagination: {} };
  }

  // Case 2: resData.products is an array
  if (Array.isArray(resData.products)) {
    return { products: resData.products, pagination: resData.pagination || {} };
  }

  // Case 3: resData.data exists
  if (resData.data) {
    if (Array.isArray(resData.data)) {
      return { products: resData.data, pagination: resData.pagination || {} };
    }
    if (Array.isArray(resData.data.products)) {
      return { products: resData.data.products, pagination: resData.data.pagination || resData.pagination || {} };
    }
    if (Array.isArray(resData.data.items)) {
      return { products: resData.data.items, pagination: resData.data.pagination || {} };
    }
  }

  // Case 4: resData.items is an array
  if (Array.isArray(resData.items)) {
    return { products: resData.items, pagination: resData.pagination || {} };
  }

  return { products: [], pagination: {} };
};

export const getProducts = async (params = {}) => {
  if (DEMO_MODE) {
    let filtered = [...demoProducts];

    if (params.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === params.categoryId);
    }
    if (params.isBestSeller !== undefined) {
      const isBest = String(params.isBestSeller) === 'true';
      filtered = filtered.filter((p) => p.isBestSeller === isBest);
    }
    if (params.isCombo !== undefined) {
      const isCombo = String(params.isCombo) === 'true';
      filtered = filtered.filter((p) => p.isCombo === isCombo);
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(searchLower)) ||
          (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    return {
      products: filtered,
      pagination: {
        totalItems: filtered.length,
        currentPage: 1,
        totalPages: 1,
        limit: params.limit || 100,
      },
    };
  }

  const response = await client.get('/products', { params });
  return parseProductsResponse(response?.data);
};

export const getProductById = async (id) => {
  if (DEMO_MODE) {
    const product = demoProducts.find((p) => p._id === id);
    return product || null;
  }

  const response = await client.get(`/products/${id}`);
  const rawData = response?.data;
  if (rawData?.data) return rawData.data;
  return rawData || null;
};

