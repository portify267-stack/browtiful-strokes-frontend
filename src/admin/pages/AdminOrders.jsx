import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Eye,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getAdminOrdersApi } from '../services/adminApi';
import AdminPagination from '../components/AdminPagination';
import { useToast } from '../../context/ToastContext';

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const paramStatus = (searchParams.get('paymentStatus') || 'ALL').toUpperCase();
  const validStatus = ['ALL', 'PAID', 'PENDING', 'FAILED'].includes(paramStatus)
    ? paramStatus
    : 'ALL';

  const [allOrders, setAllOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(validStatus);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('phone') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch complete orders list from backend API
      const data = await getAdminOrdersApi({ limit: 100 });
      setAllOrders(data.orders || []);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to fetch orders', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    if (status && status !== 'ALL') {
      setSearchParams({ paymentStatus: status });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Client-side filtering logic
  const filteredOrders = allOrders.filter((order) => {
    const normalizedStatus = String(order.paymentStatus || '').toUpperCase();
    const matchesStatus =
      selectedStatus === 'ALL' || normalizedStatus === selectedStatus;

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      order.customerName?.toLowerCase().includes(term) ||
      order.phone?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  // Client-side pagination calculations
  const limit = 10;
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    const normalized = String(status || '').toUpperCase();
    switch (normalized) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full bg-successgreen text-successgreen-text border border-successgreen-text/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PAID
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            PENDING
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full bg-errorred text-errorred-text border border-errorred-text/20">
            <XCircle className="w-3.5 h-3.5" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const statusTabs = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Failed', value: 'FAILED' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">
            Orders Management
          </h1>
          <p className="text-xs md:text-sm text-charcoal/70 mt-1">
            Review customer orders, check payment status, and order details.
          </p>
        </div>

        <button
          onClick={fetchAllOrders}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 bg-cream border border-beige/80 hover:bg-beige/40 rounded-xl text-charcoal font-semibold text-xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-cream border border-beige/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Customer / Phone Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal/40">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by customer or phone..."
            className="w-full pl-9 pr-4 py-2 bg-cream border border-beige focus:border-gold rounded-xl text-xs text-charcoal placeholder-charcoal/40 shadow-2xs"
          />
        </div>

        {/* Payment Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statusTabs.map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleStatusChange(tab.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gold text-charcoal shadow-xs font-bold'
                    : 'bg-beige/30 text-charcoal/70 hover:bg-beige/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-cream border border-beige/80 rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-charcoal/60">Loading customer orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-beige/40 flex items-center justify-center text-charcoal/40 mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-charcoal">No Orders Found</h3>
            <p className="text-xs text-charcoal/60 mt-1 max-w-sm mx-auto">
              {selectedStatus !== 'ALL' || searchTerm
                ? `No orders match status "${selectedStatus}" ${searchTerm ? `and search "${searchTerm}"` : ''}.`
                : 'No customer orders have been placed yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-beige/30 border-b border-beige/60 text-charcoal/70 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Items Qty</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/40">
                {paginatedOrders.map((order) => {
                  const totalItemsQty =
                    order.items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0;

                  return (
                    <tr key={order._id} className="hover:bg-beige/20 transition-colors">
                      {/* Order ID */}
                      <td className="py-3 px-4 font-mono font-bold text-charcoal/80 text-[11px]">
                        #{order._id.slice(-6)}
                      </td>

                      {/* Customer Name */}
                      <td className="py-3 px-4 font-bold text-charcoal">{order.customerName}</td>

                      {/* Phone */}
                      <td className="py-3 px-4 text-charcoal/80 font-medium">{order.phone}</td>

                      {/* Quantity */}
                      <td className="py-3 px-4 text-charcoal/70">{totalItemsQty} item(s)</td>

                      {/* Total Amount */}
                      <td className="py-3 px-4 font-bold text-charcoal">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-4">{getStatusBadge(order.paymentStatus)}</td>

                      {/* Order Date */}
                      <td className="py-3 px-4 text-charcoal/60 text-[11px]">
                        {formatDate(order.orderDate || order.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-forest hover:bg-forest/10 rounded-lg border border-forest/30 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
