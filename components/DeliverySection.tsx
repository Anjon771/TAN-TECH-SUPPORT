'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  Phone,
  User as UserIcon,
  ShieldCheck,
  Search,
  CheckCircle2,
  Send,
  Navigation,
  ArrowRight,
  AlertCircle,
  Copy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DeliveryRequest, DeliveryStatus } from '@/lib/types';

export const DeliverySection: React.FC = () => {
  const { user, trackingQuery, setTrackingQuery, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'track' | 'create'>('track');
  const [trackCode, setTrackCode] = useState(trackingQuery || '');
  const [searchedDelivery, setSearchedDelivery] = useState<DeliveryRequest | null>(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Form states for Pickup & Drop request
  const [senderName, setSenderName] = useState(user?.name || '');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [pickupAddress, setPickupAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [packageType, setPackageType] = useState('Documents & Parcels');
  const [packageWeight, setPackageWeight] = useState('1 kg');
  const [pickupTime, setPickupTime] = useState('Immediate Express');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdDelivery, setCreatedDelivery] = useState<DeliveryRequest | null>(null);

  const handleTrackQuery = async (code: string) => {
    if (!code.trim()) return;
    setLoadingTrack(true);
    setTrackError('');
    try {
      const res = await fetch(`/api/deliveries?trackingNumber=${encodeURIComponent(code.trim().toUpperCase())}`);
      const data = await res.json();
      if (data.delivery) {
        setSearchedDelivery(data.delivery);
      } else {
        setSearchedDelivery(null);
        setTrackError('No shipment found with this tracking number. Please verify and try again.');
      }
    } catch (_) {
      setTrackError('Error connecting to logistics server.');
    } finally {
      setLoadingTrack(false);
    }
  };

  // If trackingQuery changes from Hero or elsewhere, automatically fetch
  useEffect(() => {
    if (trackingQuery) {
      setTrackCode(trackingQuery);
      handleTrackQuery(trackingQuery);
    } else {
      // Default to showing TTS-DEL-7841 for quick demonstration
      handleTrackQuery('TTS-DEL-7841');
    }
  }, [trackingQuery]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderPhone || !pickupAddress || !receiverName || !receiverPhone || !deliveryAddress) {
      showToast('Please fill all required addresses and contact details', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerId: user?.id || 'guest',
        deliveryType: 'pickup_and_drop',
        senderName,
        senderPhone,
        pickupAddress,
        receiverName,
        receiverPhone,
        deliveryAddress,
        packageType,
        packageWeight,
        preferredPickupTime: pickupTime,
        notes,
        fare: packageWeight.includes('5') || packageWeight.includes('10') ? 160 : 100,
      };

      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.delivery) {
        setCreatedDelivery(data.delivery);
        setSearchedDelivery(data.delivery);
        setTrackCode(data.delivery.trackingNumber);
        showToast(data.message, 'success');
        setActiveTab('track');
      } else {
        showToast(data.error || 'Failed to create delivery', 'error');
      }
    } catch (err) {
      showToast('Error booking delivery service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Tracking number copied to clipboard!', 'info');
  };

  const statusColors: Record<DeliveryStatus, { bg: string; text: string; label: string }> = {
    requested: { bg: 'bg-amber-950 text-amber-300 border-amber-800', text: 'text-amber-400', label: 'Requested' },
    accepted: { bg: 'bg-blue-950 text-blue-300 border-blue-800', text: 'text-blue-400', label: 'Accepted by Ops' },
    pickup_assigned: { bg: 'bg-indigo-950 text-indigo-300 border-indigo-800', text: 'text-indigo-400', label: 'Rider En Route' },
    picked_up: { bg: 'bg-purple-950 text-purple-300 border-purple-800', text: 'text-purple-400', label: 'Parcel Collected' },
    in_transit: { bg: 'bg-cyan-950 text-cyan-300 border-cyan-800', text: 'text-cyan-400', label: 'In Transit' },
    delivered: { bg: 'bg-emerald-950 text-emerald-300 border-emerald-800', text: 'text-emerald-400', label: 'Delivered' },
    cancelled: { bg: 'bg-rose-950 text-rose-300 border-rose-800', text: 'text-rose-400', label: 'Cancelled' },
  };

  return (
    <section className="py-16 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>TAN TECH DELIVERY & LOGISTICS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Citywide Express Parcel & Pickup / Drop Service
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Send confidential contracts, hardware parcels, e-commerce orders, or sample prints with real-time GPS courier tracking and verified doorstep delivery.
          </p>
        </div>

        {/* Tab switcher: Track Shipment vs Create Delivery */}
        <div className="flex items-center justify-center mb-10">
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex gap-2">
            <button
              onClick={() => setActiveTab('track')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Live Delivery</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Request Pickup & Drop</span>
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE TRACKING */}
        {activeTab === 'track' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            {/* Search Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTrackQuery(trackCode);
                }}
                className="flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackCode}
                    onChange={(e) => setTrackCode(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. TTS-DEL-7841)"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm uppercase placeholder-slate-500 font-mono tracking-wider focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingTrack}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
                >
                  {loadingTrack ? 'Tracking...' : 'Track Shipment'}
                </button>
              </form>

              {/* Quick sample chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
                <span>Sample Tracking IDs:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrackCode('TTS-DEL-7841');
                    handleTrackQuery('TTS-DEL-7841');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 font-mono hover:bg-slate-700 transition-colors"
                >
                  TTS-DEL-7841 (In Transit)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrackCode('TTS-DEL-6520');
                    handleTrackQuery('TTS-DEL-6520');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 font-mono hover:bg-slate-700 transition-colors"
                >
                  TTS-DEL-6520 (Delivered)
                </button>
              </div>

              {trackError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {/* Tracking Result Card */}
            {searchedDelivery && (
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {searchedDelivery.trackingNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(searchedDelivery.trackingNumber)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                        aria-label="Copy Tracking Code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-xl font-black text-white mt-1">
                      {searchedDelivery.packageType}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Service Type: {searchedDelivery.deliveryType.replace(/_/g, ' ').toUpperCase()} • Weight: {searchedDelivery.packageWeight}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                        statusColors[searchedDelivery.status]?.bg || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {statusColors[searchedDelivery.status]?.label || searchedDelivery.status}
                    </span>
                    <span className="text-base font-black text-white font-mono bg-slate-800 px-3 py-1 rounded-xl">
                      ৳{searchedDelivery.fare}
                    </span>
                  </div>
                </div>

                {/* Pickup & Destination Address Route Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400">Pickup Origin</p>
                      <p className="text-xs font-semibold text-white mt-0.5">{searchedDelivery.pickupAddress}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sender: {searchedDelivery.senderName} ({searchedDelivery.senderPhone})</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400">Delivery Destination</p>
                      <p className="text-xs font-semibold text-white mt-0.5">{searchedDelivery.deliveryAddress}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Recipient: {searchedDelivery.receiverName} ({searchedDelivery.receiverPhone})</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Driver Box (if assigned) */}
                {searchedDelivery.assignedDriverName && (
                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide">
                          Assigned Tan Tech Courier
                        </p>
                        <p className="text-sm font-bold text-white">{searchedDelivery.assignedDriverName}</p>
                        <p className="text-xs text-slate-400">{searchedDelivery.assignedDriverPhone}</p>
                      </div>
                    </div>
                    {searchedDelivery.assignedDriverPhone && (
                      <a
                        href={`tel:${searchedDelivery.assignedDriverPhone}`}
                        className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Driver</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Timeline Progress */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                    Shipment Journey Timeline
                  </h4>
                  <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {searchedDelivery.timeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-4">
                        <div
                          className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                            step.completed
                              ? 'bg-cyan-400 border-cyan-300 shadow-md shadow-cyan-400/50'
                              : 'bg-slate-900 border-slate-700'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p
                              className={`text-sm font-bold ${
                                step.completed ? 'text-white' : 'text-slate-500'
                              }`}
                            >
                              {step.title}
                            </p>
                            {step.timestamp && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REQUEST PICKUP & DROP FORM */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl animate-in fade-in">
            <div className="mb-6 pb-4 border-b border-slate-800">
              <h3 className="text-2xl font-black text-white">Create a Pickup & Drop Request</h3>
              <p className="text-xs text-slate-400 mt-1">
                A nearby rider will be dispatched to collect the parcel and deliver it securely to the recipient.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-6">
              {/* Sender Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> 1. Pickup (Sender) Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Sender Name *</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Tanvir Hossain"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Sender Phone *</label>
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+880 1711-000000"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exact Pickup Address & Landmark *</label>
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. Shop 14, Tech Commercial Center, GEC Circle"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Receiver Details */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" /> 2. Delivery (Receiver) Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Receiver Name *</label>
                    <input
                      type="text"
                      required
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="e.g. Farhana Sultana"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Receiver Phone *</label>
                    <input
                      type="tel"
                      required
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="+880 1819-000000"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Delivery Destination Address *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. House 42, Road 7, Nasirabad Housing Society"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Package & Timing */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> 3. Package Specifics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Package Type</label>
                    <select
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Documents & Legal Papers">Documents & Contracts</option>
                      <option value="Printed Goods & Visiting Cards">Printed Goods</option>
                      <option value="Electronics & IT Accessories">Electronics / Gadgets</option>
                      <option value="Fragile Gift / Item">Fragile Item</option>
                      <option value="General Box / Carton">General Box</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Weight Estimate</label>
                    <select
                      value={packageWeight}
                      onChange={(e) => setPackageWeight(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Under 1 kg">Under 1 kg (Standard: ৳100)</option>
                      <option value="1 - 3 kg">1 - 3 kg (৳120)</option>
                      <option value="3 - 5 kg">3 - 5 kg (৳140)</option>
                      <option value="5 - 10 kg">5 - 10 kg (৳180)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Time</label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Immediate Express (30m)">Immediate Express (30m)</option>
                      <option value="Morning (09:00 AM - 12:00 PM)">Morning Batch</option>
                      <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon Batch</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening Batch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Special Instructions for Rider (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call sender before reaching Gate 2, fragile package handle carefully."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Fare & Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400">Calculated City Delivery Fee:</span>
                  <p className="text-2xl font-black text-cyan-400 font-mono">
                    ৳{packageWeight.includes('5') || packageWeight.includes('10') ? '180' : '100'}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Dispatching Rider...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Book Pickup</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
