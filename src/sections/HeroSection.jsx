import React from 'react';
import { Link } from 'react-router-dom';
import { LOCAL_IMAGES } from '../config/images';
import { ArrowRight, Leaf, Flower2, ShieldCheck, Clock } from 'lucide-react';

const HeroSection = () => {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureItems = [
    { text: '100% Natural Henna', icon: Leaf },
    { text: 'Custom Designs', icon: Flower2 },
    { text: 'Hygienic & Safe', icon: ShieldCheck },
    { text: 'On-Time Service', icon: Clock },
  ];

  return (
    <section id="home" className="relative w-full bg-[#fdfbf7] overflow-x-hidden pt-3 pb-6 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        {/* Unified Hero Card Container */}
        <div className="relative w-full rounded-2xl md:rounded-3xl border border-gold/25 bg-[#faf7f0] shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch justify-between">
          
          {/* IMAGE LAYER: Top on mobile, right side on tablet & desktop */}
          <div className="order-1 md:order-2 w-full md:w-[50%] lg:w-[54%] relative flex items-center justify-center bg-gradient-to-b from-[#f5ede1]/60 to-transparent md:bg-none">
            {/* Image Frame */}
            <div className="relative w-full h-[220px] xs:h-[260px] sm:h-[320px] md:h-full md:min-h-[460px] lg:min-h-[520px] flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
              <img
                src={LOCAL_IMAGES.hero}
                alt="Browtiful Strokes Mehendi Art Team"
                className="w-full h-full object-contain md:object-contain rounded-xl md:rounded-2xl transition-transform duration-300"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = LOCAL_IMAGES.generalFallback;
                }}
              />

              {/* 100% Natural Henna Floating Badge (Anchored neatly in bottom-right corner of the image) */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-[68px] h-[68px] xs:w-[74px] xs:h-[74px] sm:w-[84px] sm:h-[84px] md:w-[94px] md:h-[94px] lg:w-[100px] lg:h-[100px] rounded-full bg-forest border-[2.5px] md:border-[3px] border-[#faf7f0] shadow-xl flex flex-col justify-center items-center text-center p-1 z-20 overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-square shrink-0 select-none">
                <div className="absolute inset-1 rounded-full border border-gold/40 pointer-events-none"></div>
                <Leaf className="text-gold mb-0.5 sm:mb-1 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0" />
                <span className="text-gold text-[8px] sm:text-[9px] md:text-[10px] font-bold leading-none tracking-widest mb-0.5">100%</span>
                <span className="text-cream text-[7px] sm:text-[7.5px] md:text-[9px] font-semibold leading-tight tracking-wider mb-0.5">NATURAL</span>
                <span className="text-cream text-[7px] sm:text-[7.5px] md:text-[9px] font-semibold leading-tight tracking-wider">HENNA</span>
              </div>
            </div>
          </div>

          {/* TEXT LAYER: Bottom on mobile, left side on tablet & desktop */}
          <div className="order-2 md:order-1 w-full md:w-[50%] lg:w-[46%] flex flex-col justify-center px-4 py-5 xs:px-5 xs:py-6 sm:px-8 sm:py-8 md:px-8 lg:px-12 z-20 relative text-left">
            {/* Eyebrow / Label */}
            <span className="text-[#9b8058] md:text-gold font-semibold uppercase tracking-[0.12em] md:tracking-widest text-[10px] xs:text-[11px] sm:text-xs mb-2 sm:mb-3 block leading-relaxed">
              Bridal Mehendi | Events | Custom Designs
            </span>

            {/* Heading */}
            <h1 className="font-serif font-bold text-forest leading-[1.08] sm:leading-[1.06] tracking-tight mb-2.5 sm:mb-3.5 md:mb-4 text-[clamp(28px,7.5vw,42px)] sm:text-4xl md:text-[42px] lg:text-[52px]">
              Where Tradition <br className="hidden sm:inline" />
              <span className="text-[#3b2f2f]">Meets Elegance</span>
            </h1>

            {/* Description */}
            <p className="text-[#4a4a4a] text-[13px] xs:text-[14px] sm:text-base lg:text-lg max-w-md leading-relaxed mb-5 sm:mb-6 md:mb-8 font-normal">
              Elegant mehendi designs with natural henna for life’s most beautiful celebrations.
            </p>

            {/* Dedicated CTA Container: Side-by-side on all screens without wrapping or squishing */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 w-full max-w-md">
              <Link
                to="/shop"
                className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 h-11 sm:h-12 px-3 sm:px-6 bg-forest hover:bg-[#1a3a2f] text-white font-medium sm:font-semibold rounded-xl transition-all duration-300 shadow-md text-xs sm:text-sm whitespace-nowrap"
              >
                Shop Now <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </Link>
              <a
                href="#gallery"
                onClick={(e) => handleScroll(e, '#gallery')}
                className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 h-11 sm:h-12 px-3 sm:px-6 bg-white border-2 border-forest hover:bg-forest/5 text-forest font-semibold rounded-xl transition-all duration-300 shadow-sm text-xs sm:text-sm whitespace-nowrap"
              >
                Explore Gallery <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </a>
            </div>
          </div>

        </div>

        {/* Feature Strip Below Hero: Clean 2x2 on Mobile, 4 Columns on Tablet and Desktop */}
        <div className="mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {featureItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white/80 border border-beige/60 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-forest/5 flex items-center justify-center shrink-0 text-forest border border-forest/10">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" strokeWidth={1.75} />
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-forest tracking-tight block">
                    {item.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
