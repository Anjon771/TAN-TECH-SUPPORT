'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Printer,
  ShoppingBag,
  Truck,
  Car,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Advertisement } from '@/lib/types';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab }) => {
  const { setTrackingQuery, settings, showToast } = useApp();
  const [trackInput, setTrackInput] = useState('');
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentAdIdx, setCurrentAdIdx] = useState(0);

  // Fetch active hero advertisements
  useEffect(() => {
    fetch('/api/advertisements?placement=hero')
      .then((res) => res.json())
      .then((data) => {
        if (data.advertisements && data.advertisements.length > 0) {
          setAds(data.advertisements);
        }
      })
      .catch(() => {});
  }, []);

  // Cycle ad banners
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIdx((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) {
      showToast('Please enter a tracking number', 'warning');
      return;
    }
    setTrackingQuery(trackInput.trim().toUpperCase());
    setActiveTab('delivery');
  };

  const servicePillars = [
    {
      id: 'services',
      title: 'Digital Services',
      tag: 'Print & Creative',
      description: 'Visiting cards, banners, logo design, video editing, & certified computer training.',
      icon: Printer,
      color: 'from-blue-600 to-cyan-600',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      badge: 'Popular',
    },
    {
      id: 'shop',
      title: 'Online Marketplace',
      tag: 'Tech & Consumables',
      description: 'Computer hardware, printing paper, genuine ink, webcams & digital accessories.',
      icon: ShoppingBag,
      color: 'from-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badge: 'Verified Vendors',
    },
    {
      id: 'delivery',
      title: 'Express Delivery',
      tag: 'Pickup & Drop',
      description: 'Point-to-point courier, parcel dispatch, and real-time live GPS order tracking.',
      icon: Truck,
      color: 'from-amber-600 to-orange-600',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badge: 'Fast Dispatch',
    },
    {
      id: 'vehicles',
      title: 'Vehicle Booking',
      tag: 'Car • Van • CNG',
      description: 'Instant city and highway transport booking with trusted drivers and upfront fares.',
      icon: Car,
      color: 'from-purple-600 to-indigo-600',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      badge: 'Fixed Fares',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800">
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm shadow-cyan-500/10 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{settings?.tagline || 'Your Trusted Digital Partner'}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal">All-in-One Multi-Service Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Empowering Your Life & Business with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
              TAN TECH SUPPORT
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            One single, powerful ecosystem for professional printing, creative graphic design, certified computer education, multi-vendor shopping, express parcel delivery, and instant vehicle bookings.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('services')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Browse Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('vehicles')}
              className="px-6 py-3.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-white font-bold text-sm border border-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Car className="w-4 h-4 text-cyan-400" />
              <span>Book Car / CNG</span>
            </button>
          </div>

          {/* Live Tracking Input Box */}
          <div className="mt-10 max-w-xl mx-auto">
            <form
              onSubmit={handleTrackSubmit}
              className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/40 backdrop-blur-md"
            >
              <div className="pl-3 text-cyan-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Track parcel or ride (e.g. TTS-DEL-7841)"
                className="flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Track Now
              </button>
            </form>
            <div className="flex items-center justify-center gap-3 mt-2.5 text-[11px] text-slate-400">
              <span>Quick Demos:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingQuery('TTS-DEL-7841');
                  setActiveTab('delivery');
                }}
                className="text-cyan-400 hover:underline font-mono"
              >
                TTS-DEL-7841 (Parcel)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab('vehicles')}
                className="text-cyan-400 hover:underline font-mono"
              >
                TTS-VEH-4412 (CNG)
              </button>
            </div>
          </div>
        </div>

        {/* 4 Main Service Category Cards (From Client Reference) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {servicePillars.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className="group relative cursor-pointer rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${service.iconBg} transition-transform group-hover:scale-110 duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {service.badge}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    {service.tag}
                  </p>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Enter Section</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Promotional Advertisement Carousel Banner */}
        {ads.length > 0 && (
          <div className="mt-12 rounded-2xl overflow-hidden border border-blue-900/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 shadow-2xl relative">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 gap-6">
              <div className="space-y-3 max-w-xl text-left">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  {ads[currentAdIdx].badge || 'Special Promotion'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {ads[currentAdIdx].title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {ads[currentAdIdx].subtitle}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      // Trigger click count increment
                      fetch('/api/advertisements', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: ads[currentAdIdx].id, click: true }),
                      }).catch(() => {});
                      setActiveTab(ads[currentAdIdx].targetUrl.replace('/', '') || 'services');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>{ads[currentAdIdx].ctaText || 'Get Started'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {ads[currentAdIdx].bannerUrl && (
                <div className="w-full md:w-80 h-44 rounded-xl overflow-hidden shadow-lg border border-slate-700/60 shrink-0 relative">
                  <img
                    src={ads[currentAdIdx].bannerUrl}
                    alt={ads[currentAdIdx].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                </div>
              )}
            </div>

            {/* Carousel navigation indicators */}
            {ads.length > 1 && (
              <div className="absolute bottom-3 left-8 flex items-center gap-1.5">
                {ads.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentAdIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentAdIdx === i ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Platform Trust Highlights Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Govt. Standard Certified</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Recognized Computer Training</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col items-center">
            <Zap className="w-6 h-6 text-cyan-400 mb-2" />
            <h4 className="text-sm font-bold text-white">High-Speed Print & Delivery</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Same-Day / Next-Day Delivery</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col items-center">
            <Car className="w-6 h-6 text-indigo-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Verified Drivers & Vehicles</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">AC Cars, Vans & CNG Rickshaws</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col items-center">
            <Clock className="w-6 h-6 text-amber-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Dedicated Tech Hotline</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Saturday - Thursday Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};
