'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Car,
  Users,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User as UserIcon,
  CheckCircle2,
  Navigation,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  Copy,
  AlertCircle,
  CarFront,
} from 'lucide-react';
import { VehicleType, TripType, VehicleBooking, BookingStatus } from '@/lib/types';

export const VehicleBookingSection: React.FC = () => {
  const { user, showToast } = useApp();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('cng');
  const [tripType, setTripType] = useState<TripType>('one_way');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [passengers, setPassengers] = useState(2);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeBooking, setActiveBooking] = useState<VehicleBooking | null>(null);
  const [recentBookings, setRecentBookings] = useState<VehicleBooking[]>([]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
      if (!customerEmail && user.email) setCustomerEmail(user.email);
    }
  }, [user]);

  // Fetch recent bookings for display/tracking
  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setRecentBookings(data.bookings.slice(0, 4));
        if (!activeBooking && data.bookings.length > 0) {
          setActiveBooking(data.bookings[0]);
        }
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const vehicles = [
    {
      id: 'cng' as VehicleType,
      name: 'CNG Auto Rickshaw',
      badge: 'Quick & Economical',
      seats: 'Up to 3 Passengers',
      luggage: '1-2 Small Bags',
      rateInfo: 'Base: ৳150 • ৳25/km',
      baseFare: 150,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      description: 'Ideal for rapid urban navigation, avoiding heavy traffic, and daily short-distance transit.',
    },
    {
      id: 'car' as VehicleType,
      name: 'Air-Conditioned Sedan (Car)',
      badge: 'Comfort & Business',
      seats: 'Up to 4 Passengers',
      luggage: '3 Large Bags in Boot',
      rateInfo: 'Base: ৳450 • ৳55/km',
      baseFare: 450,
      image: '/assets/images/modern_sedan_car_1791020839144.jpg',
      description: 'Chauffeured Toyota Corolla / Axio with dual cooling AC. Ideal for airport runs, family trips, & VIP transport.',
    },
    {
      id: 'van' as VehicleType,
      name: 'HiAce Executive Microbus (Van)',
      badge: 'Group & Corporate',
      seats: '7 to 11 Passengers',
      luggage: 'Massive Cargo Capacity',
      rateInfo: 'Base: ৳950 • ৳90/km',
      baseFare: 950,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
      description: 'High-roof Toyota HiAce Super GL. Perfect for wedding convoys, company team tours, & group travel.',
    },
  ];

  const popularHubs = [
    'GEC Circle, Chittagong',
    'Agrabad Commercial Area',
    'Shah Amanat Int. Airport (CGP)',
    'Nasirabad Housing Gate 2',
    'Chittagong Railway Station',
    'Halishahar Housing Estate',
    'Bahaddarhat Central Terminal',
  ];

  // Estimated fare logic
  const currentVehicleObj = vehicles.find((v) => v.id === selectedVehicle) || vehicles[0];
  const multiplier = tripType === 'round_trip' ? 1.8 : tripType === 'hourly' ? 2.5 : 1.0;
  const estimatedFare = Math.round(currentVehicleObj.baseFare * multiplier);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !pickupLocation || !dropLocation || !bookingDate || !bookingTime) {
      showToast('Please fill in pickup, drop, date, time, and your contact info', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerId: user?.id || 'guest',
        customerName,
        customerPhone,
        customerEmail,
        vehicleType: selectedVehicle,
        tripType,
        pickupLocation,
        dropLocation,
        bookingDate,
        bookingTime,
        passengers,
        instructions,
        estimatedFare,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setActiveBooking(data.booking);
        showToast(data.message, 'success');
        fetchBookings();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      } else {
        showToast(data.error || 'Failed to submit booking', 'error');
      }
    } catch (err) {
      showToast('Error booking vehicle', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const bookingStatusConfig: Record<BookingStatus, { label: string; color: string }> = {
    pending: { label: 'Pending Confirmation', color: 'bg-amber-950 text-amber-300 border-amber-800' },
    confirmed: { label: 'Booking Confirmed', color: 'bg-blue-950 text-blue-300 border-blue-800' },
    assigned: { label: 'Driver Assigned', color: 'bg-indigo-950 text-indigo-300 border-indigo-800' },
    driver_on_the_way: { label: 'Driver On The Way', color: 'bg-purple-950 text-purple-300 border-purple-800' },
    picked_up: { label: 'Passenger Picked Up', color: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
    in_progress: { label: 'Trip In Progress', color: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
    completed: { label: 'Trip Completed', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-950 text-rose-300 border-rose-800' },
  };

  return (
    <section className="py-16 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Car className="w-3.5 h-3.5" />
            <span>ON-DEMAND VEHICLE MOBILITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Book Car, Van or CNG in Minutes
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Punctual pickups, verified background-checked drivers, upfront guaranteed rates, and comfortable travel across Chittagong and nationwide highways.
          </p>
        </div>

        {/* 1. Vehicle Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {vehicles.map((v) => {
            const isSelected = selectedVehicle === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                className={`cursor-pointer rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-950/40 border-cyan-500 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-slate-950">
                    <img src={v.image} alt={v.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-950/80 backdrop-blur-sm text-cyan-300 border border-cyan-500/30">
                      {v.badge}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white">{v.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{v.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{v.seats}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{v.luggage}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{v.rateInfo}</span>
                  <span className="text-xs font-bold text-cyan-400">
                    {isSelected ? 'Selected' : 'Click to Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Interactive Booking Form & Live Ride Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form (Left 7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-1">Trip Details & Reservation</h3>
            <p className="text-xs text-slate-400 mb-6">
              Vehicle Selected: <strong className="text-cyan-400">{currentVehicleObj.name}</strong>
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Trip Type Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Trip Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'one_way' as TripType, label: 'One Way' },
                    { id: 'round_trip' as TripType, label: 'Round Trip' },
                    { id: 'hourly' as TripType, label: 'Hourly / Full Day' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTripType(t.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        tripType === t.id
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup & Drop */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pickup Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="e.g. Nasirabad Gate 2 / GEC Circle"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Drop-off Destination *
                  </label>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      placeholder="e.g. Shah Amanat Int. Airport (CGP)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Quick preset hubs chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                  <span>Popular:</span>
                  {popularHubs.slice(0, 4).map((hub, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (!pickupLocation) setPickupLocation(hub);
                        else setDropLocation(hub);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
                    >
                      {hub.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date, Time, Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Time *</label>
                  <input
                    type="text"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Passengers</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {[1, 2, 3, 4, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} Person{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Passenger Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Passenger Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 1812-000000"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Luggage & Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Need trunk space for 2 trolley bags, please keep AC on high."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Fare & Confirm Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400">Guaranteed Estimated Fare:</span>
                  <p className="text-3xl font-black text-cyan-400 font-mono">৳{estimatedFare}</p>
                  <span className="text-[10px] text-slate-500">No surge pricing guarantee</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Confirming Booking...</span>
                  ) : (
                    <>
                      <CarFront className="w-4 h-4" />
                      <span>Confirm & Book Ride</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Status Panel (5 Cols): Active Booking Status Card */}
          <div className="lg:col-span-5 space-y-6">
            {activeBooking ? (
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {activeBooking.bookingNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                      bookingStatusConfig[activeBooking.status]?.color || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {bookingStatusConfig[activeBooking.status]?.label || activeBooking.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white capitalize">
                      {activeBooking.vehicleType.toUpperCase()} Ride
                    </h4>
                    <p className="text-xs text-slate-400">
                      {activeBooking.tripType.replace('_', ' ').toUpperCase()} • {activeBooking.passengers} Passenger(s)
                    </p>
                  </div>
                </div>

                {/* Route Box */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Pickup:</span>
                      <p className="text-white font-medium">{activeBooking.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Destination:</span>
                      <p className="text-white font-medium">{activeBooking.dropLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span>Date: {activeBooking.bookingDate}</span>
                    <span>Time: {activeBooking.bookingTime}</span>
                  </div>
                </div>

                {/* Assigned Driver (if any) */}
                {activeBooking.assignedDriverName && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/30 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-cyan-400">Assigned Driver</p>
                      <p className="text-sm font-bold text-white">{activeBooking.assignedDriverName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Plate: {activeBooking.assignedVehiclePlate || 'Assigned'}
                      </p>
                    </div>
                    {activeBooking.assignedDriverPhone && (
                      <a
                        href={`tel:${activeBooking.assignedDriverPhone}`}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Fare Summary */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">Total Trip Fare:</span>
                  <span className="text-xl font-black text-white font-mono">
                    ৳{activeBooking.estimatedFare}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center">
                <Car className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Active Ride Selected</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Complete the reservation form on the left to immediately lock in your vehicle and driver.
                </p>
              </div>
            )}

            {/* List of Recent Bookings for Quick Reference */}
            {recentBookings.length > 0 && (
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Recent Platform Bookings
                </h4>
                <div className="space-y-2">
                  {recentBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setActiveBooking(b)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                        activeBooking?.id === b.id
                          ? 'bg-blue-900/40 border-cyan-500/50 text-white'
                          : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-cyan-400">{b.bookingNumber}</span>
                        <p className="truncate max-w-[180px] text-[11px] text-slate-400">
                          {b.pickupLocation.split(',')[0]} → {b.dropLocation.split(',')[0]}
                        </p>
                      </div>
                      <span className="font-mono font-bold">৳{b.estimatedFare}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
