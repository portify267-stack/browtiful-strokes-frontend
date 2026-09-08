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
        {/* Unified Hero Card Container with Image Background */}
        <div className="relative w-full rounded-2xl md:rounded-3xl border border-gold/25 shadow-sm overflow-hidden min-h-[380px] xs:min-h-[420px] sm:min-h-[460px] md:min-h-[500px] flex items-center">
          
          {/* Background Image: Fills the entire hero card */}
          <img
            src={LOCAL_IMAGES.hero}
            alt="Browtiful Strokes Mehendi Art Team"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = LOCAL_IMAGES.generalFallback;
            }}
          />

          {/* Dark Gradient Overlay: Ensures text and buttons remain clearly readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35 pointer-events-none" />

          {/* Content Layer: Text and Buttons positioned OVER the photo */}
          <div className="relative z-10 w-full max-w-2xl px-5 py-8 xs:px-6 xs:py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-16 flex flex-col justify-center text-left">
            {/* Eyebrow / Label */}
            <span className="text-gold font-semibold uppercase tracking-[0.12em] md:tracking-widest text-[10px] xs:text-[11px] sm:text-xs mb-2 sm:mb-3 block leading-relaxed drop-shadow-sm">
              Bridal Mehendi | Events | Custom Designs
            </span>

            {/* Heading */}
            <h1 className="font-serif font-bold text-white leading-[1.08] sm:leading-[1.06] tracking-tight mb-2.5 sm:mb-3.5 md:mb-4 text-[clamp(26px,6.8vw,42px)] sm:text-4xl md:text-[42px] lg:text-[52px] drop-shadow-md">
              Where Tradition <br className="hidden sm:inline" />
              <span className="text-gold">Meets Elegance</span>
            </h1>

            {/* Description */}
            <p className="text-cream/95 text-[13px] xs:text-[14px] sm:text-base lg:text-lg max-w-md leading-relaxed mb-5 sm:mb-6 md:mb-8 font-normal drop-shadow-sm">
              Elegant mehendi designs with natural henna for life’s most beautiful celebrations.
            </p>

            {/* Dedicated CTA Container: Side-by-side on all screens without wrapping */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 w-full max-w-md">
              <Link
                to="/shop"
                className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 h-11 sm:h-12 px-3 sm:px-6 bg-forest hover:bg-[#556143] text-white font-medium sm:font-semibold rounded-xl transition-all duration-300 shadow-md text-xs sm:text-sm whitespace-nowrap"
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

          {/* 100% Natural Henna Floating Badge (Anchored neatly inside hero card in bottom-right corner) */}
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-[64px] h-[64px] xs:w-[72px] xs:h-[72px] sm:w-[84px] sm:h-[84px] md:w-[94px] md:h-[94px] lg:w-[100px] lg:h-[100px] rounded-full bg-forest border-[2.5px] md:border-[3px] border-[#faf7f0] shadow-xl flex flex-col justify-center items-center text-center p-1 z-20 overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-square shrink-0 select-none">
            <div className="absolute inset-1 rounded-full border border-gold/40 pointer-events-none"></div>
            <Leaf className="text-gold mb-0.5 sm:mb-1 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 shrink-0" />
            <span className="text-gold text-[7.5px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold leading-none tracking-widest mb-0.5">100%</span>
            <span className="text-cream text-[6.5px] xs:text-[7px] sm:text-[7.5px] md:text-[9px] font-semibold leading-tight tracking-wider mb-0.5">NATURAL</span>
            <span className="text-cream text-[6.5px] xs:text-[7px] sm:text-[7.5px] md:text-[9px] font-semibold leading-tight tracking-wider">HENNA</span>
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
