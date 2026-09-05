import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Sparkles,
  Layers,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getAdminProductsApi,
  getAdminCategoriesApi,
  deleteProductApi,
  getImageUrl,
} from '../services/adminApi';
import AdminPagination from '../components/AdminPagination';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../../context/ToastContext';
import { groupProducts } from '../../utils/productUtils';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();
  const apiCallCount = useRef(0);
  const lastFetchedParamsKey = useRef('');
  const productsTopRef = useRef(null);

  const handlePageChange = (p) => {
    setPage(p);
    productsTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCategories = async () => {
    try {
      const cats = await getAdminCategoriesApi();
      setCategories(cats);
    } catch {
      // Ignore category fetch error or log
    }
  };

  const fetchProducts = useCallback(
    async (targetPage = 1, force = false) => {
      const currentParamsKey = `${targetPage}-${selectedCategory}-${debouncedSearch}`;
      if (!force && lastFetchedParamsKey.current === currentParamsKey) {
        return;
      }
      lastFetchedParamsKey.current = currentParamsKey;

      apiCallCount.current += 1;
      setProducts([]); // Clear the previous product list before fetching
      setIsLoading(true);
      try {
        const params = {
          page: targetPage,
          limit: 100,
        };
        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }
        if (selectedCategory) {
          params.categoryId = selectedCategory;
        }

        const data = await getAdminProductsApi(params);

        // Remove duplicate products using the unique product _id as a safety check
        const uniqueProducts = [];
        const seenIds = new Set();
        (data.products || []).forEach((p) => {
          if (p && p._id && !seenIds.has(p._id.toString())) {
            seenIds.add(p._id.toString());
            uniqueProducts.push(p);
          }
        });

        setProducts(uniqueProducts);
        setPagination(data.pagination || { totalItems: 0, currentPage: 1, totalPages: 1, limit: 10 });
      } catch (err) {
        showToast(err?.response?.data?.message || 'Failed to fetch products', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, selectedCategory, showToast]
  );

  // Load categories once
  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products when page, category, or debounced search query changes
  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory, debouncedSearch]);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProductApi(productToDelete._id);
      showToast(`Product '${productToDelete.name}' deleted successfully`, 'success');
      setProductToDelete(null);
      fetchProducts(page, true);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div ref={productsTopRef} className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">
            Product Management
          </h1>
          <p className="text-xs md:text-sm text-charcoal/70 mt-1">
            Create, update, and organize store inventory.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-dark text-cream font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-cream border border-beige/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/40">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal placeholder-charcoal/40 shadow-2xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-60">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/40">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchProducts(page, true)}
            disabled={isLoading}
            className="p-2 bg-beige/30 hover:bg-beige/60 border border-beige/80 rounded-xl text-charcoal cursor-pointer disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-cream border border-beige/80 rounded-xl shadow-xs overflow-hidden">
        {isLoading && products.length === 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-xs table-fixed">
              <thead className="bg-beige/30 border-b border-beige/60 text-charcoal/70 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4 w-[80px]">Image</th>
                  <th className="py-3 px-4 w-[280px]">Product Name</th>
                  <th className="py-3 px-4 w-[150px]">Category</th>
                  <th className="py-3 px-4 w-[110px]">Price</th>
                  <th className="py-3 px-4 w-[120px]">Stock</th>
                  <th className="py-3 px-4 w-[160px]">Badges</th>
                  <th className="py-3 px-4 w-[100px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/40">
                {[...Array(10)].map((_, idx) => (
                  <tr key={idx} className="h-20">
                    <td className="py-3 px-4 align-middle">
                      <div className="w-12 h-12 bg-beige/40 rounded-lg animate-pulse border border-beige/60" />
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="w-3/4 h-4 bg-beige/40 rounded animate-pulse mb-2" />
                      <div className="w-1/2 h-3 bg-beige/20 rounded animate-pulse" />
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="w-20 h-6 bg-beige/40 rounded-md animate-pulse" />
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="w-12 h-4 bg-beige/40 rounded animate-pulse" />
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="w-20 h-6 bg-beige/40 rounded-full animate-pulse" />
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="w-24 h-5 bg-beige/40 rounded-md animate-pulse" />
                    </td>
                    <td className="py-3 px-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-8 h-8 bg-beige/40 rounded-lg animate-pulse" />
                        <div className="w-8 h-8 bg-beige/40 rounded-lg animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-beige/40 flex items-center justify-center text-charcoal/40 mx-auto mb-3">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-charcoal">No Products Found</h3>
            <p className="text-xs text-charcoal/60 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory
                ? 'No products match your search/filter criteria.'
                : 'Your store has no products yet. Click "Add New Product" to create one.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-xs table-fixed">
              <thead className="bg-beige/30 border-b border-beige/60 text-charcoal/70 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4 w-[80px]">Image</th>
                  <th className="py-3 px-4 w-[280px]">Product Name</th>
                  <th className="py-3 px-4 w-[150px]">Category</th>
                  <th className="py-3 px-4 w-[110px]">Price</th>
                  <th className="py-3 px-4 w-[120px]">Stock</th>
                  <th className="py-3 px-4 w-[160px]">Badges</th>
                  <th className="py-3 px-4 w-[100px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/40">
                {groupProducts(products).map((product) => {
                  const categoryName =
                    product.categoryId && typeof product.categoryId === 'object'
                      ? product.categoryId.name
                      : (product.categoryId ? (categories.find((c) => c._id === product.categoryId)?.name || 'Uncategorized') : 'Uncategorized');

                  const hasMultipleVariants = product.variants && (product.variants.length > 1 || product.variants[0].label !== 'Default');
                  const totalStock = hasMultipleVariants ? product.variants.reduce((sum, v) => sum + v.stock, 0) : (product.variants[0]?.stock ?? 0);
                  const isLowStock = hasMultipleVariants ? product.variants.some(v => v.stock <= 5) : (product.variants[0]?.stock ?? 0) <= 5;

                  const priceDisplay = (() => {
                    if (!hasMultipleVariants) {
                      return `₹${(product.variants[0]?.price ?? 0).toLocaleString('en-IN')}`;
                    }
                    const prices = product.variants.map(v => v.price);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    if (minPrice === maxPrice) {
                      return `₹${minPrice.toLocaleString('en-IN')}`;
                    }
                    return `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;
                  })();

                  return (
                    <tr key={product._id} className="hover:bg-beige/20 transition-colors h-20">
                      {/* Image */}
                      <td className="py-3 px-4 align-middle">
                        <img
                          src={getImageUrl(product.images?.[0])}
                          alt={product.name || 'Product'}
                          className="w-12 h-12 object-cover rounded-lg border border-beige/60 shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/fallback.svg';
                          }}
                        />
                      </td>

                      {/* Name & Description & Variants */}
                      <td className="py-3 px-4 align-middle">
                        <p className="font-bold text-charcoal text-xs truncate max-w-[260px]" title={product.name || 'Unnamed Product'}>
                          {product.name || 'Unnamed Product'}
                        </p>
                        <p className="text-[11px] text-charcoal/60 truncate max-w-[260px] mt-0.5" title={product.description || 'No description available'}>
                          {product.description || 'No description available'}
                        </p>
                        
                        {hasMultipleVariants && (
                          <div className="mt-2 space-y-1 bg-beige/10 p-1.5 rounded-lg border border-beige/30">
                            {product.variants.map((v) => (
                              <div key={v._id} className="flex items-center justify-between gap-2 py-0.5 text-[10px] border-b border-beige/10 last:border-b-0 max-w-[250px]">
                                <span className="font-semibold text-charcoal/70">{v.label}</span>
                                <span className="text-charcoal/60 font-bold">₹{v.price}</span>
                                <span className={v.stock <= 5 ? 'text-red-600 font-bold' : 'text-successgreen-text font-medium'}>
                                  {v.stock} in stock
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => navigate(`/admin/products/edit/${v._id}`)}
                                    className="p-0.5 text-forest hover:bg-forest/10 rounded transition-colors"
                                    title={`Edit ${v.label}`}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setProductToDelete(v.originalProduct)}
                                    className="p-0.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title={`Delete ${v.label}`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 align-middle font-semibold text-charcoal/80">
                        <span className="px-2.5 py-1 rounded-md bg-beige/40 border border-beige/80 inline-block truncate max-w-full">
                          {categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 align-middle font-bold text-charcoal truncate">
                        {priceDisplay}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 align-middle">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full border inline-block whitespace-nowrap ${
                            isLowStock
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : 'bg-successgreen text-successgreen-text border-successgreen-text/20'
                          }`}
                        >
                          {totalStock} in stock
                        </span>
                      </td>

                      {/* Badges (Best Seller & Combo) */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-full">
                          {Boolean(product.isBestSeller) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-gold/20 text-gold-dark rounded-md border border-gold/30 whitespace-nowrap">
                              <Sparkles className="w-3 h-3 shrink-0" /> Best Seller
                            </span>
                          )}
                          {Boolean(product.isCombo) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-md border border-purple-200 whitespace-nowrap">
                              <Layers className="w-3 h-3 shrink-0" /> Combo
                            </span>
                          )}
                          {!product.isBestSeller && !product.isCombo && (
                            <span className="text-[11px] text-charcoal/40 font-medium whitespace-nowrap">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-middle text-right">
                        {!hasMultipleVariants && (
                          <div className="flex items-center justify-end gap-2 shrink-0">
                            <button
                              onClick={() => navigate(`/admin/products/edit/${product.variants[0]._id}`)}
                              className="p-1.5 text-forest hover:bg-forest/10 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setProductToDelete(product.variants[0].originalProduct)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4">
          <AdminPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!productToDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setProductToDelete(null)}
      />
    </div>
  );
};

export default AdminProducts;
