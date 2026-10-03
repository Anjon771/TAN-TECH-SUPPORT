'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  X,
  ExternalLink,
} from 'lucide-react';
import { Product, Order, Vendor } from '@/lib/types';

export const VendorDashboard: React.FC = () => {
  const { user, showToast } = useApp();
  const [vendorData, setVendorData] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form states
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'electronics' | 'gadgets' | 'printing_supplies' | 'office_stationery' | 'computer_accessories'>('computer_accessories');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const [prodStock, setProdStock] = useState('15');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const fetchVendorData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const vendorId = user.vendorId || 'ven-1';

      const [venRes, prodRes, ordRes] = await Promise.all([
        fetch(`/api/vendors?id=${vendorId}`).then((r) => r.json()),
        fetch(`/api/products?vendorId=${vendorId}`).then((r) => r.json()),
        fetch(`/api/orders?vendorId=${vendorId}`).then((r) => r.json()),
      ]);

      if (venRes.vendor) setVendorData(venRes.vendor);
      if (prodRes.products) setProducts(prodRes.products);
      if (ordRes.orders) setOrders(ordRes.orders);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [user]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodCategory) {
      showToast('Please fill product name, price, and category', 'warning');
      return;
    }

    setSubmittingProduct(true);
    try {
      const payload = {
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        originalPrice: prodOrigPrice ? Number(prodOrigPrice) : undefined,
        stock: Number(prodStock) || 10,
        description: prodDesc,
        images: prodImage ? [prodImage] : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
        vendorId: vendorData?.id || 'ven-1',
        vendorName: vendorData?.storeName || 'Tan Tech Vendor Hub',
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Product added to your store catalog!', 'success');
        setShowAddProductModal(false);
        setProdName('');
        setProdPrice('');
        setProdOrigPrice('');
        setProdDesc('');
        setProdImage('');
        fetchVendorData();
      } else {
        showToast(data.error || 'Failed to add product', 'error');
      }
    } catch (_) {
      showToast('Error saving product', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this product from your inventory?')) return;
    try {
      const res = await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product removed from catalog', 'info');
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (_) {
      showToast('Failed to delete product', 'error');
    }
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
                  Vendor Partner Portal
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved Seller
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {vendorData?.storeName || 'Tan Tech Digital Print & Gadgets Hub'}
              </h2>
              <p className="text-xs text-slate-400">Owner: {vendorData?.ownerName || user?.name} • Rating: 4.9 ★</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">
              ৳{(vendorData?.revenue || 485000).toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18.4% this month
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Sales Volume</span>
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {vendorData?.totalSales || 342} units
            </p>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">Across all categories</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Listed Products</span>
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-cyan-400 font-mono">
              {products.length} Active
            </p>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">In stock and selling</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Store Rating</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400 font-mono">
              {vendorData?.rating || 4.9} / 5.0
            </p>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">Top Rated Seller Badge</span>
          </div>
        </div>

        {/* Product Inventory Table */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Your Product Catalog</h3>
              <p className="text-xs text-slate-400">Manage real-time price, stock counts, and visibility</p>
            </div>
          </div>

          {products.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No products listed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4">Inventory Stock</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover bg-slate-950 shrink-0" />
                        <span className="truncate max-w-xs">{p.name}</span>
                      </td>
                      <td className="py-3 px-4 capitalize">{p.category.replace('_', ' ')}</td>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">৳{p.price}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            p.stock > 5 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">★ {p.rating}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Vendor Orders */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Customer Orders for Your Store</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No orders received yet.</p>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {orders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400">{o.orderNumber}</span>
                    <p className="text-xs text-slate-300 mt-0.5">Customer: {o.customerName} ({o.customerPhone})</p>
                    <span className="text-[10px] text-slate-500">{new Date(o.createdAt).toLocaleString()}</span>
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

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Add Product to Store</h3>
            <p className="text-xs text-slate-400 mb-4">Product will instantly be live on the TAN TECH Marketplace.</p>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Wireless Ergonomic Vertical Mouse"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="computer_accessories">Computer Accessories</option>
                    <option value="printing_supplies">Printing Supplies</option>
                    <option value="electronics">Electronics & Webcams</option>
                    <option value="gadgets">Tech Gadgets & USB</option>
                    <option value="office_stationery">Office Stationery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="1200"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Image URL</label>
                  <span className="text-[10px] text-cyan-400">Or pick high-res preset</span>
                </div>
                <input
                  type="url"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /assets/images/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />

                {/* Preset image suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    { label: 'USB Drive', url: '/assets/images/usb_flash_drive_1791020777278.jpg' },
                    { label: 'Drawing Tablet', url: '/assets/images/graphics_drawing_tablet_1791020789413.jpg' },
                    { label: 'Printer Ink', url: '/assets/images/printer_ink_bottles_1791020803398.jpg' },
                    { label: 'Printing Paper', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Webcam', url: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=80' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProdImage(p.url)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                    >
                      + {p.label}
                    </button>
                  ))}
                </div>

                {prodImage && (
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <img src={prodImage} alt="Preview" referrerPolicy="no-referrer" className="w-10 h-10 rounded object-cover" />
                    <span className="text-[11px] text-emerald-400">Image loaded & ready</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Key features, warranty, and specifications..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingProduct}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {submittingProduct ? 'Publishing Product...' : 'Publish Product to Store'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
