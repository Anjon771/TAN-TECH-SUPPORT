'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Layers,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  ShoppingBag,
  Truck,
  Car,
  Shield,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { settings, switchRole } = useApp();

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleQuickLink = async (role: UserRole, targetTab: string) => {
    await switchRole(role);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-blue-400/30">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block">
                  TAN TECH <span className="text-cyan-400">SUPPORT</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {settings?.tagline || 'Your Trusted Digital Partner'}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs pr-4">
              A comprehensive multi-service digital ecosystem uniting high-precision printing, graphic design, video editing, certified computer education, multi-vendor marketplace, citywide parcel delivery, and instant vehicle mobility.
            </p>

            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{settings?.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${settings?.contactPhone}`} className="text-slate-300 hover:text-white">
                  {settings?.contactPhone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`mailto:${settings?.contactEmail}`} className="text-slate-300 hover:text-white">
                  {settings?.contactEmail}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{settings?.operatingHours}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Digital Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Digital Services
            </h4>
            <ul className="space-y-2">
              {[
                'Visiting Cards Printing',
                'Business Collaterals',
                'Vinyl Banners & Posters',
                'Logo & Brand Identity',
                'Social Media Graphics',
                '4K YouTube Video Editing',
                'Viral Shorts & Reels',
                'MS Office Specialist',
                'Computer Fundamentals',
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNav('services')}
                    className="hover:text-cyan-300 transition-colors text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Delivery & Vehicles */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Logistics & Mobility
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNav('delivery')} className="hover:text-cyan-300 transition-colors">
                  Product Pickup & Drop
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('delivery')} className="hover:text-cyan-300 transition-colors">
                  Live Parcel GPS Tracking
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('delivery')} className="hover:text-cyan-300 transition-colors">
                  Express Document Courier
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vehicles')} className="hover:text-cyan-300 transition-colors">
                  AC Sedan Car Booking
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vehicles')} className="hover:text-cyan-300 transition-colors">
                  HiAce Executive Microbus (Van)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vehicles')} className="hover:text-cyan-300 transition-colors">
                  CNG Auto-Rickshaw Ride
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-cyan-300 transition-colors">
                  Online Hardware Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Role Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleRoleQuickLink('super_admin', 'admin')}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1 font-semibold text-purple-400"
                >
                  <Shield className="w-3 h-3" />
                  <span>Super Admin Console</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRoleQuickLink('staff', 'admin')}
                  className="hover:text-blue-300 transition-colors flex items-center gap-1 font-semibold text-blue-400"
                >
                  <span>Operations Staff Panel</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRoleQuickLink('vendor', 'vendor')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold text-amber-400"
                >
                  <span>Vendor Store Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRoleQuickLink('driver', 'driver')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold text-emerald-400"
                >
                  <span>Driver & Courier Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRoleQuickLink('customer', 'account')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1 font-semibold text-cyan-400"
                >
                  <span>Customer Dashboard</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('news')} className="hover:text-cyan-300 transition-colors">
                  News & YouTube Tutorials
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-cyan-300 transition-colors">
                  Help & Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} TAN TECH SUPPORT. All Rights Reserved. Your Trusted Digital Partner.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('about')} className="hover:text-slate-300">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => handleNav('about')} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => handleNav('contact')} className="hover:text-slate-300">
              Customer Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
