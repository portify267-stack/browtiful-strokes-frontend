import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../components/common/UIStates';
import { LOCAL_IMAGES } from '../config/images';

const GallerySection = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const images = LOCAL_IMAGES.gallery;

  const openLightbox = (index) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setActiveImageIndex(null);
  }, []);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation?.();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation?.();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'ArrowRight') handleNext(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, closeLightbox, handlePrev, handleNext]);

  return (
    <section id="gallery" className="py-8 md:py-12 lg:py-14 bg-cream/20 border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Our Mehendi Work"
          subtitle="A glimpse of the beautiful designs created at Browtiful Strokes."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => openLightbox(idx)}
              className="group relative h-64 w-full overflow-hidden rounded-lg border border-beige/40 focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label={`View image: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = LOCAL_IMAGES.generalFallback;
                }}
              />
              <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-cream text-xs font-semibold uppercase tracking-wider bg-gold/95 px-3 py-1.5 rounded shadow">
                  Zoom View
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {activeImageIndex !== null && (
        <div
          className="fixed inset-0 bg-charcoal/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image Zoom Lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-cream hover:text-gold transition-colors focus:outline-none"
            aria-label="Close Zoom View"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 bg-cream/10 rounded-full text-cream hover:bg-cream/20 transition-colors focus:outline-none"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
            <img
              src={images[activeImageIndex].src}
              alt={images[activeImageIndex].alt}
              className="max-w-full max-h-[75vh] object-contain rounded border border-beige/25"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = LOCAL_IMAGES.generalFallback;
              }}
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 p-3 bg-cream/10 rounded-full text-cream hover:bg-cream/20 transition-colors focus:outline-none"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
