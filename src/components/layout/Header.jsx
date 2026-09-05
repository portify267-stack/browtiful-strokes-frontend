import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../cart/CartDrawer';
import { useLocation, useNavigate } from 'react-router-dom';
import { CONTACT_INFO } from '../../config/constants';
import { LOCAL_IMAGES } from '../../config/images';

const Header = () => {
  const { getItemCount, isCartOpen, openCart, closeCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Track scroll state for compact header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', path: '/' },
    { label: 'Categories', href: '#categories' },
    { label: 'Best Sellers', href: '#bestsellers' },
    { label: 'Combos', href: '#combos' },
    { label: 'All Products', href: '#allproducts' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
    { label: 'Shop', path: '/shop' },
  ];

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (link.path === '/shop') {
      navigate('/shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (link.label === 'Home') {
      if (location.pathname !== '/') {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const href = link.href;
    if (location.pathname !== '/') {
      navigate('/' + href);
      // Wait for navigation and then scroll
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const itemCount = getItemCount();

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/95 shadow-md py-3.5 backdrop-blur-md border-b border-beige/40'
            : 'bg-cream py-5.5 border-b border-beige/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-85 transition-opacity"
          >
            <img
              src={CONTACT_INFO.brandLogo}
              alt="Browtiful Strokes Logo"
              className="h-12 w-12 rounded-full object-cover border border-beige/40 shadow-sm shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = LOCAL_IMAGES.generalFallback;
              }}
            />
            <span className="font-serif font-bold text-lg md:text-xl tracking-wide flex items-center leading-none text-forest">
              Browtiful Strokes
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.path === '/shop' && location.pathname === '/shop';
              return (
                <a
                  key={link.label}
                  href={link.path || link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-sm font-semibold transition-colors relative group py-1 ${
                    isActive
                      ? 'text-forest font-bold'
                      : 'text-charcoal/80 hover:text-forest'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Cart & Menu Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-beige/40 text-forest transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-cream text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-beige/40 text-forest transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <div
          className={`lg:hidden fixed left-0 w-full bg-cream shadow-inner border-t border-beige/30 transition-all duration-300 z-30 ${
            isMobileMenuOpen
              ? 'top-[72px] opacity-100 visible h-screen'
              : 'top-[-500px] opacity-0 invisible h-0'
          }`}
        >
          <nav className="flex flex-col p-6 space-y-4 bg-cream h-full">
            {navLinks.map((link) => {
              const isActive = link.path === '/shop' && location.pathname === '/shop';
              return (
                <a
                  key={link.label}
                  href={link.path || link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-base font-semibold border-b border-beige/30 pb-2.5 transition-colors ${
                    isActive ? 'text-forest font-bold' : 'text-charcoal/80 hover:text-forest'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Spacer to prevent layout shift */}
      <div className="h-[76px]" />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Header;
