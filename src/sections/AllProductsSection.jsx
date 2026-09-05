import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../api/productApi';
import { getCategories } from '../api/categoryApi';
import { groupProducts } from '../utils/productUtils';
import ProductCard from '../components/product/ProductCard';
import { SectionHeading, LoadingSkeleton, ErrorState, EmptyState } from '../components/common/UIStates';
import { Search, ShoppingBag } from 'lucide-react';

const AllProductsSection = ({ selectedCategoryId, onSelectCategory }) => {
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ref for section scroll targeting
  const productsSectionRef = useRef(null);
  const paginationTriggered = useRef(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Handle user-initiated pagination clicks
  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    paginationTriggered.current = true;
    setPage(newPage);
  };

  // Auto-scroll to top of section ONLY when pagination is manually triggered by user
  useEffect(() => {
    if (!paginationTriggered.current) return;

    requestAnimationFrame(() => {
      const element = productsSectionRef.current;
      if (element) {
        const navbarOffset = 90;
        const top = element.getBoundingClientRect().top + window.scrollY - navbarOffset;
        window.scrollTo({
          top,
          behavior: 'smooth',
        });
      }
      paginationTriggered.current = false;
    });
  }, [page]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId]);

  // Fetch categories for the filter chips
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories in shop.', err);
      }
    };
    fetchCats();
  }, []);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 100, // Fetch all for front-end variants grouping
      };

      if (selectedCategoryId) {
        params.categoryId = selectedCategoryId;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const data = await getProducts(params);
      const productsArray = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data)
        ? data
        : [];
      const grouped = groupProducts(productsArray);
      
      const startIndex = (page - 1) * limit;
      const paginatedGrouped = grouped.slice(startIndex, startIndex + limit);

      setProductsList(paginatedGrouped);
      setTotalPages(Math.ceil(grouped.length / limit) || 1);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve product catalog.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, debouncedSearch, page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section ref={productsSectionRef} id="allproducts" className="py-8 md:py-12 lg:py-14 bg-cream/30 border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8">
        <SectionHeading
          title="Shop All Products"
          subtitle="Discover natural henna powders, bridal blend essential oils, cones, aftercare kits and mehendi tools."
        />

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 mb-6 md:mb-8">
          {/* Categories Chips */}
          <div className="grid grid-cols-3 gap-x-2 gap-y-2.5 w-full max-w-md mx-auto md:max-w-none md:flex md:flex-wrap md:items-center md:justify-start md:w-auto">
            <button
              onClick={() => onSelectCategory(null)}
              className={`inline-flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold border whitespace-nowrap transition-all duration-300 select-none w-full md:w-auto ${
                selectedCategoryId === null
                  ? 'bg-forest border-forest text-cream shadow'
                  : 'bg-white border-beige hover:border-forest text-charcoal'
              }`}
            >
              All
            </button>
            {categories.map((cat, index) => {
              const isLast = index === categories.length - 1;
              return (
                <button
                  key={cat._id}
                  onClick={() => onSelectCategory(cat._id)}
                  className={`inline-flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold border whitespace-nowrap transition-all duration-300 select-none ${
                    isLast
                      ? 'col-span-3 justify-self-center w-auto px-6 sm:px-6 md:px-4 md:w-auto'
                      : 'w-full md:w-auto'
                  } ${
                    selectedCategoryId === cat._id
                      ? 'bg-forest border-forest text-cream shadow'
                      : 'bg-white border-beige hover:border-forest text-charcoal'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-md mx-auto md:w-80 md:mx-0 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-beige bg-white focus:border-forest focus:ring-1 focus:ring-forest text-charcoal transition-all duration-200"
            />
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchProducts} />
        ) : !productsList || productsList.length === 0 ? (
          <EmptyState message="No products match your search or filter criteria." icon={ShoppingBag} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {productsList.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6 md:mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className={`px-4 py-2 border rounded-md text-xs font-semibold transition-all duration-200 ${
                    page === 1
                      ? 'border-beige text-charcoal/30 bg-beige/10 cursor-not-allowed'
                      : 'border-beige bg-white hover:border-forest text-charcoal'
                  }`}
                >
                  &larr; Previous
                </button>
                <span className="text-xs font-semibold text-charcoal/70">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className={`px-4 py-2 border rounded-md text-xs font-semibold transition-all duration-200 ${
                    page === totalPages
                      ? 'border-beige text-charcoal/30 bg-beige/10 cursor-not-allowed'
                      : 'border-beige bg-white hover:border-forest text-charcoal'
                  }`}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllProductsSection;
