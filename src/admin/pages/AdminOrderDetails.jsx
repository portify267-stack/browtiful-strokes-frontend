import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
} from 'lucide-react';
import { getAdminOrderByIdApi, getImageUrl } from '../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminOrderByIdApi(id);
        setOrder(data);
      } catch (err) {
        showToast(err?.response?.data?.message || 'Failed to fetch order details', 'error');
        navigate('/admin/orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate, showToast]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-successgreen text-successgreen-text border border-successgreen-text/20">
            <CheckCircle2 className="w-4 h-4" />
            PAID
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-4 h-4" />
            PENDING
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-errorred text-errorred-text border border-errorred-text/20">
            <XCircle className="w-4 h-4" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-charcoal/60 mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-xl bg-beige/30 hover:bg-beige/60 border border-beige/80 text-charcoal transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold text-charcoal">
                Order #{order._id}
              </h1>
              {getStatusBadge(order.paymentStatus)}
            </div>
            <p className="text-xs text-charcoal/60 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-forest" />
              <span>Placed on {formatDate(order.orderDate || order.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Payment Cards (1 col) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Customer Info Card */}
          <div className="bg-cream border border-beige/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-serif font-bold text-charcoal uppercase tracking-wider pb-2 border-b border-beige/60 flex items-center gap-2">
              <User className="w-4 h-4 text-forest" />
              <span>Customer Details</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-charcoal/50 text-[10px] uppercase tracking-wider font-semibold">Name</p>
                <p className="font-bold text-charcoal mt-0.5">{order.customerName}</p>
              </div>

              <div>
                <p className="text-charcoal/50 text-[10px] uppercase tracking-wider font-semibold">Phone Number</p>
                <p className="font-semibold text-charcoal flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-forest" />
                  <a href={`tel:${order.phone}`} className="hover:underline hover:text-forest">
                    {order.phone}
                  </a>
                </p>
              </div>

              <div>
                <p className="text-charcoal/50 text-[10px] uppercase tracking-wider font-semibold">Shipping Address</p>
                <div className="mt-0.5 font-medium text-charcoal/80 leading-relaxed bg-beige/20 p-2.5 rounded-xl border border-beige/60 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    {order.address?.street && <p>{order.address.street}</p>}
                    <p>
                      {order.address?.city}, {order.address?.state} - {order.address?.zip}
                    </p>
                    <p className="font-semibold text-charcoal">{order.address?.country || 'India'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Razorpay Card */}
          <div className="bg-cream border border-beige/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-serif font-bold text-charcoal uppercase tracking-wider pb-2 border-b border-beige/60 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gold-dark" />
              <span>Razorpay Payment Info</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-charcoal/50 text-[10px] uppercase tracking-wider font-semibold">Payment Gateway Status</p>
                <div className="mt-1">{getStatusBadge(order.paymentStatus)}</div>
              </div>

              <div>
                <p className="text-charcoal/50 text-[10px] uppercase tracking-wider font-semibold">Razorpay Order ID</p>
                <p className="font-mono font-bold text-charcoal text-[11px] bg-beige/30 p-2 rounded-lg border border-beige/60 mt-0.5 select-all">
                  {order.razorpayOrderId}
                </p>
              </div>

              {order.razorpayPaymentId && (
                <div>
                  <p className="text-charcoal/50 text-[10px] uppercase tracking-wider font-semibold">Razorpay Payment ID</p>
                  <p className="font-mono font-bold text-successgreen-text text-[11px] bg-successgreen/40 p-2 rounded-lg border border-successgreen-text/20 mt-0.5 select-all">
                    {order.razorpayPaymentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ordered Items Table & Summary (2 cols) */}
        <div className="lg:col-span-2 bg-cream border border-beige/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-sm font-serif font-bold text-charcoal uppercase tracking-wider pb-3 border-b border-beige/60 flex items-center gap-2">
              <Package className="w-4 h-4 text-forest" />
              <span>Ordered Products ({order.items?.length || 0})</span>
            </h2>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-beige/30 border-b border-beige/60 text-charcoal/70 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3 text-center">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/40">
                  {order.items?.map((item, index) => {
                    const prodObj = typeof item.productId === 'object' ? item.productId : null;
                    const imagePath = prodObj?.images?.[0];
                    const itemSubtotal = (item.price || 0) * (item.qty || 1);

                    return (
                      <tr key={index} className="hover:bg-beige/20 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            {imagePath ? (
                              <img
                                src={getImageUrl(imagePath)}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-lg border border-beige/60 shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder.png';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-beige/40 flex items-center justify-center text-charcoal/40 shrink-0">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-charcoal">{item.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-charcoal/80">
                          ₹{(item.price || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-charcoal">
                          {item.qty}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-charcoal">
                          ₹{itemSubtotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="pt-4 border-t border-beige/60 space-y-2">
            <div className="flex justify-between text-xs text-charcoal/70">
              <span>Items Subtotal</span>
              <span>₹{(order.subtotal || order.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            {order.totalWeightInGrams !== undefined && (
              <div className="flex justify-between text-xs text-charcoal/70">
                <span>Total Weight</span>
                <span>
                  {order.totalWeightInGrams >= 1000 
                    ? `${(order.totalWeightInGrams / 1000).toFixed(2)} kg` 
                    : `${order.totalWeightInGrams} g`}
                  {order.chargeableWeightKg && ` (Chargeable: ${order.chargeableWeightKg} kg)`}
                </span>
              </div>
            )}
            {order.shippingZone && (
              <div className="flex justify-between text-xs text-charcoal/70">
                <span>Shipping Zone</span>
                <span className="font-semibold text-charcoal">{order.shippingZone}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-charcoal/70">
              <span>Shipping Charge</span>
              <span>
                {order.shippingCharge !== undefined 
                  ? `₹${order.shippingCharge.toLocaleString('en-IN')}` 
                  : '₹0'}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif font-bold text-charcoal pt-3 border-t border-beige/60">
              <span>Total Paid Amount</span>
              <span className="text-forest">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
