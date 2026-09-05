import client from './client';
import { DEMO_MODE } from '../config/constants';
import { categories as demoCategories } from '../config/demoData';

let categoriesPromise = null;

export const getCategories = async () => {
  if (DEMO_MODE) {
    return demoCategories;
  }
  
  if (!categoriesPromise) {
    categoriesPromise = client.get('/categories')
      .then((response) => {
        const rawData = response?.data;
        if (Array.isArray(rawData?.data)) return rawData.data;
        if (Array.isArray(rawData)) return rawData;
        if (Array.isArray(rawData?.data?.categories)) return rawData.data.categories;
        if (Array.isArray(rawData?.categories)) return rawData.categories;
        return [];
      })
      .catch((error) => {
        categoriesPromise = null; // Clear cache on error to support retry attempts
        throw error;
      });
  }
  
  return categoriesPromise;
};

