import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Truck } from 'lucide-react';
import { CONTACT_INFO } from '../config/constants';

const FaWhatsapp = ({ size = 22, ...props }) => (
  <svg
    viewBox="0 0 448 512"
    width={size}
    height={size}
    fill="currentColor"
    className="shrink-0 overflow-visible"
    aria-hidden="true"
    {...props}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // Prevent direct access to order success page without order context
  useEffect(() => {
    if (!state || !state.orderId) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state || !state.orderId) {
    return null;
  }

  const { orderId, subtotal, shippingCharge, totalAmount, customerName } = state;
  
  const msgText = `Hi Browtiful Strokes,

I have successfully placed and paid for my order through your website.

Order Reference: ${orderId}
Customer Name: ${customerName}
Subtotal: ₹${subtotal || totalAmount}
Shipping Charge: ₹${shippingCharge || 0}
Total Paid: ₹${totalAmount}
Payment Status: Paid

Please confirm that my order has been received.

Thank you.`;

  const whatsappSupportMsg = encodeURIComponent(msgText);

  return (
    <div className="min-h-screen bg-cream py-16 px-4 flex flex-col items-center justify-center text-center">
      <div className="bg-white rounded-lg border border-beige/60 p-8 max-w-lg w-full shadow-sm space-y-6">
        <div className="bg-successgreen p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-successgreen-text">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-forest">Order Placed Successfully</h1>
          <p className="text-charcoal/70 text-sm">
            Thank you for shopping with Browtiful Strokes, {customerName}! Your payment was verified and stock has been reserved.
          </p>
        </div>

        <div className="bg-cream/45 p-4 rounded-md border border-beige/40 text-left text-xs space-y-2 max-w-sm mx-auto">
          <div className="flex justify-between">
            <span className="text-charcoal/50 font-medium">Order Reference:</span>
            <span className="font-bold text-forest">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/50 font-medium">Subtotal:</span>
            <span className="font-bold text-forest">₹{subtotal || totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/50 font-medium">Shipping Charge:</span>
            <span className="font-bold text-forest">₹{shippingCharge || 0}</span>
          </div>
          <div className="flex justify-between border-t border-beige/40 pt-2">
            <span className="text-charcoal/50 font-medium">Total Paid:</span>
            <span className="font-bold text-forest">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/50 font-medium">Payment Status:</span>
            <span className="font-bold text-successgreen-text">PAID</span>
          </div>
          <div className="flex justify-between border-t border-beige/40 pt-2 mt-1">
            <span className="text-charcoal/50 font-medium flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-forest" /> Estimated Delivery:
            </span>
            <span className="font-bold text-forest">5–7 Business Days</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${whatsappSupportMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold rounded-md transition-all duration-300 text-sm shadow"
          >
            <FaWhatsapp size={22} className="shrink-0 overflow-visible" />
            Confirm Order on WhatsApp
          </a>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-3 bg-forest hover:bg-forest-light text-cream font-semibold rounded-md transition-all duration-300 text-sm shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
