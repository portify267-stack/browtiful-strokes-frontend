import React from 'react';
import { CONTACT_INFO } from '../config/constants';
import { LOCAL_IMAGES } from '../config/images';
import { MapPin, Calendar, Gift } from 'lucide-react';

const StudioSection = () => {
  return (
    <section className="py-8 md:py-12 lg:py-14 bg-white border-b border-beige/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Studio Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gold/10 rounded-2xl transform -rotate-2 -translate-x-2 translate-y-2 z-0" />
            <div className="relative h-[380px] md:h-[480px] rounded-2xl overflow-hidden shadow-lg border border-beige-dark/40 z-10 bg-cream/30 p-3">
              <img
                src={LOCAL_IMAGES.studio}
                alt="Mehendi Studio Interior"
                className="w-full h-full object-contain object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = LOCAL_IMAGES.generalFallback;
                }}
              />
            </div>
          </div>

          {/* Studio Copy */}
          <div className="space-y-6 text-left">
            <span className="text-gold font-semibold uppercase tracking-widest text-xs md:text-sm block">
              {CONTACT_INFO.businessType}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest">
              Visit Browtiful Strokes Studio &amp; Academy
            </h2>
            <p className="text-charcoal/80 text-sm md:text-base leading-relaxed">
              {CONTACT_INFO.detailedDesc}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="bg-beige/40 p-2 rounded-full text-forest">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-forest">Offline Studio Available</h4>
                  <p className="text-charcoal/60 text-xs">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-beige/40 p-2 rounded-full text-forest">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-forest">Bridal & Custom Mehendi</h4>
                  <p className="text-charcoal/60 text-xs">Book exclusive custom design sessions for weddings and special occasions.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-beige/40 p-2 rounded-full text-forest">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-forest">Studio Pickup Available</h4>
                  <p className="text-charcoal/60 text-xs">Order online and pick up your products directly from our studio location.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={CONTACT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-forest hover:bg-forest-light text-cream font-semibold rounded-md transition-all duration-300 text-sm shadow-md"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;
