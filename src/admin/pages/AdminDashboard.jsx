import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  FolderTree,
  ShoppingBag,
  Clock,
  Plus,
  ArrowRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { getDashboardStatsApi } from '../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingPayments: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardStatsApi();
      if (data) {
        setStats({
          totalProducts: data.totalProducts || 0,
          totalCategories: data.totalCategories || 0,
          totalOrders: data.totalOrders || 0,
          pendingPayments: data.pendingPayments || 0,
          recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
        });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load dashboard statistics';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
    switch (status) {
      case 'PAID':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-successgreen text-successgreen-text border border-successgreen-text/20">
            PAID
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            PENDING
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-errorred text-errorred-text border border-errorred-text/20">
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">
            Dashboard Overview
          </h1>
          <p className="text-xs md:text-sm text-charcoal/70 mt-1">
            Real-time metrics and operational summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="p-2.5 bg-cream border border-beige/80 hover:bg-beige/40 rounded-xl text-charcoal transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-dark text-cream font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-28 bg-beige/30 rounded-xl animate-pulse border border-beige/40"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-errorred border border-errorred-text/20 rounded-xl text-center">
          <p className="text-sm font-semibold text-errorred-text">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-3 px-4 py-2 text-xs font-bold bg-cream text-charcoal border border-beige rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AdminStatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="forest"
            onClick={() => navigate('/admin/products')}
          />
          <AdminStatCard
            title="Total Categories"
            value={stats.totalCategories}
            icon={FolderTree}
            color="gold"
            onClick={() => navigate('/admin/categories')}
          />
          <AdminStatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            color="blue"
            onClick={() => navigate('/admin/orders')}
          />
          <AdminStatCard
            title="Pending Payments"
            value={stats.pendingPayments}
            icon={Clock}
            color="amber"
            subtitle={`${stats.pendingPayments} order(s) awaiting payment`}
            onClick={() => navigate('/admin/orders?paymentStatus=PENDING')}
          />
        </div>
      )}

      {/* Recent Orders Table (Full Width) */}
      <div className="bg-cream border border-beige/80 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-charcoal">Recent Orders</h2>
            <p className="text-xs text-charcoal/60">Latest transactions from customer store</p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-bold text-forest hover:text-forest-dark flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 bg-beige/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : stats.recentOrders.length === 0 ? (
          <div className="py-12 text-center text-charcoal/50 text-xs">
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-beige/60 text-charcoal/60 uppercase text-[10px] tracking-wider font-bold">
                  <th className="pb-3 px-3">Customer Name</th>
                  <th className="pb-3 px-3">Phone Number</th>
                  <th className="pb-3 px-3">Total Amount</th>
                  <th className="pb-3 px-3">Payment Status</th>
                  <th className="pb-3 px-3">Order Date</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/40">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-beige/20 transition-colors">
                    <td className="py-3 px-3 font-bold text-charcoal truncate max-w-[180px]">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-3 text-charcoal/80 font-medium">{order.phone}</td>
                    <td className="py-3 px-3 font-bold text-charcoal">
                      ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(order.paymentStatus)}</td>
                    <td className="py-3 px-3 text-charcoal/60 text-[11px]">
                      {formatDate(order.orderDate || order.createdAt)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-forest hover:bg-forest/10 rounded-lg border border-forest/30 transition-colors cursor-pointer"
                        title="View Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
