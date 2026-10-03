'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Truck,
  Car,
  Printer,
  Megaphone,
  Newspaper,
  Settings as SettingsIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  TrendingUp,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  User,
  Vendor,
  Product,
  Order,
  DeliveryRequest,
  VehicleBooking,
  ServiceRequest,
  Advertisement,
  NewsItem,
  SiteSettings,
  Driver,
} from '@/lib/types';

export const AdminDashboard: React.FC = () => {
  const { user, showToast, settings: globalSettings, refreshSettings } = useApp();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'users'
    | 'vendors'
    | 'products'
    | 'orders'
    | 'services'
    | 'deliveries'
    | 'bookings'
    | 'ads'
    | 'news'
    | 'settings'
  >('overview');

  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [deliveriesList, setDeliveriesList] = useState<DeliveryRequest[]>([]);
  const [bookingsList, setBookingsList] = useState<VehicleBooking[]>([]);
  const [adsList, setAdsList] = useState<Advertisement[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Advertisement form states
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdSubtitle, setNewAdSubtitle] = useState('');
  const [newAdBadge, setNewAdBadge] = useState('Exclusive Deal');
  const [newAdBanner, setNewAdBanner] = useState('');
  const [newAdCta, setNewAdCta] = useState('Explore Now');
  const [newAdTarget, setNewAdTarget] = useState('/services');
  const [newAdPlacement, setNewAdPlacement] = useState<'hero' | 'marketplace' | 'services'>('hero');

  // New News form states
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'Tech News' | 'Announcement' | 'Tutorial'>('Announcement');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newNewsYoutube, setNewNewsYoutube] = useState('');
  const [newNewsThumbnail, setNewNewsThumbnail] = useState('');

  // CMS Settings edit states
  const [cmsSettings, setCmsSettings] = useState<SiteSettings | null>(globalSettings);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        usersRes,
        vendorsRes,
        productsRes,
        ordersRes,
        srvRes,
        delRes,
        vehRes,
        adsRes,
        newsRes,
      ] = await Promise.all([
        fetch('/api/analytics').then((r) => r.json()),
        fetch('/api/auth').then((r) => r.json()),
        fetch('/api/vendors').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/service-requests').then((r) => r.json()),
        fetch('/api/deliveries').then((r) => r.json()),
        fetch('/api/bookings').then((r) => r.json()),
        fetch('/api/advertisements?all=true').then((r) => r.json()),
        fetch('/api/news').then((r) => r.json()),
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (usersRes.users) setUsersList(usersRes.users);
      if (vendorsRes.vendors) setVendorsList(vendorsRes.vendors);
      if (productsRes.products) setProductsList(productsRes.products);
      if (ordersRes.orders) setOrdersList(ordersRes.orders);
      if (srvRes.requests) setServiceRequests(srvRes.requests);
      if (delRes.deliveries) setDeliveriesList(delRes.deliveries);
      if (vehRes.bookings) setBookingsList(vehRes.bookings);
      if (adsRes.advertisements) setAdsList(adsRes.advertisements);
      if (newsRes.news) setNewsList(newsRes.news);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Vendor status update (Approve, Reject, Suspend)
  const handleVendorStatus = async (vendorId: string, status: 'approved' | 'rejected' | 'suspended') => {
    try {
      const res = await fetch('/api/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vendorId, status }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Vendor ${status.toUpperCase()} successfully`, 'success');
        setVendorsList((prev) =>
          prev.map((v) => (v.id === vendorId ? { ...v, status } : v))
        );
      }
    } catch (_) {
      showToast('Error updating vendor status', 'error');
    }
  };

  // Order status update
  const handleOrderStatus = async (orderId: string, orderStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, orderStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to: ${orderStatus.toUpperCase()}`, 'success');
        setOrdersList((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: orderStatus as any } : o))
        );
      }
    } catch (_) {
      showToast('Failed to update order status', 'error');
    }
  };

  // Service Request update
  const handleServiceStatus = async (requestId: string, status: string, adminNotes?: string) => {
    try {
      const res = await fetch('/api/service-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestId, status, adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Service request updated', 'success');
        setServiceRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: status as any, adminNotes } : r))
        );
      }
    } catch (_) {
      showToast('Failed to update service request', 'error');
    }
  };

  // Create Advertisement
  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle || !newAdBanner) {
      showToast('Title and banner URL required', 'warning');
      return;
    }

    try {
      const payload = {
        title: newAdTitle,
        subtitle: newAdSubtitle,
        badge: newAdBadge,
        bannerUrl: newAdBanner,
        ctaText: newAdCta,
        targetUrl: newAdTarget,
        placement: newAdPlacement,
      };

      const res = await fetch('/api/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Advertisement campaign launched!', 'success');
        setShowAddAdModal(false);
        setNewAdTitle('');
        setNewAdSubtitle('');
        setNewAdBanner('');
        fetchAdminData();
      }
    } catch (_) {
      showToast('Error creating advertisement', 'error');
    }
  };

  // Delete Advertisement
  const handleDeleteAd = async (id: string) => {
    try {
      const res = await fetch(`/api/advertisements?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Ad deleted', 'info');
        setAdsList((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (_) {}
  };

  // Create News item
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsContent) {
      showToast('Title and content are required', 'warning');
      return;
    }

    try {
      const payload = {
        title: newNewsTitle,
        category: newNewsCategory,
        content: newNewsContent,
        youtubeUrl: newNewsYoutube,
        thumbnailUrl: newNewsThumbnail || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        author: user?.name || 'TAN TECH SUPPORT Faculty',
      };

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast('News / Video published successfully!', 'success');
        setShowAddNewsModal(false);
        setNewNewsTitle('');
        setNewNewsContent('');
        setNewNewsYoutube('');
        setNewNewsThumbnail('');
        fetchAdminData();
      }
    } catch (_) {
      showToast('Error publishing news', 'error');
    }
  };

  // Delete News
  const handleDeleteNews = async (id: string) => {
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Article deleted', 'info');
        setNewsList((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (_) {}
  };

  // Save CMS Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmsSettings) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsSettings),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Platform settings and CMS content updated!', 'success');
        refreshSettings();
      }
    } catch (_) {
      showToast('Error saving settings', 'error');
    }
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-800">
                  {user?.role === 'super_admin' ? 'SUPER ADMIN CONSOLE' : 'STAFF OPERATIONS'}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Full Root Access
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">TAN TECH SUPPORT Platform Manager</h2>
              <p className="text-xs text-slate-400">
                Operating user: {user?.name} ({user?.email})
              </p>
            </div>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-slate-800 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles },
            { id: 'users', label: `Users (${usersList.length})`, icon: Users },
            { id: 'vendors', label: `Vendors (${vendorsList.length})`, icon: Store },
            { id: 'products', label: `Products (${productsList.length})`, icon: Package },
            { id: 'orders', label: `Orders (${ordersList.length})`, icon: ShoppingBag },
            { id: 'services', label: `Services (${serviceRequests.length})`, icon: Printer },
            { id: 'deliveries', label: `Deliveries (${deliveriesList.length})`, icon: Truck },
            { id: 'bookings', label: `Rides (${bookingsList.length})`, icon: Car },
            { id: 'ads', label: `Ads (${adsList.length})`, icon: Megaphone },
            { id: 'news', label: `News (${newsList.length})`, icon: Newspaper },
            { id: 'settings', label: 'CMS Settings', icon: SettingsIcon },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-in fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Total Revenue (Paid)</span>
                <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                  ৳{stats.totalRevenue.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-500 mt-1 inline-block">Across all orders</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Total Orders</span>
                <p className="text-2xl font-black text-white mt-1 font-mono">{stats.totalOrders}</p>
                <span className="text-[10px] text-cyan-400 font-semibold mt-1 inline-block">
                  Active fulfillment
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Pending Deliveries</span>
                <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{stats.pendingDeliveries}</p>
                <span className="text-[10px] text-slate-500 mt-1 inline-block">In courier transit</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Pending Vendor Approvals</span>
                <p className="text-2xl font-black text-purple-400 mt-1 font-mono">{stats.pendingVendors}</p>
                <span className="text-[10px] text-purple-300 font-semibold mt-1 inline-block">Action required</span>
              </div>
            </div>

            {/* Monthly Revenue Chart Simulation */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span>Monthly Sales & Platform Growth</span>
                  </h3>
                  <p className="text-xs text-slate-400">Total gross volume across digital services & marketplace</p>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6 border-b border-slate-800">
                {stats.revenueByMonth.map((item: any, i: number) => {
                  const maxRev = 400000;
                  const heightPct = Math.round((item.revenue / maxRev) * 100);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        ৳{Math.round(item.revenue / 1000)}k
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-blue-700 via-cyan-600 to-teal-400 transition-all duration-500 hover:brightness-110"
                      />
                      <span className="text-xs text-slate-400 font-bold">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === 'users' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Registered Platform Accounts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Contact Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{u.phone || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VENDORS */}
        {activeTab === 'vendors' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Vendor Accounts & Approvals</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Store Name</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Total Revenue</th>
                    <th className="py-3 px-4 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {vendorsList.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">{v.storeName}</td>
                      <td className="py-3 px-4 text-slate-300">{v.ownerName} ({v.email})</td>
                      <td className="py-3 px-4 text-slate-400">{v.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            v.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-300'
                              : v.status === 'pending'
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-rose-950 text-rose-300'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">৳{v.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {v.status === 'pending' && (
                          <button
                            onClick={() => handleVendorStatus(v.id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                          >
                            Approve
                          </button>
                        )}
                        {v.status === 'approved' && (
                          <button
                            onClick={() => handleVendorStatus(v.id, 'suspended')}
                            className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 text-xs font-semibold"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Complete Product Catalog</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded object-cover" />
                        <span className="truncate max-w-xs">{p.name}</span>
                      </td>
                      <td className="py-3 px-4 text-cyan-400">{p.vendorName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">৳{p.price}</td>
                      <td className="py-3 px-4 font-mono">{p.stock}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={async () => {
                            if (confirm('Delete this product?')) {
                              await fetch(`/api/products?id=${p.id}`, { method: 'DELETE' });
                              setProductsList((prev) => prev.filter((item) => item.id !== p.id));
                              showToast('Product deleted', 'info');
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS */}
        {activeTab === 'orders' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in">
            <h3 className="text-lg font-bold text-white mb-4">All Customer Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ordersList.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">{o.orderNumber}</td>
                      <td className="py-3 px-4 text-white">{o.customerName} ({o.customerPhone})</td>
                      <td className="py-3 px-4 font-mono font-bold">৳{o.totalAmount}</td>
                      <td className="py-3 px-4 capitalize font-mono text-emerald-400">{o.paymentStatus}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                          className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-200"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SERVICES */}
        {activeTab === 'services' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Digital Service Requests</h3>
            <div className="space-y-4">
              {serviceRequests.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{r.requestNumber}</span>
                      <h4 className="text-sm font-bold text-white">{r.serviceTitle} ({r.serviceType})</h4>
                      <p className="text-xs text-slate-400">Customer: {r.customerName} • {r.customerPhone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={r.status}
                        onChange={(e) => handleServiceStatus(r.id, e.target.value, r.adminNotes)}
                        className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    {r.requirements}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: DELIVERIES */}
        {activeTab === 'deliveries' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Tan Tech Delivery Logistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tracking #</th>
                    <th className="py-3 px-4">Sender → Receiver</th>
                    <th className="py-3 px-4">Assigned Driver</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 font-mono">Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deliveriesList.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">{d.trackingNumber}</td>
                      <td className="py-3 px-4">
                        <p className="text-white font-medium">{d.senderName} → {d.receiverName}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{d.deliveryAddress}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{d.assignedDriverName || 'Unassigned'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                          {d.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">৳{d.fare}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: VEHICLE BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in">
            <h3 className="text-lg font-bold text-white mb-4">Vehicle & Ride Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Booking #</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Passenger</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 font-mono">Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookingsList.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">{b.bookingNumber}</td>
                      <td className="py-3 px-4 capitalize text-white font-semibold">{b.vehicleType}</td>
                      <td className="py-3 px-4 text-slate-300">{b.customerName} ({b.customerPhone})</td>
                      <td className="py-3 px-4 text-slate-400 truncate max-w-xs">{b.pickupLocation} → {b.dropLocation}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">৳{b.estimatedFare}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: ADVERTISEMENTS */}
        {activeTab === 'ads' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Promotional Advertisements</h3>
                <p className="text-xs text-slate-400">Manage hero, marketplace, and service promotional banners</p>
              </div>
              <button
                onClick={() => setShowAddAdModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Ad Campaign</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adsList.map((ad) => (
                <div key={ad.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <img src={ad.bannerUrl} alt={ad.title} referrerPolicy="no-referrer" className="w-full h-32 rounded-lg object-cover mb-3" />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-cyan-400">{ad.placement} banner</span>
                      <span className="text-xs text-slate-400 font-mono">{ad.clicks} clicks</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{ad.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ad.subtitle}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: NEWS & YOUTUBE */}
        {activeTab === 'news' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">News, Tutorials & YouTube Media</h3>
                <p className="text-xs text-slate-400">Publish tech news, YouTube tutorials, and official platform announcements</p>
              </div>
              <button
                onClick={() => setShowAddNewsModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish News / Video</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsList.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <img src={item.thumbnailUrl} alt={item.title} referrerPolicy="no-referrer" className="w-full h-36 rounded-lg object-cover mb-3" />
                    <span className="text-[10px] font-bold uppercase text-cyan-400">{item.category}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.excerpt}</p>
                    {item.youtubeUrl && (
                      <p className="text-[11px] text-rose-400 mt-2 font-mono truncate">
                        YouTube: {item.youtubeUrl}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">{new Date(item.publishedAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: CMS SETTINGS */}
        {activeTab === 'settings' && cmsSettings && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl animate-in fade-in max-w-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Platform Content & Business Settings</h3>
            <p className="text-xs text-slate-400 mb-6">
              Update branding, hotline phone, announcement banner, and delivery/ride rates dynamically without changing code.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={cmsSettings.businessName}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, businessName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={cmsSettings.tagline}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Hotline</label>
                  <input
                    type="text"
                    value={cmsSettings.contactPhone}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={cmsSettings.contactEmail}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headquarters Physical Address</label>
                <input
                  type="text"
                  value={cmsSettings.address}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Top Announcement Banner Text</label>
                <input
                  type="text"
                  value={cmsSettings.announcementText}
                  onChange={(e) => setCmsSettings({ ...cmsSettings, announcementText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Rate Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Delivery Base (৳)</label>
                  <input
                    type="number"
                    value={cmsSettings.deliveryBaseRate}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, deliveryBaseRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">CNG Rate/km (৳)</label>
                  <input
                    type="number"
                    value={cmsSettings.cngRatePerKm}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, cngRatePerKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Car Rate/km (৳)</label>
                  <input
                    type="number"
                    value={cmsSettings.carRatePerKm}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, carRatePerKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Van Rate/km (৳)</label>
                  <input
                    type="number"
                    value={cmsSettings.vanRatePerKm}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, vanRatePerKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Save Site Content & Rates
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add Advertisement Modal */}
      {showAddAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddAdModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Create New Advertisement Campaign</h3>
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={newAdTitle}
                  onChange={(e) => setNewAdTitle(e.target.value)}
                  placeholder="e.g. 30% Off on Bulk Visiting Cards"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={newAdSubtitle}
                  onChange={(e) => setNewAdSubtitle(e.target.value)}
                  placeholder="Supporting promotional text"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Placement</label>
                  <select
                    value={newAdPlacement}
                    onChange={(e) => setNewAdPlacement(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  >
                    <option value="hero">Hero Carousel</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="services">Services Page</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={newAdBadge}
                    onChange={(e) => setNewAdBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  value={newAdBanner}
                  onChange={(e) => setNewAdBanner(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={newAdCta}
                    onChange={(e) => setNewAdCta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Section Link</label>
                  <input
                    type="text"
                    value={newAdTarget}
                    onChange={(e) => setNewAdTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
              >
                Launch Advertisement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add News / YouTube Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddNewsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Publish News or YouTube Video</h3>
            <form onSubmit={handleCreateNews} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                  placeholder="e.g. Complete Excel Mastery Tutorial"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newNewsCategory}
                  onChange={(e) => setNewNewsCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Tech News">Tech News</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube URL (Optional)</label>
                <input
                  type="url"
                  value={newNewsYoutube}
                  onChange={(e) => setNewNewsYoutube(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={newNewsThumbnail}
                  onChange={(e) => setNewNewsThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Content / Article *</label>
                <textarea
                  rows={4}
                  required
                  value={newNewsContent}
                  onChange={(e) => setNewNewsContent(e.target.value)}
                  placeholder="Article text or video transcript notes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
              >
                Publish Article / Video
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
