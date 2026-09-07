import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSales from '../admin/pages/AdminSales';
import AdminDashboard from '../admin/pages/AdminDashboard';
import AdminLayout from '../admin/layouts/AdminLayout';
import * as adminApi from '../admin/services/adminApi';
import { ToastProvider } from '../context/ToastContext';

vi.mock('../admin/services/adminApi', () => ({
  getSalesAnalyticsApi: vi.fn(),
  getDashboardStatsApi: vi.fn(),
}));

const renderWithProviders = (ui) => {
  return render(
    <ToastProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ToastProvider>
  );
};

describe('Admin Sales & Dashboard Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders AdminLayout sidebar with Sales navigation link', () => {
    renderWithProviders(
      <AdminLayout>
        <div>Child Content</div>
      </AdminLayout>
    );

    const salesLinks = screen.getAllByRole('link', { name: /sales/i });
    expect(salesLinks.length).toBeGreaterThan(0);
    expect(salesLinks[0].getAttribute('href')).toBe('/admin/sales');
  });

  it('renders AdminSales with real sales data correctly', async () => {
    adminApi.getSalesAnalyticsApi.mockResolvedValue({
      totalSales: 85400,
      thisMonthSales: 35200,
      lastMonthSales: 28000,
      paidOrdersCount: 42,
      currency: 'INR',
      monthlySales: [
        { monthKey: '2026-04', label: 'Apr 2026', totalSales: 0, orderCount: 0 },
        { monthKey: '2026-05', label: 'May 2026', totalSales: 0, orderCount: 0 },
        { monthKey: '2026-06', label: 'Jun 2026', totalSales: 22200, orderCount: 11 },
        { monthKey: '2026-07', label: 'Jul 2026', totalSales: 28000, orderCount: 14 },
        { monthKey: '2026-08', label: 'Aug 2026', totalSales: 35200, orderCount: 17 },
        { monthKey: '2026-09', label: 'Sep 2026', totalSales: 0, orderCount: 0 },
      ]
    });

    renderWithProviders(<AdminSales />);

    // Initial loading or heading
    expect(screen.getByRole('heading', { name: /sales overview/i, level: 1 })).toBeDefined();

    await waitFor(() => {
      // Metric cards
      expect(screen.getByText('₹85,400')).toBeDefined();
      expect(screen.getAllByText('₹35,200').length).toBeGreaterThan(0);
      expect(screen.getByText(/42 paid order\(s\)/i)).toBeDefined();
      // Month-wise breakdown table headers & rows
      expect(screen.getAllByText(/Jun 2026/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Jul 2026/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Aug 2026/i).length).toBeGreaterThan(0);
    });
  });

  it('renders proper empty state when there are no sales yet', async () => {
    adminApi.getSalesAnalyticsApi.mockResolvedValue({
      totalSales: 0,
      thisMonthSales: 0,
      lastMonthSales: 0,
      paidOrdersCount: 0,
      currency: 'INR',
      monthlySales: [
        { monthKey: '2026-04', label: 'Apr 2026', totalSales: 0, orderCount: 0 },
        { monthKey: '2026-05', label: 'May 2026', totalSales: 0, orderCount: 0 },
        { monthKey: '2026-06', label: 'Jun 2026', totalSales: 0, orderCount: 0 },
        { monthKey: '2026-07', label: 'Jul 2026', totalSales: 0, orderCount: 0 },
        { monthKey: '2026-08', label: 'Aug 2026', totalSales: 0, orderCount: 0 },
        { monthKey: '2026-09', label: 'Sep 2026', totalSales: 0, orderCount: 0 },
      ]
    });

    renderWithProviders(<AdminSales />);

    await waitFor(() => {
      expect(screen.getByText(/No sales data available yet/i)).toBeDefined();
      expect(screen.getAllByText('₹0').length).toBeGreaterThan(0);
    });
  });

  it('renders Monthly Sales card on AdminDashboard with real data and links to /admin/sales', async () => {
    adminApi.getDashboardStatsApi.mockResolvedValue({
      totalProducts: 12,
      totalOrders: 25,
      totalCategories: 4,
      newOrders: 3,
      thisMonthSales: 42850,
      recentOrders: []
    });

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Monthly Sales/i)).toBeDefined();
      expect(screen.getByText('₹42,850')).toBeDefined();
    });

    const monthlySalesCard = screen.getByText(/Monthly Sales/i);
    expect(monthlySalesCard).toBeDefined();
  });
});
