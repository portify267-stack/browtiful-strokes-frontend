import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '../validation/checkoutSchema';
import { createOrder } from '../api/orderApi';
import { verifyPayment } from '../api/paymentApi';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2, AlertCircle, Truck } from 'lucide-react';
import { RAZORPAY_KEY_ID, DEMO_MODE } from '../config/constants';
import { LOCAL_IMAGES } from '../config/images';
import { resolveProductImageUrl } from '../utils/productUtils';

const Checkout = () => {
  const { cart, getSubtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'India',
    },
  });

  const watchCity = watch('city', '');
  const watchState = watch('state', '');

  const cleanString = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/\s+/g, ' ').trim().toLowerCase();
  };

  const isChennaiCity = (city) => {
    const cleanCity = cleanString(city);
    return cleanCity === 'chennai' || cleanCity === 'madras' || cleanCity === 'chennai city';
  };

  const isTamilNaduState = (state) => {
    const cleanState = cleanString(state);
    return cleanState === 'tamil nadu' || cleanState === 'tamilnadu' || cleanState === 'tn';
  };

  // Weight Calculation Rules
  const totalWeightInGrams = cart.reduce((total, item) => {
    return total + (item.weight || 0) * item.qty;
  }, 0);

  const chargeableWeightKg = Math.max(1, Math.ceil(totalWeightInGrams / 1000));

  const hasInvalidWeight = cart.some(item => !item.weight || item.weight <= 0);

  let shippingCharge = 0;
  let shippingError = null;

  if (watchState) {
    if (isTamilNaduState(watchState)) {
      if (watchCity) {
        if (isChennaiCity(watchCity)) {
          shippingCharge = chargeableWeightKg * 60;
        } else {
          shippingCharge = chargeableWeightKg * 80;
        }
      } else {
        shippingCharge = chargeableWeightKg * 80;
      }
    } else {
      shippingError = "Delivery is currently available only within Tamil Nadu. Please contact us on WhatsApp for assistance.";
    }
  }

  const subtotal = getSubtotal();
  const grandTotal = shippingError ? subtotal : (subtotal + shippingCharge);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const onSubmitOrder = async (formData) => {
    try {
      setIsSubmitting(true);
      setPaymentError(null);

      const itemsPayload = cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      }));

      const orderPayload = {
        customerName: formData.customerName,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        items: itemsPayload,
        subtotal: subtotal,
        shippingCharge: shippingCharge,
        totalAmount: grandTotal,
      };

      if (DEMO_MODE) {
        // Bypass Razorpay payment and place order locally
        const orderResult = await createOrder(orderPayload);
        const { order } = orderResult;
        
        clearCart();
        navigate('/order-success', {
          state: {
            orderId: order._id,
            subtotal: order.subtotal,
            shippingCharge: order.shippingCharge,
            totalAmount: order.totalAmount,
            customerName: order.customerName,
            phone: order.phone,
          },
        });
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const orderResult = await createOrder(orderPayload);
      const { order, razorpayOptions } = orderResult;

      const options = {
        key: razorpayOptions.key || RAZORPAY_KEY_ID,
        amount: razorpayOptions.amount,
        currency: razorpayOptions.currency,
        name: razorpayOptions.name,
        description: razorpayOptions.description,
        order_id: razorpayOptions.order_id,
        handler: async function (response) {
          try {
            setIsSubmitting(true);
            
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verificationResult = await verifyPayment(verifyPayload);

            if (verificationResult && verificationResult.paymentStatus === 'PAID') {
              clearCart();
              navigate('/order-success', {
                state: {
                  orderId: order._id,
                  subtotal: order.subtotal,
                  shippingCharge: order.shippingCharge,
                  totalAmount: order.totalAmount,
                  customerName: order.customerName,
                  phone: order.phone,
                },
              });
            } else {
              throw new Error('Payment verification returned an invalid status.');
            }
          } catch (verifyErr) {
            console.error(verifyErr);
            const friendlyErr = 'Payment verification failed. Please contact support if your account was debited.';
            setPaymentError(friendlyErr);
            showToast(friendlyErr, 'error');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: order.customerName,
          contact: order.phone,
        },
        theme: {
          color: '#6B7753',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            const userMsg = 'Payment window closed by user.';
            setPaymentError(userMsg);
            showToast(userMsg, 'info');
          },
        },
        config: {
          display: {
            hide: [
              { method: 'wallet' },
              { method: 'paylater' },
              { method: 'emi' },
            ],
            sequence: ['upi', 'card', 'netbanking'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      } catch (err) {
        console.error('Checkout Order Error:', err);
        
        const serverMsg = err.response?.data?.message;
        let friendlyErr = serverMsg || err.message || 'Failed to place order. Please try again later.';
        if (!err.response) {
          friendlyErr = 'Network connection failed. Please check your internet and try again.';
        }

        setPaymentError(friendlyErr);
        showToast(friendlyErr, 'error');
        setIsSubmitting(false);
      }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-lg border border-beige/60 p-8 max-w-md w-full shadow-sm">
          <ShoppingBag className="w-16 h-16 text-beige mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-forest mb-2">Checkout is empty</h2>
          <p className="text-charcoal/70 text-sm mb-6">
            You don't have any items in your shopping cart yet. Explore our mehendi products and add them to your cart before checking out.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-forest hover:bg-forest-light text-cream font-semibold rounded-md transition-all duration-300 text-sm shadow"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-light mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-forest text-left mb-8">
          Checkout details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Billing Form */}
          <form
            onSubmit={handleSubmit(onSubmitOrder)}
            className="lg:col-span-7 bg-white p-6 md:p-8 rounded-lg border border-beige/60 space-y-6 text-left"
          >
            <h2 className="font-serif text-xl font-bold text-forest border-b border-beige/45 pb-3 mb-4">
              Shipping & Contact Information
            </h2>

            {paymentError && (
              <div className="bg-errorred text-errorred-text border border-errorred-text/20 p-4 rounded-md text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Payment Error:</span> {paymentError}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkout-name" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  placeholder="E.g., Nasheeha Tabassum"
                  {...register('customerName')}
                  className={`w-full px-4 py-2.5 text-sm rounded-md border bg-white text-charcoal transition-all duration-200 ${
                    errors.customerName ? 'border-errorred-text/50 focus:ring-1 focus:ring-errorred-text focus:border-errorred-text' : 'border-beige focus:border-forest focus:ring-1 focus:ring-forest'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-errorred-text text-[11px] mt-1 font-medium">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                  Phone Number
                </label>
                <input
                  id="checkout-phone"
                  type="text"
                  placeholder="10-digit mobile number"
                  {...register('phone')}
                  className={`w-full px-4 py-2.5 text-sm rounded-md border bg-white text-charcoal transition-all duration-200 ${
                    errors.phone ? 'border-errorred-text/50 focus:ring-1 focus:ring-errorred-text focus:border-errorred-text' : 'border-beige focus:border-forest focus:ring-1 focus:ring-forest'
                  }`}
                />
                {errors.phone && (
                  <p className="text-errorred-text text-[11px] mt-1 font-medium">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="checkout-street" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                Street Address
              </label>
              <input
                id="checkout-street"
                type="text"
                placeholder="House, apartment, suite, street name"
                {...register('street')}
                className={`w-full px-4 py-2.5 text-sm rounded-md border bg-white text-charcoal transition-all duration-200 ${
                  errors.street ? 'border-errorred-text/50 focus:ring-1 focus:ring-errorred-text focus:border-errorred-text' : 'border-beige focus:border-forest focus:ring-1 focus:ring-forest'
                }`}
              />
              {errors.street && (
                <p className="text-errorred-text text-[11px] mt-1 font-medium">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="checkout-city" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                  City
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  placeholder="City"
                  {...register('city')}
                  className={`w-full px-4 py-2.5 text-sm rounded-md border bg-white text-charcoal transition-all duration-200 ${
                    errors.city ? 'border-errorred-text/50 focus:ring-1 focus:ring-errorred-text focus:border-errorred-text' : 'border-beige focus:border-forest focus:ring-1 focus:ring-forest'
                  }`}
                />
                {errors.city && (
                  <p className="text-errorred-text text-[11px] mt-1 font-medium">{errors.city.message}</p>
                )}
              </div>

              <div className="col-span-1 md:col-span-1">
                <label htmlFor="checkout-state" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                  State
                </label>
                <input
                  id="checkout-state"
                  type="text"
                  placeholder="State"
                  {...register('state')}
                  className={`w-full px-4 py-2.5 text-sm rounded-md border bg-white text-charcoal transition-all duration-200 ${
                    errors.state ? 'border-errorred-text/50 focus:ring-1 focus:ring-errorred-text focus:border-errorred-text' : 'border-beige focus:border-forest focus:ring-1 focus:ring-forest'
                  }`}
                />
                {errors.state && (
                  <p className="text-errorred-text text-[11px] mt-1 font-medium">{errors.state.message}</p>
                )}
              </div>

              <div className="col-span-1 md:col-span-1">
                <label htmlFor="checkout-zip" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                  PIN Code
                </label>
                <input
                  id="checkout-zip"
                  type="text"
                  placeholder="6-digit ZIP"
                  {...register('zip')}
                  className={`w-full px-4 py-2.5 text-sm rounded-md border bg-white text-charcoal transition-all duration-200 ${
                    errors.zip ? 'border-errorred-text/50 focus:ring-1 focus:ring-errorred-text focus:border-errorred-text' : 'border-beige focus:border-forest focus:ring-1 focus:ring-forest'
                  }`}
                />
                {errors.zip && (
                  <p className="text-errorred-text text-[11px] mt-1 font-medium">{errors.zip.message}</p>
                )}
              </div>

              <div className="col-span-1 md:col-span-1">
                <label htmlFor="checkout-country" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wide mb-1">
                  Country
                </label>
                <input
                  id="checkout-country"
                  type="text"
                  disabled
                  {...register('country')}
                  className="w-full px-4 py-2.5 text-sm rounded-md border border-beige bg-beige/25 text-charcoal/60 cursor-not-allowed font-semibold"
                />
              </div>
            </div>

             <div className="pt-4 border-t border-beige/40 space-y-4">
              {shippingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{shippingError}</span>
                </div>
              )}
              {hasInvalidWeight && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>One or more products do not have a valid weight configured. Please contact support.</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-charcoal/75 bg-[#faf8f5] py-2 px-3 border border-beige/40 rounded-lg">
                <Truck className="w-4 h-4 text-forest" />
                <span>Estimated Delivery: 5–7 Business Days</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !!shippingError || hasInvalidWeight || !watchState}
                className="w-full py-3.5 bg-forest hover:bg-forest-light text-cream font-bold rounded-md transition-all duration-300 shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Preparing Payment...
                  </>
                ) : (
                  `Pay Securely ₹${grandTotal}`
                )}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-beige/60 space-y-6 text-left">
            <h2 className="font-serif text-xl font-bold text-forest border-b border-beige/40 pb-3">
              Order Summary
            </h2>

            <div className="divide-y divide-beige/40 max-h-[300px] overflow-y-auto pr-2 space-y-3">
              {cart.map((item) => {
                const itemImg = item.image || '';
                const resolvedItemImg = itemImg && typeof itemImg === 'string' && itemImg.trim() !== ''
                  ? resolveProductImageUrl(itemImg)
                  : LOCAL_IMAGES.productFallback;

                return (
                  <div key={item.productId} className="flex gap-3 pt-3 first:pt-0">
                    <img
                      src={resolvedItemImg}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded bg-beige/10 border border-beige/20 shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = LOCAL_IMAGES.productFallback;
                      }}
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-semibold text-forest leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-charcoal/50 mt-0.5">
                        Qty: {item.qty} {item.variant !== 'Default' ? `| Size: ${item.variant}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-forest shrink-0">₹{item.price * item.qty}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-beige/60 space-y-2">
              <div className="flex justify-between text-xs text-charcoal/80">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-charcoal/80">
                <span>Total Product Weight</span>
                <span>{totalWeightInGrams >= 1000 ? `${(totalWeightInGrams / 1000).toFixed(2)} kg` : `${totalWeightInGrams} g`}</span>
              </div>
              <div className="flex justify-between text-xs text-charcoal/80">
                <span>Shipping Charge</span>
                {shippingError ? (
                  <span className="text-errorred-text font-semibold">N/A</span>
                ) : watchState && watchCity ? (
                  <span>₹{shippingCharge}</span>
                ) : (
                  <span className="text-charcoal/40 italic">Enter address to calculate</span>
                )}
              </div>
              <div className="flex justify-between text-base font-bold text-forest border-t border-beige/40 pt-3">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
              <div className="pt-3 mt-2 border-t border-beige/40 flex items-center gap-1.5 text-xs font-semibold text-charcoal/70">
                <Truck className="w-4 h-4 text-forest" />
                <span>Estimated Delivery: 5–7 Business Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
