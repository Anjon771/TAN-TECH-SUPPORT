'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Truck,
  Car,
  Phone,
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  User as UserIcon,
  ShieldCheck,
  Package,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { DeliveryRequest, VehicleBooking, Driver, DeliveryStatus, BookingStatus } from '@/lib/types';

export const DriverDashboard: React.FC = () => {
  const { user, showToast } = useApp();
  const [driverProfile, setDriverProfile] = useState<Driver | null>(null);
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [rides, setRides] = useState<VehicleBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDriverData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const driverId = user.driverId || 'drv-1';
      const [drvRes, delRes, rideRes] = await Promise.all([
        fetch('/api/drivers').then((r) => r.json()),
        fetch(`/api/deliveries?driverId=${driverId}`).then((r) => r.json()),
        fetch(`/api/bookings?driverId=${driverId}`).then((r) => r.json()),
      ]);

      if (drvRes.drivers) {
        const found = drvRes.drivers.find((d: Driver) => d.id === driverId) || drvRes.drivers[0];
        setDriverProfile(found);
      }
      if (delRes.deliveries) setDeliveries(delRes.deliveries);
      if (rideRes.bookings) setRides(rideRes.bookings);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, [user]);

  // Update status for delivery parcel
  const handleUpdateDeliveryStatus = async (deliveryId: string, newStatus: DeliveryStatus) => {
    try {
      const res = await fetch('/api/deliveries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deliveryId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Shipment status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
        setDeliveries((prev) =>
          prev.map((d) => (d.id === deliveryId ? { ...d, status: newStatus } : d))
        );
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (_) {
      showToast('Network error updating status', 'error');
    }
  };

  // Update status for vehicle booking ride
  const handleUpdateRideStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Ride status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
        setRides((prev) =>
          prev.map((r) => (r.id === bookingId ? { ...r, status: newStatus } : r))
        );
      } else {
        showToast(data.error || 'Failed to update ride status', 'error');
      }
    } catch (_) {
      showToast('Network error updating ride', 'error');
    }
  };

  // Toggle driver availability status
  const handleToggleStatus = async (newStatus: 'available' | 'on_trip' | 'offline') => {
    if (!driverProfile) return;
    try {
      const res = await fetch('/api/drivers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: driverProfile.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDriverProfile((prev) => (prev ? { ...prev, status: newStatus } : null));
        showToast(`Status changed to ${newStatus.toUpperCase()}`, 'info');
      }
    } catch (_) {
      showToast('Failed to update driver status', 'error');
    }
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Driver Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                  Driver / Courier Hub
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Plate: {driverProfile?.licensePlate || 'CTG METRO'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {driverProfile?.name || user?.name}
              </h2>
              <p className="text-xs text-slate-400">
                Vehicle: {driverProfile?.vehicleModel} ({driverProfile?.vehicleType.toUpperCase()}) • {driverProfile?.totalTrips} Completed Trips
              </p>
            </div>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {(['available', 'on_trip', 'offline'] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleToggleStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  driverProfile?.status === s
                    ? s === 'available'
                      ? 'bg-emerald-600 text-white shadow'
                      : s === 'on_trip'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 2 Main Columns: Assigned Deliveries & Assigned Rides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Assigned Deliveries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <span>Assigned Deliveries ({deliveries.length})</span>
              </h3>
            </div>

            {deliveries.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                No active delivery parcels assigned to you at the moment.
              </div>
            ) : (
              deliveries.map((del) => (
                <div key={del.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-cyan-400">{del.trackingNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 capitalize">
                      {del.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white">{del.packageType} ({del.packageWeight})</p>

                  <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Pickup:</span>
                        <p>{del.pickupAddress}</p>
                        <p className="text-[11px] text-slate-400">Contact: {del.senderName} ({del.senderPhone})</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-slate-800/60">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Delivery Drop:</span>
                        <p>{del.deliveryAddress}</p>
                        <p className="text-[11px] text-slate-400">Contact: {del.receiverName} ({del.receiverPhone})</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                    {del.status === 'requested' && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(del.id, 'accepted')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                      >
                        Accept Order
                      </button>
                    )}
                    {del.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(del.id, 'pickup_assigned')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                      >
                        En Route to Pickup
                      </button>
                    )}
                    {del.status === 'pickup_assigned' && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(del.id, 'picked_up')}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                      >
                        Confirm Picked Up
                      </button>
                    )}
                    {del.status === 'picked_up' && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(del.id, 'in_transit')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                      >
                        Start Delivery Transit
                      </button>
                    )}
                    {del.status === 'in_transit' && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(del.id, 'delivered')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      >
                        Mark Successfully Delivered
                      </button>
                    )}
                    {del.status === 'delivered' && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Delivered & Signed
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Column 2: Assigned Vehicle Rides */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-purple-400" />
                <span>Assigned Vehicle Rides ({rides.length})</span>
              </h3>
            </div>

            {rides.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                No active passenger bookings assigned right now.
              </div>
            ) : (
              rides.map((ride) => (
                <div key={ride.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-cyan-400">{ride.bookingNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 capitalize">
                      {ride.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white capitalize">{ride.vehicleType.toUpperCase()} Ride</h4>
                      <p className="text-xs text-slate-400">Passenger: {ride.customerName} ({ride.customerPhone})</p>
                    </div>
                    <span className="text-base font-black text-white font-mono">৳{ride.estimatedFare}</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Pickup:</span>
                      <p>{ride.pickupLocation}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Destination:</span>
                      <p>{ride.dropLocation}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Date: {ride.bookingDate}</span>
                      <span>Time: {ride.bookingTime}</span>
                    </div>
                  </div>

                  {/* Status update buttons for ride */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                    {ride.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateRideStatus(ride.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                      >
                        Accept Ride
                      </button>
                    )}
                    {ride.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateRideStatus(ride.id, 'driver_on_the_way')}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                      >
                        On The Way to Pickup
                      </button>
                    )}
                    {ride.status === 'driver_on_the_way' && (
                      <button
                        onClick={() => handleUpdateRideStatus(ride.id, 'picked_up')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                      >
                        Passenger Picked Up
                      </button>
                    )}
                    {ride.status === 'picked_up' && (
                      <button
                        onClick={() => handleUpdateRideStatus(ride.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      >
                        Complete Trip
                      </button>
                    )}
                    {ride.status === 'completed' && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Trip Completed
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
