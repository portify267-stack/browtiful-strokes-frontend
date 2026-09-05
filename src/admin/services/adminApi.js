import axios from 'axios';
import { API_BASE_URL, MEDIA_URL, DEMO_MODE } from '../../config/constants';
import { getAdminToken, clearAdminSession } from '../utils/adminAuth';
import { categories as demoCategories, products as demoProducts } from '../../config/demoData';

let currentCategories = [...demoCategories];
let currentProducts = [...demoProducts];

const adminClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor: Attach JWT Bearer token
adminClient.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized and expired session
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Ignore auth/login error to allow invalid credentials feedback
      if (!error.config.url.includes('/auth/login')) {
        clearAdminSession();
        window.dispatchEvent(new CustomEvent('admin:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/fallback.svg';
  if (typeof imagePath !== 'string') return '/images/fallback.svg';
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }
  if (imagePath.startsWith('/images/') || imagePath.startsWith('images/')) {
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${MEDIA_URL}${cleanPath}`;
};

/* ================= AUTH APIs ================= */
export const adminLoginApi = async (email, password) => {
  if (DEMO_MODE) {
    if (email === 'browtifulstrokes@gmail.com' && password === 'Admin123@') {
      return {
        token: 'mock-jwt-token-for-demo',
        admin: {
          _id: '661b1234abcd5678ef901234',
          name: 'Browtiful Strokes Studio Admin',
          email: 'browtifulstrokes@gmail.com',
          role: 'admin'
        }
      };
    } else {
      const err = new Error('Invalid credentials. Hint: use browtifulstrokes@gmail.com and Admin123@');
      err.response = { status: 401, data: { message: 'Invalid credentials. Hint: use browtifulstrokes@gmail.com and Admin123@' } };
      throw err;
    }
  }

  const response = await adminClient.post('/auth/login', { email, password });
  return response?.data?.data || response?.data;
};

export const getAdminProfileApi = async () => {
  if (DEMO_MODE) {
    return {
      _id: '661b1234abcd5678ef901234',
      name: 'Browtiful Strokes Studio Admin',
      email: 'browtifulstrokes@gmail.com',
      role: 'admin'
    };
  }

  const response = await adminClient.get('/auth/me');
  return response?.data?.data || response?.data;
};

/* ================= CATEGORY APIs ================= */
export const getAdminCategoriesApi = async () => {
  if (DEMO_MODE) {
    return currentCategories;
  }

  const response = await adminClient.get('/categories');
  const resData = response?.data;
  if (Array.isArray(resData?.data)) return resData.data;
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData?.data?.categories)) return resData.data.categories;
  return [];
};

export const getCategoryByIdApi = async (id) => {
  if (DEMO_MODE) {
    const cat = currentCategories.find((c) => c._id === id);
    return cat || null;
  }

  const response = await adminClient.get(`/categories/${id}`);
  return response?.data?.data || response?.data;
};

export const createCategoryApi = async (categoryData) => {
  if (DEMO_MODE) {
    let newCat = {};
    if (categoryData instanceof FormData) {
      newCat = {
        _id: 'cat_' + Math.random().toString(36).substr(2, 9),
        name: categoryData.get('name'),
        description: categoryData.get('description'),
        image: '/images/categories/fallback.svg'
      };
    } else {
      newCat = {
        _id: 'cat_' + Math.random().toString(36).substr(2, 9),
        ...categoryData,
        image: categoryData.image || '/images/categories/fallback.svg'
      };
    }
    currentCategories.push(newCat);
    return newCat;
  }

  const isFormData = categoryData instanceof FormData;
  const response = await adminClient.post('/categories', categoryData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
  });
  return response?.data?.data || response?.data;
};

export const updateCategoryApi = async (id, categoryData) => {
  if (DEMO_MODE) {
    const idx = currentCategories.findIndex((c) => c._id === id);
    if (idx !== -1) {
      let updated = {};
      if (categoryData instanceof FormData) {
        updated = {
          ...currentCategories[idx],
          name: categoryData.get('name') || currentCategories[idx].name,
          description: categoryData.get('description') || currentCategories[idx].description,
        };
      } else {
        updated = {
          ...currentCategories[idx],
          ...categoryData
        };
      }
      currentCategories[idx] = updated;
      return updated;
    }
    return null;
  }

  const isFormData = categoryData instanceof FormData;
  const response = await adminClient.put(`/categories/${id}`, categoryData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
  });
  return response?.data?.data || response?.data;
};

export const deleteCategoryApi = async (id) => {
  if (DEMO_MODE) {
    currentCategories = currentCategories.filter((c) => c._id !== id);
    return { success: true };
  }

  const response = await adminClient.delete(`/categories/${id}`);
  return response?.data;
};

/* ================= PRODUCT APIs ================= */
export const getAdminProductsApi = async (params = {}) => {
  if (DEMO_MODE) {
    return {
      products: currentProducts,
      pagination: {
        totalItems: currentProducts.length,
        currentPage: 1,
        totalPages: 1,
        limit: params.limit || 100
      }
    };
  }

  const response = await adminClient.get('/products', { params });
  const resData = response?.data;
  
  let products = [];
  let pagination = { totalItems: 0, currentPage: 1, totalPages: 1, limit: 10 };

  if (resData?.data) {
    if (Array.isArray(resData.data)) {
      products = resData.data;
    } else if (Array.isArray(resData.data.products)) {
      products = resData.data.products;
      pagination = resData.data.pagination || pagination;
    }
  } else if (resData?.products && Array.isArray(resData.products)) {
    products = resData.products;
    pagination = resData.pagination || pagination;
  } else if (Array.isArray(resData)) {
    products = resData;
  }

  return { products, pagination };
};

export const getProductByIdApi = async (id) => {
  if (DEMO_MODE) {
    const prod = currentProducts.find((p) => p._id === id);
    return prod || null;
  }

  const response = await adminClient.get(`/products/${id}`);
  return response?.data?.data || response?.data;
};

export const createProductApi = async (productData) => {
  if (DEMO_MODE) {
    let newProd = {};
    if (productData instanceof FormData) {
      newProd = {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        name: productData.get('name'),
        price: Number(productData.get('price')),
        stock: Number(productData.get('stock')),
        categoryId: productData.get('categoryId'),
        isBestSeller: productData.get('isBestSeller') === 'true',
        isCombo: productData.get('isCombo') === 'true',
        weight: Number(productData.get('weight')),
        description: productData.get('description'),
        images: ['/images/products/fallback_product.svg']
      };
    } else {
      newProd = {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        ...productData,
        images: productData.images || ['/images/products/fallback_product.svg']
      };
    }
    currentProducts.unshift(newProd);
    return newProd;
  }

  const isFormData = productData instanceof FormData;
  const response = await adminClient.post('/products', productData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
  });
  return response?.data?.data || response?.data;
};

export const updateProductApi = async (id, productData) => {
  if (DEMO_MODE) {
    const idx = currentProducts.findIndex((p) => p._id === id);
    if (idx !== -1) {
      let updated = {};
      if (productData instanceof FormData) {
        updated = {
          ...currentProducts[idx],
          name: productData.get('name') || currentProducts[idx].name,
          price: productData.get('price') ? Number(productData.get('price')) : currentProducts[idx].price,
          stock: productData.get('stock') ? Number(productData.get('stock')) : currentProducts[idx].stock,
          categoryId: productData.get('categoryId') || currentProducts[idx].categoryId,
          isBestSeller: productData.get('isBestSeller') !== null ? productData.get('isBestSeller') === 'true' : currentProducts[idx].isBestSeller,
          isCombo: productData.get('isCombo') !== null ? productData.get('isCombo') === 'true' : currentProducts[idx].isCombo,
          weight: productData.get('weight') ? Number(productData.get('weight')) : currentProducts[idx].weight,
          description: productData.get('description') || currentProducts[idx].description,
        };
      } else {
        updated = {
          ...currentProducts[idx],
          ...productData
        };
      }
      currentProducts[idx] = updated;
      return updated;
    }
    return null;
  }

  const isFormData = productData instanceof FormData;
  const response = await adminClient.put(`/products/${id}`, productData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
  });
  return response?.data?.data || response?.data;
};

export const deleteProductApi = async (id) => {
  if (DEMO_MODE) {
    currentProducts = currentProducts.filter((p) => p._id !== id);
    return { success: true };
  }

  const response = await adminClient.delete(`/products/${id}`);
  return response?.data;
};

/* ================= ORDER APIs ================= */
export const getAdminOrdersApi = async (params = {}) => {
  if (DEMO_MODE) {
    const existingOrders = JSON.parse(localStorage.getItem('browtiful_strokes_orders') || '[]');
    return {
      orders: existingOrders,
      pagination: {
        totalItems: existingOrders.length,
        currentPage: 1,
        totalPages: 1,
        limit: params.limit || 100
      }
    };
  }

  const response = await adminClient.get('/orders', { params });
  const resData = response?.data;

  let orders = [];
  let pagination = { totalItems: 0, currentPage: 1, totalPages: 1, limit: 10 };

  if (resData?.data) {
    if (Array.isArray(resData.data)) {
      orders = resData.data;
    } else if (Array.isArray(resData.data.orders)) {
      orders = resData.data.orders;
      pagination = resData.data.pagination || pagination;
    }
  } else if (resData?.orders && Array.isArray(resData.orders)) {
    orders = resData.orders;
    pagination = resData.pagination || pagination;
  } else if (Array.isArray(resData)) {
    orders = resData;
  }

  return { orders, pagination };
};

export const getAdminOrderByIdApi = async (id) => {
  if (DEMO_MODE) {
    const existingOrders = JSON.parse(localStorage.getItem('browtiful_strokes_orders') || '[]');
    const order = existingOrders.find((o) => o._id === id);
    return order || null;
  }

  const response = await adminClient.get(`/orders/${id}`);
  return response?.data?.data || response?.data;
};

export const getDashboardStatsApi = async () => {
  if (DEMO_MODE) {
    const existingOrders = JSON.parse(localStorage.getItem('browtiful_strokes_orders') || '[]');
    
    const totalProducts = currentProducts.length;
    const totalCategories = currentCategories.length;
    const totalOrders = existingOrders.length;
    
    const pendingPayments = existingOrders.filter(
      (o) => o.paymentStatus === 'PENDING'
    ).length;
    
    const recentOrders = existingOrders.slice(0, 5);
    
    return {
      totalProducts,
      totalCategories,
      totalOrders,
      pendingPayments,
      recentOrders,
    };
  }

  const [productsRes, categories, ordersRes] = await Promise.all([
    getAdminProductsApi({ limit: 100 }),
    getAdminCategoriesApi(),
    getAdminOrdersApi({ limit: 100 }),
  ]);

  const products = productsRes.products || [];
  const orders = ordersRes.orders || [];

  const totalProducts = productsRes.pagination?.totalItems || products.length;
  const totalCategories = categories.length;
  const totalOrders = ordersRes.pagination?.totalItems || orders.length;

  const pendingPayments = orders.filter(
    (o) => o.paymentStatus === 'PENDING'
  ).length;

  const recentOrders = orders.slice(0, 5);

  return {
    totalProducts,
    totalCategories,
    totalOrders,
    pendingPayments,
    recentOrders,
  };
};

export default adminClient;
