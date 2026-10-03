'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  Store,
  Shield,
  Briefcase,
  Truck,
  X,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface AuthModalProps {
  setActiveTab: (tab: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ setActiveTab }) => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    switchRole,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [registerRole, setRegisterRole] = useState<'customer' | 'vendor'>('customer');
  const [storeName, setStoreName] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      // Redirect based on role if needed
      setActiveTab('account');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Name, email, and password are required', 'warning');
      return;
    }
    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      phone,
      role: registerRole,
      storeName: registerRole === 'vendor' ? storeName : undefined,
      businessDescription: registerRole === 'vendor' ? storeDesc : undefined,
      address,
    });
    setLoading(false);
    if (res.success) {
      if (registerRole === 'vendor') {
        setActiveTab('vendor');
      } else {
        setActiveTab('account');
      }
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    await switchRole(role);
    setLoading(false);
    setShowAuthModal(false);
    if (role === 'super_admin' || role === 'staff') {
      setActiveTab('admin');
    } else if (role === 'vendor') {
      setActiveTab('vendor');
    } else if (role === 'driver') {
      setActiveTab('driver');
    } else {
      setActiveTab('account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl my-8">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white">
            {authModalMode === 'login'
              ? 'Sign In to Your Account'
              : authModalMode === 'register'
              ? 'Join TAN TECH SUPPORT'
              : 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access digital services, marketplace orders, and vehicle mobility.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Section */}
        <div className="mb-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 1-Click Instant Demo Login:
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('super_admin')}
              className="px-2 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800 text-[11px] font-bold text-purple-300 transition-colors flex items-center gap-1 truncate"
            >
              <Shield className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              className="px-2 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800 text-[11px] font-bold text-blue-300 transition-colors flex items-center gap-1 truncate"
            >
              <Briefcase className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">Staff</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('vendor')}
              className="px-2 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800 text-[11px] font-bold text-amber-300 transition-colors flex items-center gap-1 truncate"
            >
              <Store className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Vendor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('driver')}
              className="px-2 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 text-[11px] font-bold text-emerald-300 transition-colors flex items-center gap-1 truncate"
            >
              <Truck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">Driver</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="col-span-2 sm:col-span-2 px-2 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800 text-[11px] font-bold text-cyan-300 transition-colors flex items-center justify-center gap-1"
            >
              <UserIcon className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>Customer (Anisur)</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-bold">
            Or Use Credentials
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* LOGIN FORM */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tantech.com or user@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('forgot')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Don&apos;t have an account? </span>
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-xs font-bold text-cyan-400 hover:underline"
              >
                Register Now
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole('customer')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    registerRole === 'customer'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Customer Account
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('vendor')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    registerRole === 'vendor'
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Vendor Store
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Hossain"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1812-000000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Vendor specific fields */}
            {registerRole === 'vendor' && (
              <div className="space-y-2 p-3 rounded-xl bg-amber-950/20 border border-amber-900/30">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">Store / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Modern Tech & Print Hub"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">Business Description</label>
                  <input
                    type="text"
                    value={storeDesc}
                    onChange={(e) => setStoreDesc(e.target.value)}
                    placeholder="Types of products or printing hardware you supply"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-400">Already registered? </span>
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-xs font-bold text-cyan-400 hover:underline"
              >
                Sign In Instead
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {authModalMode === 'forgot' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your registered email address and our automated recovery system will send you password reset instructions.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@tantech.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                showToast('Password reset link sent to your email!', 'success');
                setAuthModalMode('login');
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md"
            >
              Send Reset Link
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
