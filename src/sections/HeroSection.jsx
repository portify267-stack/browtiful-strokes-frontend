import React from 'react';
import { Link } from 'react-router-dom';
import { LOCAL_IMAGES } from '../config/images';
import { ArrowRight, Leaf, Flower2, ShieldCheck, Gift, Clock } from 'lucide-react';

const HeroSection = () => {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureItems = [
    { mobileText: '100% Natural', desktopText: '100% Natural Henna', icon: Leaf },
    { mobileText: 'Custom Designs', desktopText: 'Custom Designs for You', icon: Flower2 },
    { mobileText: 'Hygienic & Safe', desktopText: 'Hygienic & Safe Practices', icon: ShieldCheck },
    { mobileText: 'Every Occasion', desktopText: 'Perfect for Every Occasion', icon: Gift, hideMobile: true },
    { mobileText: 'On-Time Service', desktopText: 'On-Time Service', icon: Clock },
  ];

  return (
    <section id="home" className="relative w-full flex flex-col bg-[#fdfbf7] overflow-x-hidden">
      {/* Main Hero Container */}
      <div className="relative w-full min-h-0 md:min-h-[560px] lg:min-h-[75vh] flex flex-col md:flex-row items-center justify-between overflow-hidden rounded-b-2xl md:rounded-none">

        {/* TEXT LAYER (Left Side on Desktop, Top on Mobile) */}
        <div className="w-full md:w-[46%] lg:w-[42%] flex flex-col justify-center px-5 pt-8 pb-6 sm:py-8 md:px-10 lg:px-16 z-20 relative order-1">
          {/* Text Content Wrapper */}
          <div className="max-w-full sm:max-w-[420px] md:max-w-xl text-left">
            {/* Eyebrow / Label */}
            <span className="text-[#9b8058] md:text-gold font-medium md:font-semibold uppercase tracking-[0.1em] md:tracking-widest text-[10px] sm:text-[11px] md:text-xs mb-[10px] sm:mb-3 md:mb-4 block leading-relaxed max-w-[280px] md:max-w-full">
              Bridal Mehendi | Events | Custom Designs
            </span>

            {/* Heading */}
            <h1 className="font-serif font-normal md:font-bold leading-[1.02] md:leading-[1.05] tracking-[-0.02em] md:tracking-normal mb-[14px] sm:mb-4 md:mb-6 flex flex-col text-[clamp(36px,9vw,48px)] sm:text-[44px] md:text-5xl lg:text-6xl">
              <span className="text-[#3b2f2f]">Where Tradition</span>
              <span className="text-[#5c705a] md:text-forest mt-0 md:mt-1">Meets Elegance</span>
            </h1>

            {/* Description */}
            <p className="text-[#4a4a4a] text-[14px] sm:text-[16px] md:text-[15px] lg:text-lg max-w-[340px] md:max-w-md leading-[1.45] md:leading-relaxed mb-6 sm:mb-7 md:mb-8 font-normal md:font-normal">
              Elegant mehendi designs with natural henna for life’s most beautiful celebrations.
            </p>

            {/* Dedicated CTA Container */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <Link
                to="/shop"
                className="flex justify-center items-center gap-1.5 w-[150px] md:w-[155px] h-[46px] px-3 md:px-4 bg-forest hover:bg-[#1a3a2f] text-white font-medium rounded-lg md:rounded-xl transition-all duration-300 shadow-md text-[13px] md:text-sm whitespace-nowrap shrink-0 flex-none"
              >
                Shop Now <ArrowRight size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
              <a
                href="#gallery"
                onClick={(e) => handleScroll(e, '#gallery')}
                className="flex justify-center items-center gap-1.5 w-[150px] md:w-[155px] h-[46px] px-3 md:px-4 bg-white border-2 border-forest hover:bg-forest/5 text-forest font-semibold rounded-lg md:rounded-xl transition-all duration-300 shadow-sm text-[13px] md:text-sm whitespace-nowrap shrink-0 flex-none"
              >
                Explore Gallery <ArrowRight size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* IMAGE LAYER (Right Side on Desktop, Below on Mobile) */}
        <div className="w-full md:w-[54%] lg:w-[58%] px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 z-10 relative order-2 flex items-center justify-center">
          {/* Image Frame with Aspect Ratio Preservation */}
          <div className="relative w-full max-w-[620px] lg:max-w-[720px] rounded-2xl overflow-hidden shadow-lg border border-gold/20 bg-white">
            <img
              src={LOCAL_IMAGES.hero}
              alt="Browtiful Strokes Mehendi Art Team"
              className="w-full h-auto object-contain block"
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = LOCAL_IMAGES.generalFallback;
              }}
            />

            {/* Floating Badge (Visible on Mobile, Tablet, Laptop & Desktop) */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-5 md:right-5 w-[72px] h-[72px] xs:w-[78px] xs:h-[78px] sm:w-[86px] sm:h-[86px] md:w-[98px] md:h-[98px] lg:w-[104px] lg:h-[104px] rounded-full bg-forest border-[2.5px] md:border-[3px] border-[#fdfbf7] shadow-xl flex flex-col justify-center items-center text-center p-1 sm:p-1.5 z-20 overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-square shrink-0">
              <div className="absolute inset-1 rounded-full border border-gold/40 pointer-events-none"></div>
              <Leaf size={14} className="text-gold mb-0.5 sm:mb-1 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="text-gold text-[8px] sm:text-[9px] md:text-[10.5px] font-bold leading-none tracking-widest mb-0.5">100%</span>
              <span className="text-cream text-[7px] sm:text-[8px] md:text-[9.5px] font-semibold leading-tight tracking-wider mb-0.5">NATURAL</span>
              <span className="text-cream text-[7px] sm:text-[8px] md:text-[9.5px] font-semibold leading-tight tracking-wider">HENNA</span>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Strip Below Hero */}
      <div className="w-full bg-[#fdfbf7] py-6 md:py-8 px-3 md:px-8 shadow-sm relative z-20 border-b border-gold/10">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: 4 Cols. Desktop/Tablet: Flexible wrap */}
          <div className="grid grid-cols-4 md:flex md:flex-wrap lg:flex-nowrap justify-between items-start md:items-center gap-2 md:gap-6 lg:gap-4">
            {featureItems.map((item, index) => (
              <React.Fragment key={index}>
                <div className={`flex flex-col md:flex-row items-center justify-start gap-1.5 md:gap-3 text-center md:text-left ${item.hideMobile ? 'hidden md:flex' : 'flex'} md:w-[30%] lg:w-auto`}>
                  <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-forest/5 flex items-center justify-center shrink-0 text-forest border border-forest/10">
                    <item.icon size={16} className="md:w-5 md:h-5" strokeWidth={1.5} />
                  </div>
                  <div className="leading-tight">
                    <span className="block md:hidden text-[9px] xs:text-[10px] font-bold text-forest uppercase tracking-wide max-w-[65px] mx-auto">
                      {item.mobileText}
                    </span>
                    <span className="hidden md:block text-[11px] lg:text-[13px] font-bold text-forest uppercase tracking-wider max-w-[140px]">
                      {item.desktopText}
                    </span>
                  </div>
                </div>
                {index < featureItems.length - 1 && (
                  <div className="hidden lg:block w-px h-10 bg-gold/30"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
