import brandLogo from '../assets/images/logo/logo.png';

export const CONTACT_INFO = {
  brandName: 'Browtiful Strokes',
  businessType: 'Mehndi & Nails Studio and Academy',
  shortDesc: 'Premium Mehndi & Nails Studio and Academy.',
  detailedDesc: 'Browtiful Strokes is a premium Mehndi & Nails Studio and Academy based in Chennai, offering beautiful henna artistry, nail services and professional training with elegance and tradition.',
  brandLogo,
  phone: import.meta.env.VITE_CONTACT_PHONE || '+91 96771 08612',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'browtifulstrokes@gmail.com',
  address: import.meta.env.VITE_CONTACT_ADDRESS || 'Old No. 19, New No. 41, 1st Floor, South Usman Road, T. Nagar, Chennai – 600017.',
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '919677108612').replace(/\D/g, ''),
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/browtiful_strokes',
  googleMapsUrl: import.meta.env.VITE_GOOGLE_MAPS_URL || 'https://www.google.com/maps/search/?api=1&query=Old+No.+19,+New+No.+41,+1st+Floor,+South+Usman+Road,+T.+Nagar,+Chennai+600017',
  whatsappMessage: "Hi Browtiful Strokes! I'm interested in your Mehendi services/products. I'd love to know more.",
  workingHours: {
    days: 'Monday – Saturday',
    time: '10:00 AM – 7:00 PM',
    sunday: 'Closed',
    formatted: 'Monday – Saturday: 10:00 AM – 7:00 PM | Sunday: Closed'
  }
};

export const DEMO_MODE = false; // Set to false to switch back to dynamic API/MongoDB mode

// Centralized API configuration: supports VITE_API_URL and VITE_API_BASE_URL with safe normalization
const RAW_API_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://browtiful-strokes-backend.onrender.com').trim();
const cleanApiUrl = RAW_API_URL.replace(/\/+$/, '');

export const API_BASE_URL = cleanApiUrl.endsWith('/api/v1') ? cleanApiUrl : `${cleanApiUrl}/api/v1`;
export const MEDIA_URL = DEMO_MODE ? '' : cleanApiUrl.replace(/\/api\/v1\/?$/, '');
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TDgQ3wxDy69UbS';
export const DEFAULT_WHATSAPP_MSG = encodeURIComponent(CONTACT_INFO.whatsappMessage);

