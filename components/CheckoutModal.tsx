'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CheckCircle2,
  X,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  ShieldCheck,
  Send,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { PaymentMethod, Order } from '@/lib/types';

interface CheckoutModalProps {
  setActiveTab: (tab: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ setActiveTab }) => {
  const {
    user,
    cart,
    cartTotal,
    clearCart,
    showCheckoutModal,
    setShowCheckoutModal,
    showToast,
    setTrackingQuery,
  } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('Chittagong');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!showCheckoutModal) return null;

  const deliveryFee = 60;
  const grandTotal = cartTotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      showToast('Please provide your name, phone, and delivery address', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const itemsPayload = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
        vendorId: item.product.vendorId,
      }));

      const payload = {
        customerId: user?.id || 'guest',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: itemsPayload,
        subtotal: cartTotal,
        deliveryFee,
        totalAmount: grandTotal,
        deliveryAddress: {
          address,
          city,
          instructions,
        },
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        clearCart();
        showToast(data.message, 'success');
      } else {
        showToast(data.error || 'Failed to complete order', 'error');
      }
    } catch (_) {
      showToast('Network error processing checkout', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackClick = () => {
    if (confirmedOrder?.trackingNumber) {
      setTrackingQuery(confirmedOrder.trackingNumber);
      setShowCheckoutModal(false);
      setActiveTab('delivery');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl my-8">
        <button
          onClick={() => {
            setShowCheckoutModal(false);
            setConfirmedOrder(null);
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Screen */}
        {confirmedOrder ? (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                Order Confirmed & Processing
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                Thank You for Your Order!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your order <strong className="text-cyan-400 font-mono">#{confirmedOrder.orderNumber}</strong> has been received by our fulfillment center.
              </p>
            </div>

            {/* Tracking Code Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-2">
              <p className="text-[11px] font-bold uppercase text-slate-400">
                Assigned Delivery Tracking Code:
              </p>
              <p className="text-xl font-black text-cyan-400 font-mono tracking-wider">
                {confirmedOrder.trackingNumber}
              </p>
              <p className="text-[11px] text-slate-400">
                Total Paid / Due: <strong className="text-white">৳{confirmedOrder.totalAmount}</strong> via {confirmedOrder.paymentMethod.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleTrackClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Delivery Now</span>
              </button>

              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setConfirmedOrder(null);
                  setActiveTab('account');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                View in Customer Account
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6 pb-4 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                Secure Checkout
              </span>
              <h3 className="text-2xl font-black text-white mt-1">Complete Your Marketplace Order</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review your items and choose your preferred delivery and payment options.
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>1. Delivery Destination Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Receiver name"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1812-456789"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Delivery Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House, Road, Area, Landmark"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>2. Payment Option</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'cod' as PaymentMethod, label: 'Cash on Delivery', sub: 'Pay upon receipt' },
                    { id: 'bkash' as PaymentMethod, label: 'bKash Mobile', sub: 'Instant & Secure' },
                    { id: 'nagad' as PaymentMethod, label: 'Nagad Pay', sub: 'Instant Wallet' },
                    { id: 'card' as PaymentMethod, label: 'Debit / Card', sub: 'Visa / MasterCard' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        paymentMethod === p.id
                          ? 'bg-blue-900/40 border-cyan-500 text-white shadow'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <p className="text-xs font-bold">{p.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-mono font-bold text-white">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tan Tech City Delivery Fee</span>
                  <span className="font-mono">৳{deliveryFee}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-cyan-400 text-lg">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm Order • ৳{grandTotal.toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
