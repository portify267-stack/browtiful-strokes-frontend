import React, { useState, useEffect } from 'react';
import { getCategories } from '../api/categoryApi';
import { SectionHeading, LoadingSkeleton, ErrorState, EmptyState } from '../components/common/UIStates';
import { FolderOpen } from 'lucide-react';
import { resolveCategoryImageUrl } from '../utils/categoryImageHelper';

const CategoriesSection = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve product categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (catId) => {
    onSelectCategory(catId);
    const target = document.querySelector('#allproducts');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-5 sm:py-8 md:py-12 bg-cream/20 border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Browse Categories"
          subtitle="Explore our selection of premium natural mehendi materials and accessories."
          className="mb-3 md:mb-5 lg:mb-6"
        />

        {loading ? (
          <LoadingSkeleton count={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCategories} />
        ) : !categories || categories.length === 0 ? (
          <EmptyState message="No categories available right now." icon={FolderOpen} />
        ) : (
          <div className="flex md:grid md:grid-cols-6 gap-2 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none w-full pb-2 md:pb-0">
            {categories.map((cat) => {
              const resolvedImageUrl = resolveCategoryImageUrl(cat.image, cat.name);

              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id)}
                  className="group flex flex-col items-center text-center flex-shrink-0 w-[calc((100%-16px)/3)] md:w-auto md:max-w-[160px] snap-start focus:outline-none"
                >
                  {/* Equal Sized Circular Category Container */}
                  <div className="w-20 h-20 xs:w-22 xs:h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-2 border-beige/80 group-hover:border-forest shadow-md group-hover:shadow-xl transition-all duration-300 relative bg-[#fdfbf7] shrink-0 aspect-square">
                    <img
                      src={resolvedImageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 block"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/fallback.svg';
                      }}
                    />
                  </div>

                  {/* Category Title & Information Below Circle */}
                  <div className="mt-2 md:mt-3 flex flex-col items-center">
                    <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-forest group-hover:text-forest-light transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-charcoal/70 text-[10px] sm:text-xs line-clamp-2 leading-relaxed mt-0.5 max-w-[140px] hidden sm:block">
                      {cat.description || 'Quality supplies for mehendi artists.'}
                    </p>
                    <span className="text-[10px] sm:text-xs font-bold text-gold mt-1.5 md:mt-2 group-hover:text-gold-dark transition-colors inline-flex items-center gap-0.5">
                      Browse <span className="hidden sm:inline">Products</span> &rarr;
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
