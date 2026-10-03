'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Store,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    showCartDrawer,
    setShowCartDrawer,
    updateCartQty,
    removeFromCart,
    clearCart,
    setShowCheckoutModal,
  } = useApp();

  if (!showCartDrawer) return null;

  const handleCheckoutClick = () => {
    setShowCartDrawer(false);
    setShowCheckoutModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-black text-white">Your Shopping Cart</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white font-mono">
                {cartCount}
              </span>
            </div>
            <button
              onClick={() => setShowCartDrawer(false)}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-base font-bold text-white">Your cart is empty</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse our marketplace for computer accessories, digital paper, and original ink refills.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-cyan-400 truncate mt-0.5">{item.product.vendorName}</p>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">
                      ৳{item.product.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold font-mono text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 space-y-4 bg-slate-950/50">
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-white">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>City Express Delivery</span>
                  <span className="font-mono">৳60</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="font-mono text-cyan-400 text-lg">
                    ৳{(cartTotal + 60).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Buyer Guarantee • Fast Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
