import brandLogo from '../assets/images/logo/logo.png';
import heroImage from '../assets/images/hero/hero-bg.jpg';
import fallbackProduct from '../assets/images/products/fallback_product.svg';
import fallbackCategory from '../assets/images/products/fallback_category.svg';
import studioImage from '../assets/images/studio/studio-compressed.jpg';
import generalFallback from '../assets/images/fallback.svg';

// Gallery images from public folder
const studioImages = [
  { src: '/images/products/studio 1.jpeg', alt: 'Bridal Henna Hand Pattern' },
  { src: '/images/products/studio 2.jpeg', alt: 'Traditional Rajasthani Mandala' },
  { src: '/images/products/studio 3.jpeg', alt: 'Detailed Floral Henna Pattern' },
  { src: '/images/products/studio 4.jpeg', alt: 'Elegant Finger Details' },
  { src: '/images/products/studio 5.jpeg', alt: 'Bridal Back Hand Work' },
  { src: '/images/products/studio 6.jpeg', alt: 'Celebration Guest Designs' },
  { src: '/images/products/studio 7.jpeg', alt: 'Minimalist Modern Henna' },
  { src: '/images/products/studio 8.jpeg', alt: 'Heavy Bridal Forearm Coverage' }
];

export const LOCAL_IMAGES = {
  logo: brandLogo,
  hero: heroImage,
  productFallback: fallbackProduct,
  categoryFallback: fallbackCategory,
  studio: studioImage,
  generalFallback: generalFallback,
  gallery: studioImages
};
