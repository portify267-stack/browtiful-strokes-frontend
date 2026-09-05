import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Sparkles, ArrowRight, KeyRound } from 'lucide-react';
import { adminLoginApi } from '../services/adminApi';
import { setAdminSession, isAdminAuthenticated } from '../utils/adminAuth';
import { useToast } from '../../context/ToastContext';
import { CONTACT_INFO } from '../../config/constants';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await adminLoginApi(email.trim(), password);
      
      const token = data?.token;
      const admin = data?.admin;

      if (!token) {
        throw new Error('No authentication token received from backend.');
      }

      setAdminSession(token, admin);
      showToast(`Welcome back, ${admin?.name || 'Admin'}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-forest/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-cream border border-beige rounded-2xl shadow-xl p-8 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest/10 text-forest mb-4 border border-forest/20 shadow-xs">
            <Sparkles className="w-8 h-8 text-forest" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">
            Admin Portal
          </h1>
          <p className="text-xs text-charcoal/70 mt-1 font-sans">
            {CONTACT_INFO.brandName} Control Center
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-errorred border border-errorred-text/20 text-errorred-text text-xs font-semibold leading-relaxed animate-fade-in flex items-start gap-2">
            <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="browtifulstrokes@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-sm text-charcoal placeholder-charcoal/40 transition-colors shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-cream border border-beige focus:border-gold rounded-xl text-sm text-charcoal placeholder-charcoal/40 transition-colors shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-forest hover:bg-forest-dark text-cream font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] text-charcoal/50">
          <a href="/" className="hover:underline hover:text-forest transition-colors">
            ← Back to Customer Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
