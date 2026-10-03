'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { DigitalServicesSection } from '@/components/DigitalServicesSection';
import { MarketplaceSection } from '@/components/MarketplaceSection';
import { DeliverySection } from '@/components/DeliverySection';
import { VehicleBookingSection } from '@/components/VehicleBookingSection';
import { NewsYouTubeSection } from '@/components/NewsYouTubeSection';
import { CustomerDashboard } from '@/components/CustomerDashboard';
import { VendorDashboard } from '@/components/VendorDashboard';
import { DriverDashboard } from '@/components/DriverDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AboutContactSection } from '@/components/AboutContactSection';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AuthModal } from '@/components/AuthModal';
import { ToastContainer } from '@/components/ToastContainer';
import { Footer } from '@/components/Footer';
import {
  Printer,
  ShoppingBag,
  Truck,
  Car,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Sticky Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection setActiveTab={setActiveTab} />

            {/* Quick Multi-Service Feature Showcase */}
            <div className="py-16 bg-slate-950 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Integrated Digital Powerhouse</span>
                  </div>
                  <h2 className="text-3xl font-black text-white">
                    Explore Our Core Ecosystem
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400">
                    Switch between modules seamlessly or manage your business operations directly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Print & Design */}
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-4">
                        <Printer className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Digital Services</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Visiting cards, posters, vinyl banners, logos, video editing, & certified computer classes.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('services')}
                      className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400 hover:text-cyan-300"
                    >
                      <span>Explore Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2: Marketplace */}
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Online Marketplace</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Genuine IT hardware, keyboards, A4 paper reams, Epson inks, & office stationery.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Shop Marketplace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 3: Express Delivery */}
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4">
                        <Truck className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Express Delivery</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Pickup & Drop courier service with unique tracking numbers and live timeline GPS updates.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('delivery')}
                      className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300"
                    >
                      <span>Track & Send Parcel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 4: Vehicle Booking */}
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                        <Car className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Vehicle Booking</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Book AC Sedan Cars, HiAce Microbus Vans, or CNG auto-rickshaws with guaranteed rates.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('vehicles')}
                      className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400 hover:text-purple-300"
                    >
                      <span>Book a Ride</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Embed News & YouTube on Homepage */}
            <NewsYouTubeSection />
          </div>
        )}

        {/* Dedicated Service Modules */}
        {activeTab === 'services' && <DigitalServicesSection />}
        {activeTab === 'shop' && <MarketplaceSection />}
        {activeTab === 'delivery' && <DeliverySection />}
        {activeTab === 'vehicles' && <VehicleBookingSection />}
        {activeTab === 'news' && <NewsYouTubeSection />}
        {activeTab === 'about' && <AboutContactSection />}
        {activeTab === 'contact' && <AboutContactSection />}

        {/* Dedicated Role Dashboards */}
        {activeTab === 'account' && <CustomerDashboard setActiveTab={setActiveTab} />}
        {activeTab === 'vendor' && <VendorDashboard />}
        {activeTab === 'driver' && <DriverDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal setActiveTab={setActiveTab} />
      <AuthModal setActiveTab={setActiveTab} />
      <ToastContainer />

      {/* Site Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
