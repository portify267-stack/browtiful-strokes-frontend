import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { clearAdminSession, getAdminUser } from '../utils/adminAuth';
import { useToast } from '../../context/ToastContext';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const adminUser = getAdminUser();

  const handleLogout = () => {
    clearAdminSession();
    showToast('Logged out successfully', 'success');
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal text-cream flex flex-col transition-transform duration-300 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } border-r border-charcoal/20 shadow-xl`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-cream tracking-wide">
                Browtiful Admin
              </h1>
              <p className="text-[10px] text-cream/60 tracking-wider uppercase">Management Panel</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-cream/70 hover:text-cream p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gold text-charcoal shadow-md font-bold'
                      : 'text-cream/80 hover:bg-white/10 hover:text-cream'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-charcoal/80">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center font-bold text-xs shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-xs font-semibold text-cream truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-cream/60 truncate">
                {adminUser?.email || 'browtifulstrokes@gmail.com'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:text-red-100 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-cream border-b border-beige/60 py-3.5 px-4 md:px-8 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-beige/40 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <span className="text-xs text-charcoal/60 hidden sm:inline">Store Portal / </span>
              <span className="text-xs font-semibold text-forest">Admin Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-forest hover:text-forest-dark bg-beige/40 hover:bg-beige px-3 py-1.5 rounded-lg border border-beige/80 transition-colors flex items-center gap-1.5"
            >
              <span>View Customer Website</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-cream">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
