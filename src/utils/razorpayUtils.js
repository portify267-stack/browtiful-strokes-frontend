import { RAZORPAY_KEY_ID } from '../config/constants';

/**
 * Constructs the standard Razorpay Checkout configuration options.
 * Ensures UPI is explicitly enabled alongside Cards, Netbanking, and Wallets.
 * Omits restrictive config.display blocks that suppress UPI rendering in Test Mode.
 *
 * @param {Object} params
 * @param {Object} params.order - Order data from backend/store
 * @param {Object} params.razorpayOptions - Options returned by backend order creation endpoint
 * @param {Function} params.handler - Success payment callback
 * @param {Function} [params.onDismiss] - Modal dismissal callback
 * @returns {Object} Razorpay checkout options object
 */
export const buildRazorpayOptions = ({
  order,
  razorpayOptions = {},
  handler,
  onDismiss,
}) => {
  return {
    key: razorpayOptions.key || RAZORPAY_KEY_ID,
    amount: razorpayOptions.amount,
    currency: razorpayOptions.currency || 'INR',
    name: razorpayOptions.name || 'Browtiful Strokes',
    description: razorpayOptions.description || 'Service Booking / Payment',
    order_id: razorpayOptions.order_id,
    handler,
    prefill: {
      name: order?.customerName || '',
      email: order?.email || '',
      contact: order?.phone || '',
    },
    theme: {
      color: '#6B7753',
    },
    method: {
      netbanking: true,
      card: true,
      upi: true,
      wallet: true,
    },
    modal: {
      ondismiss: onDismiss,
    },
  };
};
