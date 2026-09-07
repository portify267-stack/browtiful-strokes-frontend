import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  Clock,
  ShoppingBag,
  RefreshCw,
  Receipt,
  Info,
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import { getSalesAnalyticsApi } from '../services/adminApi';
import { useToast } from '../../context/ToastContext';

const AdminSales = () => {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    thisMonthSales: 0,
    lastMonthSales: 0,
    totalPaidOrders: 0,
    monthlySales: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchSalesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSalesAnalyticsApi();
      if (data) {
        const rawMonthly = Array.isArray(data.monthlySales) ? data.monthlySales : [];
        const normalizedMonthly = rawMonthly.map((m) => ({
          key: m.key || m.monthKey || '',
          label: m.label || '',
          fullLabel: m.fullLabel || m.label || '',
          amount: Number(m.amount ?? m.totalSales ?? 0),
          orderCount: Number(m.orderCount ?? 0),
        }));

        setSalesData({
          totalSales: Number(data.totalSales || 0),
          thisMonthSales: Number(data.thisMonthSales || 0),
          lastMonthSales: Number(data.lastMonthSales || 0),
          totalPaidOrders: Number(data.totalPaidOrders || data.paidOrdersCount || 0),
          monthlySales: normalizedMonthly,
        });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load sales statistics';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const maxMonthlyAmount = Math.max(
    ...salesData.monthlySales.map((m) => m.amount || 0),
    1
  );

  const currentMonthLabel = salesData.monthlySales.length > 0
    ? salesData.monthlySales[salesData.monthlySales.length - 1].fullLabel
    : 'Current Month';

  const lastMonthLabel = salesData.monthlySales.length > 1
    ? salesData.monthlySales[salesData.monthlySales.length - 2].fullLabel
    : 'Previous Month';

  return (
    <div className="space-y-8 animate-fade-in text-charcoal">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-charcoal flex items-center gap-2.5">
            <span role="img" aria-label="sales">💰</span> Sales Overview
          </h1>
          <p className="text-xs md:text-sm text-charcoal/70 mt-1">
            Real revenue and monthly financial performance from completed customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSalesData}
            disabled={isLoading}
            className="p-2.5 bg-cream border border-beige/80 hover:bg-beige/40 rounded-xl text-charcoal transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Sales Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-dark text-cream font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View All Orders</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
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
            onClick={fetchSalesData}
            className="mt-3 px-4 py-2 text-xs font-bold bg-cream text-charcoal border border-beige rounded-lg cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AdminStatCard
            title="Total Sales"
            value={`₹${salesData.totalSales.toLocaleString('en-IN')}`}
            icon={TrendingUp}
            color="forest"
            subtitle={`${salesData.totalPaidOrders} paid order(s)`}
          />
          <AdminStatCard
            title="This Month Sales"
            value={`₹${salesData.thisMonthSales.toLocaleString('en-IN')}`}
            icon={Calendar}
            color="gold"
            subtitle={currentMonthLabel}
          />
          <AdminStatCard
            title="Last Month Sales"
            value={`₹${salesData.lastMonthSales.toLocaleString('en-IN')}`}
            icon={Clock}
            color="blue"
            subtitle={lastMonthLabel}
          />
          <AdminStatCard
            title="Paid Orders"
            value={salesData.totalPaidOrders}
            icon={Receipt}
            color="amber"
            subtitle="Valid completed transactions"
            onClick={() => navigate('/admin/orders?paymentStatus=PAID')}
          />
        </div>
      )}

      {/* Monthly Sales Overview Chart Section */}
      <div className="bg-cream border border-beige/80 rounded-xl p-5 sm:p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-beige/60 pb-4">
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-charcoal flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest" />
              Monthly Sales Overview (Last 6 Months)
            </h2>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Visual breakdown of valid customer sales by calendar month.
            </p>
          </div>
          <div className="text-xs font-semibold text-charcoal/70 bg-white/70 px-3 py-1.5 rounded-lg border border-beige/60 self-start sm:self-auto">
            Currency: INR (₹)
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-end justify-between gap-4 p-4 bg-beige/10 rounded-xl animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-1 bg-beige/30 rounded-t-lg h-32" />
            ))}
          </div>
        ) : salesData.totalSales === 0 && salesData.monthlySales.every((m) => m.amount === 0) ? (
          <div className="py-12 px-4 text-center space-y-3 bg-white/50 rounded-xl border border-dashed border-beige">
            <div className="w-12 h-12 rounded-full bg-beige/30 text-forest mx-auto flex items-center justify-center">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-charcoal">
              No sales data available yet.
            </h3>
            <p className="text-xs text-charcoal/60 max-w-md mx-auto">
              Sales amounts will automatically populate in this chart as soon as customers complete and pay for their orders.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-4 md:gap-6 pt-8 pb-2 px-2 sm:px-4 bg-white/60 rounded-xl border border-beige/40">
              {salesData.monthlySales.map((month) => {
                const heightPercent = maxMonthlyAmount > 0
                  ? Math.max(4, Math.round((month.amount / maxMonthlyAmount) * 100))
                  : 4;

                const isCurrentMonth = month.key === salesData.monthlySales[salesData.monthlySales.length - 1]?.key;

                return (
                  <div
                    key={month.key}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  >
                    {/* Tooltip Value On Top */}
                    <div className="text-[10px] sm:text-xs font-bold text-forest mb-1.5 transition-transform group-hover:scale-110 whitespace-nowrap">
                      ₹{month.amount.toLocaleString('en-IN')}
                    </div>

                    {/* Bar Pillar */}
                    <div className="w-full max-w-[48px] bg-beige/20 rounded-t-lg flex items-end overflow-hidden h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-90 ${
                          isCurrentMonth
                            ? 'bg-gradient-to-t from-gold to-gold-light shadow-xs'
                            : 'bg-gradient-to-t from-forest to-forest-light'
                        }`}
                        title={`${month.fullLabel}: ₹${month.amount.toLocaleString('en-IN')} (${month.orderCount} orders)`}
                      />
                    </div>

                    {/* Bottom Month Label */}
                    <div className="mt-2 text-center">
                      <span className={`text-[10px] sm:text-xs font-bold block ${isCurrentMonth ? 'text-forest' : 'text-charcoal/70'}`}>
                        {month.label}
                      </span>
                      <span className="text-[9px] text-charcoal/40 hidden sm:block">
                        {month.key.slice(0, 4)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Month-Wise Sales Breakdown Table */}
      <div className="bg-cream border border-beige/80 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-beige/60">
          <div>
            <h2 className="text-base md:text-lg font-serif font-bold text-charcoal">
              Month-Wise Sales Amount
            </h2>
            <p className="text-xs text-charcoal/60">
              Detailed breakdown of revenue and completed order counts.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-beige/60 text-charcoal/60 uppercase tracking-wider text-[10px] font-semibold bg-beige/20">
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Paid Orders</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Sales Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/40">
              {salesData.monthlySales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-charcoal/50 italic">
                    No monthly sales recorded yet.
                  </td>
                </tr>
              ) : (
                [...salesData.monthlySales].reverse().map((m) => (
                  <tr key={m.key} className="hover:bg-white/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-charcoal">
                      {m.fullLabel}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/80">
                      {m.orderCount} {m.orderCount === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3.5 px-4">
                      {m.amount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-successgreen/20 text-successgreen-text border border-successgreen-text/20">
                          Active Sales
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-beige/30 text-charcoal/50">
                          No Sales
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-forest text-sm">
                      ₹{m.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
