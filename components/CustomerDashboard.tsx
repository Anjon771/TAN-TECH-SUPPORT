'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User as UserIcon,
  ShoppingBag,
  Truck,
  Car,
  FileText,
  Key,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Printer,
  Sparkles,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Order, ServiceRequest, DeliveryRequest, VehicleBooking } from '@/lib/types';

interface CustomerDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ setActiveTab }) => {
  const { user, logout, showToast, setTrackingQuery } = useApp();
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'orders' | 'services' | 'deliveries' | 'rides' | 'profile'>('overview');

  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile edit states
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEditName(user.name);
    setEditPhone(user.phone || '');
    setEditAddress(user.address || '');

    const fetchAllCustomerData = async () => {
      setLoading(true);
      try {
        const [ordersRes, srvRes, delRes, vehRes] = await Promise.all([
          fetch(`/api/orders?customerId=${user.id}`).then((r) => r.json()),
          fetch(`/api/service-requests?customerId=${user.id}`).then((r) => r.json()),
          fetch(`/api/deliveries?customerId=${user.id}`).then((r) => r.json()),
          fetch(`/api/bookings?customerId=${user.id}`).then((r) => r.json()),
        ]);

        if (ordersRes.orders) setOrders(ordersRes.orders);
        if (srvRes.requests) setServiceRequests(srvRes.requests);
        if (delRes.deliveries) setDeliveries(delRes.deliveries);
        if (vehRes.bookings) setBookings(vehRes.bookings);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };

    fetchAllCustomerData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          userId: user.id,
          name: editName,
          phone: editPhone,
          address: editAddress,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Profile details updated successfully', 'success');
      } else {
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (_) {
      showToast('Network error updating profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingPassword(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          userId: user.id,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        showToast(data.error || 'Failed to change password', 'error');
      }
    } catch (_) {
      showToast('Network error updating password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Please log in to access your customer dashboard.</p>
        <button
          onClick={() => setActiveTab('home')}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Welcome Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                Customer Account
              </span>
              <h2 className="text-2xl font-black text-white mt-1">{user.name}</h2>
              <p className="text-xs text-slate-400">{user.email} • {user.phone || 'No phone set'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-slate-800 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles },
            { id: 'orders', label: `My Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'services', label: `Service Requests (${serviceRequests.length})`, icon: Printer },
            { id: 'deliveries', label: `Deliveries (${deliveries.length})`, icon: Truck },
            { id: 'rides', label: `Vehicle Rides (${bookings.length})`, icon: Car },
            { id: 'profile', label: 'Profile & Security', icon: UserIcon },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = dashboardTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setDashboardTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {dashboardTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Total Orders Placed</span>
                <p className="text-2xl font-black text-white mt-1 font-mono">{orders.length}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Digital Service Requests</span>
                <p className="text-2xl font-black text-cyan-400 mt-1 font-mono">{serviceRequests.length}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Deliveries Dispatched</span>
                <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{deliveries.length}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Vehicle Rides Booked</span>
                <p className="text-2xl font-black text-purple-400 mt-1 font-mono">{bookings.length}</p>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  <span>Recent Marketplace Orders</span>
                </h3>
                <button
                  onClick={() => setDashboardTab('orders')}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  View All
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No orders placed yet.</p>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-400">{o.orderNumber}</span>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {o.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                        </p>
                        <span className="text-[10px] text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white font-mono">৳{o.totalAmount}</span>
                        <span className="block text-[11px] font-semibold text-emerald-400 capitalize">
                          {o.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {dashboardTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">No orders yet</p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{order.orderNumber}</span>
                      <p className="text-[11px] text-slate-500">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-cyan-300 border border-blue-800 capitalize">
                        {order.orderStatus}
                      </span>
                      <span className="text-base font-black text-white font-mono">
                        ৳{order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                        <span>{item.productName} × {item.quantity}</span>
                        <span className="font-mono font-semibold">৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address & tracking */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
                    <div>
                      <span>Delivery to: <strong>{order.deliveryAddress.address}, {order.deliveryAddress.city}</strong></span>
                    </div>
                    {order.trackingNumber && (
                      <button
                        onClick={() => {
                          setTrackingQuery(order.trackingNumber!);
                          setActiveTab('delivery');
                        }}
                        className="text-cyan-400 hover:underline font-mono flex items-center gap-1 font-bold"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track: {order.trackingNumber}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: SERVICE REQUESTS */}
        {dashboardTab === 'services' && (
          <div className="space-y-4 animate-in fade-in">
            {serviceRequests.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Printer className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">No service requests</p>
                <button
                  onClick={() => setActiveTab('services')}
                  className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                >
                  Explore Digital Services
                </button>
              </div>
            ) : (
              serviceRequests.map((req) => (
                <div key={req.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{req.requestNumber}</span>
                      <h4 className="text-base font-bold text-white">{req.serviceTitle}</h4>
                      <p className="text-xs text-slate-400">Type: {req.serviceType} • Qty: {req.quantity}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-cyan-300 border border-slate-700 capitalize self-start sm:self-auto">
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <strong>Instructions:</strong> {req.requirements}
                  </p>

                  {req.adminNotes && (
                    <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/40 text-xs text-cyan-300">
                      <strong>Staff Note:</strong> {req.adminNotes}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Deadline: {req.deadline}</span>
                    {req.estimatedCost && (
                      <span className="font-mono font-bold text-white">Est. Cost: ৳{req.estimatedCost}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: DELIVERIES */}
        {dashboardTab === 'deliveries' && (
          <div className="space-y-4 animate-in fade-in">
            {deliveries.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Truck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">No deliveries</p>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                >
                  Create Delivery Request
                </button>
              </div>
            ) : (
              deliveries.map((del) => (
                <div key={del.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{del.trackingNumber}</span>
                      <h4 className="text-base font-bold text-white">{del.packageType}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 capitalize self-start sm:self-auto">
                      {del.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">From:</span>
                      <p>{del.pickupAddress} ({del.senderName})</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">To:</span>
                      <p>{del.deliveryAddress} ({del.receiverName})</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">Fare: ৳{del.fare}</span>
                    <button
                      onClick={() => {
                        setTrackingQuery(del.trackingNumber);
                        setActiveTab('delivery');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Live Track</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: VEHICLE RIDES */}
        {dashboardTab === 'rides' && (
          <div className="space-y-4 animate-in fade-in">
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Car className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">No ride bookings yet</p>
                <button
                  onClick={() => setActiveTab('vehicles')}
                  className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                >
                  Book a Vehicle
                </button>
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{b.bookingNumber}</span>
                      <h4 className="text-base font-bold text-white capitalize">{b.vehicleType.toUpperCase()} Ride</h4>
                      <p className="text-xs text-slate-400">{b.bookingDate} at {b.bookingTime}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 capitalize self-start sm:self-auto">
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Pickup:</span>
                      <p>{b.pickupLocation}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Destination:</span>
                      <p>{b.dropLocation}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Driver: <strong className="text-white">{b.assignedDriverName || 'Assigning soon...'}</strong>
                    </span>
                    <span className="text-base font-black text-white font-mono">৳{b.estimatedFare}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 6: PROFILE & SECURITY */}
        {dashboardTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
            {/* Edit Profile */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-cyan-400" />
                <span>Account Profile</span>
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Cannot change)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/50 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+880 1812-456789"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Default Address</label>
                  <textarea
                    rows={2}
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="House, Road, Area, City"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Security & Password</span>
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Password (Min 6 characters)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {savingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
