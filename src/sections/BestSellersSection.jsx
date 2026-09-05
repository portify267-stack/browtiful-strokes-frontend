import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productApi';
import { groupProducts } from '../utils/productUtils';
import ProductCard from '../components/product/ProductCard';
import { SectionHeading, LoadingSkeleton, ErrorState, EmptyState } from '../components/common/UIStates';
import { Award } from 'lucide-react';

const BestSellersSection = () => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts({ isBestSeller: true, limit: 100 });
      const productsArray = Array.isArray(response?.products)
        ? response.products
        : Array.isArray(response)
        ? response
        : [];
      const grouped = groupProducts(productsArray);
      setProductsList(grouped);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve bestselling products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  return (
    <section id="bestsellers" className="py-8 md:py-12 lg:py-14 bg-white border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        <SectionHeading
          title="Bestselling Essentials"
          subtitle="Our most loved, highest-rated organic henna powders, cones, and oil formulas."
        />

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchBestSellers} />
        ) : !productsList || productsList.length === 0 ? (
          <EmptyState message="No bestselling products right now." icon={Award} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {productsList.map((product) => (
              <ProductCard key={product._id} product={product} isBestSellersSection={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellersSection;
