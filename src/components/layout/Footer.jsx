import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CONTACT_INFO, DEFAULT_WHATSAPP_MSG } from '../../config/constants';
import { LOCAL_IMAGES } from '../../config/images';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

const Instagram = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const WhatsAppIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    className={className}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.1-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

  const handleScroll = (e, targetId) => {
    e.preventDefault();

    if (location.pathname !== '/') {
      navigate('/' + targetId);
      // Wait for navigation and then scroll
      setTimeout(() => {
        const target = document.querySelector(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const SocialLinks = () => (
    <>
      <a
        href={CONTACT_INFO.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-cream/10 rounded-full hover:bg-cream/25 hover:text-gold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-cream shrink-0"
        aria-label="Follow us on Instagram"
        title="Follow us on Instagram"
      >
        <Instagram className="w-4 h-4" />
      </a>
      <a
        href={`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${DEFAULT_WHATSAPP_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-cream/10 rounded-full hover:bg-cream/25 hover:text-gold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-cream shrink-0"
        aria-label="Chat with Browtiful Strokes on WhatsApp"
        title="Chat with Browtiful Strokes on WhatsApp"
      >
        <WhatsAppIcon className="w-4 h-4" />
      </a>
      <a
        href={CONTACT_INFO.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-cream/10 rounded-full hover:bg-cream/25 hover:text-gold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-cream shrink-0"
        aria-label="View our Store Location"
        title="View our Store Location"
      >
        <MapPin className="w-4 h-4" />
      </a>
    </>
  );

  return (
    <footer className="bg-forest text-cream py-6 md:py-8 border-t border-beige/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 pb-6 border-b border-cream/10">
        
        {/* Brand Column */}
        <div className="space-y-2 md:max-w-[240px] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/5 p-1 rounded-full inline-block">
              <img
                src={CONTACT_INFO.brandLogo}
                alt="Browtiful Strokes Logo"
                className="h-8 w-8 rounded-full object-cover border border-beige/10 shadow-sm shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = LOCAL_IMAGES.generalFallback;
                }}
              />
            </div>
            <span className="font-serif font-bold text-base text-cream tracking-wide">
              Browtiful Strokes
            </span>
          </div>
          <p className="text-cream/70 text-xs leading-relaxed max-w-xs font-medium">
            {CONTACT_INFO.shortDesc}
          </p>
        </div>

        {/* Contact Info Row/Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-cream/80 flex-grow md:px-6">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
              <span><span className="font-semibold text-cream">Phone:</span> {CONTACT_INFO.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
              <span><span className="font-semibold text-cream">Email:</span> {CONTACT_INFO.email}</span>
            </p>
          </div>
          
          <div className="space-y-1.5">
            <p className="flex items-start gap-2 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
              <span><span className="font-semibold text-cream">Address:</span> {CONTACT_INFO.address}</span>
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
            <div className="text-cream/70 text-[11px] leading-tight">
              <span className="font-semibold text-gold block mb-0.5">Working Hours:</span>
              <p>Mon – Sat: 10:00 AM – 7:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Social Links Row */}
        <div className="flex gap-3 items-center shrink-0 md:self-center">
          <SocialLinks />
        </div>

      </div>

      {/* Accordions Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-4 space-y-3">
        
        {/* Quick Links Accordion */}
        <div className="border-b border-cream/10 pb-3">
          <button
            onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
            className="flex justify-between items-center w-full text-left py-1.5 font-serif font-bold text-sm text-gold focus:outline-none cursor-pointer"
            aria-expanded={isQuickLinksOpen}
          >
            <span>Quick Links</span>
            <span className="text-cream/80 text-xs font-mono">
              {isQuickLinksOpen ? '−' : '+'}
            </span>
          </button>
          
          <nav
            className={`${
              isQuickLinksOpen ? 'max-h-40 opacity-100 pt-2.5 pb-1.5' : 'max-h-0 opacity-0'
            } overflow-hidden transition-all duration-300 ease-in-out flex flex-col md:flex-row md:flex-wrap gap-2.5 md:gap-6 text-xs text-left`}
          >
            <a href="#home" onClick={(e) => handleScroll(e, '#home')} className="text-cream/80 hover:text-cream transition-colors">Home</a>
            <a href="#categories" onClick={(e) => handleScroll(e, '#categories')} className="text-cream/80 hover:text-cream transition-colors">Categories</a>
            <a href="#bestsellers" onClick={(e) => handleScroll(e, '#bestsellers')} className="text-cream/80 hover:text-cream transition-colors">Best Sellers</a>
            <a href="#combos" onClick={(e) => handleScroll(e, '#combos')} className="text-cream/80 hover:text-cream transition-colors">Combos</a>
            <a href="#allproducts" onClick={(e) => handleScroll(e, '#allproducts')} className="text-cream/80 hover:text-cream transition-colors">All Products</a>
            <a href="#gallery" onClick={(e) => handleScroll(e, '#gallery')} className="text-cream/80 hover:text-cream transition-colors">Gallery</a>
            <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="text-cream/80 hover:text-cream transition-colors">Contact</a>
            <Link to="/shop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-cream/80 hover:text-cream transition-colors">Shop</Link>
          </nav>
        </div>

        {/* Policies Accordion */}
        <div className="border-b border-cream/10 pb-3">
          <button
            onClick={() => setIsPoliciesOpen(!isPoliciesOpen)}
            className="flex justify-between items-center w-full text-left py-1.5 font-serif font-bold text-sm text-gold focus:outline-none cursor-pointer"
            aria-expanded={isPoliciesOpen}
          >
            <span>Policies</span>
            <span className="text-cream/80 text-xs font-mono">
              {isPoliciesOpen ? '−' : '+'}
            </span>
          </button>
          
          <nav
            className={`${
              isPoliciesOpen ? 'max-h-40 opacity-100 pt-2.5 pb-1.5' : 'max-h-0 opacity-0'
            } overflow-hidden transition-all duration-300 ease-in-out flex flex-col md:flex-row md:flex-wrap gap-2.5 md:gap-6 text-xs text-left`}
          >
            <Link to="/privacy-policy" className="text-cream/80 hover:text-cream transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-cream/80 hover:text-cream transition-colors">Terms & Conditions</Link>
            <Link to="/shipping-delivery-policy" className="text-cream/80 hover:text-cream transition-colors">Shipping & Delivery Policy</Link>
            <Link to="/cancellation-refund-policy" className="text-cream/80 hover:text-cream transition-colors">Cancellation & Refund Policy</Link>
          </nav>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5 pt-3 border-t border-cream/10 text-center text-xs text-cream/50">
        <p>&copy; {currentYear} Browtiful Strokes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
