import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/productApi';
import { getCategories } from '../api/categoryApi';
import { groupProducts } from '../utils/productUtils';
import ProductCard from '../components/product/ProductCard';
import { LoadingSkeleton, ErrorState, EmptyState } from '../components/common/UIStates';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';
import { Search, ShoppingBag, ArrowLeft, Sparkles, Filter } from 'lucide-react';

const Shop = () => {
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Ref for smooth scroll targeting on page change
  const catalogTopRef = useRef(null);
  const paginationTriggered = useRef(false);

  // Scroll to top on initial page mount & update document title
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Shop Natural Henna & Mehendi Supplies | Browtiful Strokes';
  }, []);

  // Handle user-initiated pagination clicks
  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    paginationTriggered.current = true;
    setPage(newPage);
  };

  // Auto-scroll to top of product grid when pagination is clicked
  useEffect(() => {
    if (!paginationTriggered.current) return;

    requestAnimationFrame(() => {
      const element = catalogTopRef.current;
      if (element) {
        const navbarOffset = 85;
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
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when category changes
  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };

  // Fetch categories for the filter chips
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load categories in shop.', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products from the same shared backend API
  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        limit: 100, // Fetch catalog for consistent front-end variant grouping
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
      console.error('Error loading products for shop:', err);
      setError('Could not retrieve product catalog. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, debouncedSearch, page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Shop Page Banner / Header */}
      <section className="relative w-full bg-[#fcf9f2] border-b border-beige/40 py-8 sm:py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4 sm:mb-6">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/60">
              <li>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 hover:text-forest transition-colors font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-forest">Shop</li>
            </ol>
          </nav>

          {/* Title & Supporting Subtitle */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-forest text-[11px] sm:text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              100% Organic & Handcrafted Mehendi Essentials
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-forest leading-tight mb-3">
              Shop
            </h1>
            <p className="text-charcoal/80 text-sm sm:text-base md:text-lg leading-relaxed">
              Explore our complete collection of natural henna powders, bridal blend essential oils, fresh organic cones, aftercare supplies, and complete mehendi kits.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section ref={catalogTopRef} className="py-6 sm:py-8 md:py-12 bg-cream/30 flex-grow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8">
          
          {/* Filter & Search Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
            
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x">
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-charcoal/60 uppercase tracking-wider pr-1">
                <Filter className="w-3.5 h-3.5 text-gold" />
                <span>Filter:</span>
              </div>

              <button
                onClick={() => handleCategorySelect(null)}
                className={`inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all duration-300 select-none shrink-0 snap-start cursor-pointer ${
                  selectedCategoryId === null
                    ? 'bg-forest border-forest text-cream shadow-sm'
                    : 'bg-white border-beige hover:border-forest text-charcoal'
                }`}
              >
                All Products
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat._id)}
                  className={`inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all duration-300 select-none shrink-0 snap-start cursor-pointer ${
                    selectedCategoryId === cat._id
                      ? 'bg-forest border-forest text-cream shadow-sm'
                      : 'bg-white border-beige hover:border-forest text-charcoal'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-beige bg-white focus:border-forest focus:ring-1 focus:ring-forest text-charcoal placeholder:text-charcoal/40 transition-all duration-200 shadow-2xs"
              />
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Product Catalog Grid */}
          {loading ? (
            <LoadingSkeleton count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchProducts} />
          ) : !productsList || productsList.length === 0 ? (
            <EmptyState
              message="No products match your search or filter criteria."
              icon={ShoppingBag}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                {productsList.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Responsive Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 md:mt-10">
                  <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className={`px-4 py-2 border rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      page === 1
                        ? 'border-beige text-charcoal/30 bg-beige/10 cursor-not-allowed'
                        : 'border-beige bg-white hover:border-forest hover:text-forest text-charcoal shadow-2xs'
                    }`}
                  >
                    &larr; Previous
                  </button>
                  <span className="text-xs font-semibold text-charcoal/70 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className={`px-4 py-2 border rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      page === totalPages
                        ? 'border-beige text-charcoal/30 bg-beige/10 cursor-not-allowed'
                        : 'border-beige bg-white hover:border-forest hover:text-forest text-charcoal shadow-2xs'
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

      {/* Floating WhatsApp Support Button */}
      <FloatingWhatsApp />
    </div>
  );
};

export default Shop;
