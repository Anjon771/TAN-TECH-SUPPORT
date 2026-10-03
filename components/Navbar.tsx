'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Phone,
  Mail,
  ShoppingBag,
  Bell,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Shield,
  Briefcase,
  Store,
  Truck,
  Layers,
  Search,
  ExternalLink,
  Car,
  Printer,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    user,
    switchRole,
    cartCount,
    setShowCartDrawer,
    setShowAuthModal,
    setAuthModalMode,
    notifications,
    unreadNotifsCount,
    markAllNotifsRead,
    settings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'shop', label: 'Shop' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'vehicles', label: 'Vehicle Booking' },
    { id: 'news', label: 'News & Media' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const roleConfigs: Record<UserRole, { label: string; icon: any; color: string; badge: string }> = {
    super_admin: { label: 'Super Admin', icon: Shield, color: 'text-purple-400 bg-purple-950/80 border-purple-500/40', badge: 'Admin Portal' },
    staff: { label: 'Staff Member', icon: Briefcase, color: 'text-blue-400 bg-blue-950/80 border-blue-500/40', badge: 'Ops Panel' },
    vendor: { label: 'Vendor Partner', icon: Store, color: 'text-amber-400 bg-amber-950/80 border-amber-500/40', badge: 'Vendor Hub' },
    driver: { label: 'Delivery Driver', icon: Truck, color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40', badge: 'Driver App' },
    customer: { label: 'Customer', icon: UserIcon, color: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40', badge: 'Customer' },
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleSelect = async (role: UserRole) => {
    setRoleDropdownOpen(false);
    await switchRole(role);
    // If switching to admin, vendor, or driver, take them to dashboard
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

  const handleAccountClick = () => {
    if (!user) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    // Route to appropriate dashboard depending on current role
    if (user.role === 'super_admin' || user.role === 'staff') {
      setActiveTab('admin');
    } else if (user.role === 'vendor') {
      setActiveTab('vendor');
    } else if (user.role === 'driver') {
      setActiveTab('driver');
    } else {
      setActiveTab('account');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 transition-all">
      {/* Top emergency / announcement strip */}
      {settings?.announcementActive && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-950 text-slate-200 text-xs py-1.5 px-4 border-b border-blue-900/50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                NOTICE
              </span>
              <span className="truncate">{settings.announcementText}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300 shrink-0">
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{settings.contactPhone}</span>
              </a>
              <span className="text-slate-600 hidden md:inline">•</span>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="hidden md:flex items-center gap-1 hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{settings.contactEmail}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Tagline */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 border border-blue-400/30">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                TAN TECH <span className="text-cyan-400">SUPPORT</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                {settings?.tagline || 'Your Trusted Digital Partner'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-400 bg-blue-950/70 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Hub: Role Switcher, Cart, Notifications, Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
                  user ? roleConfigs[user.role].color : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
                title="Switch active user role for testing"
              >
                {user ? (
                  <>
                    {React.createElement(roleConfigs[user.role].icon, { className: 'w-3.5 h-3.5' })}
                    <span className="hidden sm:inline font-bold">{roleConfigs[user.role].badge}</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Role Switcher</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Role Dropdown */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role (1-Click Demo)
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Instantly test distinct role workflows:
                    </p>
                  </div>
                  <div className="space-y-1">
                    {(['customer', 'super_admin', 'staff', 'vendor', 'driver'] as UserRole[]).map((r) => {
                      const cfg = roleConfigs[r];
                      const Icon = cfg.icon;
                      const isCurrent = user?.role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => handleRoleSelect(r)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isCurrent
                              ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/40'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-cyan-400" />
                            <div className="text-left">
                              <p className="font-semibold">{cfg.label}</p>
                              <p className="text-[10px] text-slate-400">{cfg.badge}</p>
                            </div>
                          </div>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase text-slate-300">Notifications</span>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={markAllNotifsRead}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="mt-2 max-h-64 overflow-y-auto space-y-2 divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="pt-2 first:pt-0">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Dashboard CTA Button */}
            <button
              onClick={handleAccountClick}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:shadow-cyan-500/25 active:scale-95"
            >
              <UserIcon className="w-4 h-4" />
              <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-slate-800">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-blue-900/60 text-cyan-300 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                handleAccountClick();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm shadow-md"
            >
              <UserIcon className="w-4 h-4" />
              <span>{user ? `Go to ${roleConfigs[user.role].badge}` : 'Sign In / Register'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
