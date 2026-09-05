import React, { useState } from 'react';
import HeroSection from '../sections/HeroSection';
import TrustHighlights from '../sections/TrustHighlights';
import CategoriesSection from '../sections/CategoriesSection';
import BestSellersSection from '../sections/BestSellersSection';
import ComboOffersSection from '../sections/ComboOffersSection';
import AllProductsSection from '../sections/AllProductsSection';
import StudioSection from '../sections/StudioSection';
import GallerySection from '../sections/GallerySection';
import ContactSection from '../sections/ContactSection';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';

const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* 2. Hero */}
      <HeroSection />

      {/* 3. Trust Highlights */}
      <TrustHighlights />

      {/* 4. Categories */}
      <CategoriesSection onSelectCategory={handleSelectCategory} />

      {/* 5. Best Sellers */}
      <BestSellersSection />

      {/* 6. Combo Offers */}
      <ComboOffersSection />

      {/* 7. All Products */}
      <AllProductsSection
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* 8. Offline Studio */}
      <StudioSection />

      {/* 9. Gallery */}
      <GallerySection />

      {/* 10. Contact */}
      <ContactSection />

      {/* 12. Floating WhatsApp */}
      <FloatingWhatsApp />
    </div>
  );
};

export default Home;
