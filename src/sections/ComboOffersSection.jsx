import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productApi';
import { groupProducts } from '../utils/productUtils';
import ProductCard from '../components/product/ProductCard';
import { SectionHeading, LoadingSkeleton, ErrorState, EmptyState } from '../components/common/UIStates';
import { Gift } from 'lucide-react';

const ComboOffersSection = () => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts({ isCombo: true, limit: 100 });
      const productsArray = Array.isArray(response?.products)
        ? response.products
        : Array.isArray(response)
        ? response
        : [];
      const grouped = groupProducts(productsArray);
      setProductsList(grouped);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve combo offers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  return (
    <section id="combos" className="pt-4 pb-8 md:pt-6 md:pb-12 lg:pt-7 lg:pb-14 bg-cream/10 border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        <SectionHeading
          title="Curated Combo Kits"
          subtitle="Save on bulk purchases with our handpicked combinations of powders, cones, and accessories."
        />

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCombos} />
        ) : !productsList || productsList.length === 0 ? (
          <EmptyState message="No combo kits are currently available. Check back soon!" icon={Gift} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {productsList.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ComboOffersSection;
