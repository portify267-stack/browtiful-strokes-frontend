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
    <section id="home" className="relative w-full bg-[#fdfbf7] overflow-x-hidden pt-2 pb-5 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
        {/* Unified Hero Card Container matching the reference image */}
        <div className="relative w-full rounded-2xl md:rounded-3xl border border-gold/25 shadow-xl overflow-hidden bg-[#101911] aspect-[1.46/1] xs:aspect-[1.50/1] sm:aspect-[1.52/1] min-h-[250px] xs:min-h-[270px] sm:min-h-[350px] md:min-h-[440px] lg:min-h-[500px] flex items-center">
          
          {/* Background Image: Preserves the entire group photo composition */}
          <img
            src={LOCAL_IMAGES.hero}
            alt="Browtiful Strokes Mehendi Art Team"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-[80%_center]"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = LOCAL_IMAGES.generalFallback;
            }}
          />

          {/* Subtle Left-Side Dark Gradient: Keeps original photo naturally bright while ensuring text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.35) 30%, rgba(0, 0, 0, 0.10) 55%, rgba(0, 0, 0, 0) 75%)',
            }}
          />

          {/* Elegant gold botanical line illustration in bottom-left corner */}
          <div className="absolute -bottom-2 -left-2 w-28 xs:w-36 sm:w-52 md:w-64 h-28 xs:h-36 sm:h-52 md:h-64 pointer-events-none opacity-30 sm:opacity-40 z-10 select-none overflow-hidden">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#c8a86b]">
              <path d="M-20 220 C 10 160, 40 120, 100 80 C 130 60, 170 50, 200 40 C 170 70, 150 110, 140 150 C 130 190, 140 210, 160 220" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 210 C 30 170, 60 140, 110 110 C 80 130, 50 160, 30 200" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M60 140 C 80 120, 110 110, 130 115 C 115 125, 95 135, 75 150" stroke="currentColor" strokeWidth="1" />
              <path d="M20 180 C 40 160, 70 150, 90 155 C 75 165, 55 175, 35 190" stroke="currentColor" strokeWidth="1" />
              <path d="M100 80 C 120 40, 160 20, 190 10 C 170 30, 150 60, 140 90" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M-10 170 C 10 140, 30 120, 60 100 C 75 90, 100 85, 120 80 C 100 95, 80 115, 70 135" stroke="currentColor" strokeWidth="1" />
              <path d="M40 115 C 55 95, 80 85, 95 90 C 80 100, 65 110, 50 120" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>

          {/* Content Layer: Text and Buttons positioned OVER the photo on the LEFT */}
          <div className="relative z-10 w-full max-w-[64%] xs:max-w-[60%] sm:max-w-[54%] md:max-w-[48%] lg:max-w-[44%] px-3.5 py-4 xs:px-5 xs:py-5 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-14 lg:py-12 flex flex-col justify-center text-left">
            {/* Eyebrow / Label */}
            <span className="text-[#c8a86b] font-sans font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[7.5px] xs:text-[8.5px] sm:text-[11px] md:text-xs lg:text-[13px] mb-1 xs:mb-1.5 sm:mb-2.5 md:mb-3 block leading-[1.3] drop-shadow-sm">
              BRIDAL MEHENDI | EVENTS |<br />
              CUSTOM DESIGNS
            </span>

            {/* Heading */}
            <h1 className="font-serif font-bold text-[#faf5ec] leading-[1.08] tracking-tight mb-1.5 xs:mb-2 sm:mb-3 md:mb-4 text-[clamp(17px,4.5vw,52px)] drop-shadow-md">
              Where Tradition<br />
              <span className="text-[#8fa47b]">Meets Elegance</span>
            </h1>

            {/* Description */}
            <p className="text-[#ded8cb] text-[8.5px] xs:text-[9.5px] sm:text-[12px] md:text-[14px] lg:text-[16px] max-w-[190px] xs:max-w-[220px] sm:max-w-[300px] md:max-w-[360px] leading-[1.35] sm:leading-relaxed mb-2.5 xs:mb-3 sm:mb-4.5 md:mb-6 font-normal drop-shadow-sm">
              Elegant mehendi designs with natural henna for life’s most beautiful celebrations.
            </p>

            {/* Dedicated Vertical CTA Container matching reference */}
            <div className="flex flex-col items-start gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3">
              <Link
                to="/shop"
                className="w-[115px] xs:w-[130px] sm:w-[165px] md:w-[195px] h-7 xs:h-8 sm:h-10 md:h-11 flex justify-center items-center gap-1.5 bg-[#4f6745] hover:bg-[#415538] text-white font-medium rounded-lg sm:rounded-xl transition-all duration-300 shadow-md text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-sm whitespace-nowrap"
              >
                Shop Now <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
              </Link>
              <a
                href="#gallery"
                onClick={(e) => handleScroll(e, '#gallery')}
                className="w-[115px] xs:w-[130px] sm:w-[165px] md:w-[195px] h-7 xs:h-8 sm:h-10 md:h-11 flex justify-center items-center gap-1.5 bg-black/20 hover:bg-black/35 border border-[#c2aa72]/80 hover:border-[#c2aa72] text-[#faf5ec] font-medium rounded-lg sm:rounded-xl transition-all duration-300 text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-sm whitespace-nowrap"
              >
                Explore Gallery <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
              </a>
            </div>
          </div>

          {/* 100% Natural Henna Floating Badge (Anchored in bottom-right corner inside photo) */}
          <div className="absolute bottom-2 right-2 xs:bottom-3 xs:right-3 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-[48px] h-[48px] xs:w-[56px] xs:h-[56px] sm:w-[74px] sm:h-[74px] md:w-[88px] md:h-[88px] lg:w-[98px] lg:h-[98px] rounded-full bg-[#122415] border-[1.5px] sm:border-2 border-[#c8a86b] shadow-xl flex flex-col justify-center items-center text-center p-1 z-20 overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-square shrink-0 select-none">
            <div className="absolute inset-0.5 sm:inset-1 rounded-full border border-[#c8a86b]/30 pointer-events-none" />
            <Leaf className="text-[#8fa47b] mb-0.5 sm:mb-1 w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
            <span className="text-[#c8a86b] text-[6px] xs:text-[7px] sm:text-[8.5px] md:text-[9.5px] font-bold leading-none tracking-widest mb-0.5">100%</span>
            <span className="text-[#faf5ec] text-[5px] xs:text-[6px] sm:text-[7px] md:text-[8px] font-semibold leading-tight tracking-wider mb-0.5">NATURAL</span>
            <span className="text-[#faf5ec] text-[5px] xs:text-[6px] sm:text-[7px] md:text-[8px] font-semibold leading-tight tracking-wider">HENNA</span>
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
