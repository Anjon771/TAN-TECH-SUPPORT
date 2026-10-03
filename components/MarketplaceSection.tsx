'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Eye,
  Heart,
  Store,
  CheckCircle2,
  Package,
  Plus,
  Minus,
  Sparkles,
  Zap,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { Product } from '@/lib/types';

export const MarketplaceSection: React.FC = () => {
  const { addToCart, wishlist, toggleWishlist, setShowCartDrawer, setShowCheckoutModal } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [modalSelectedImgIdx, setModalSelectedImgIdx] = useState(0);
  const [activeImageMap, setActiveImageMap] = useState<Record<string, number>>({});
  const [modalQty, setModalQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'computer_accessories', label: 'Computer Accessories' },
    { id: 'printing_supplies', label: 'Printing Supplies' },
    { id: 'electronics', label: 'Electronics & Webcams' },
    { id: 'gadgets', label: 'Tech Gadgets & USB' },
    { id: 'office_stationery', label: 'Office Stationery' },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products?';
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const handleBuyNow = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    setShowCheckoutModal(true);
  };

  return (
    <section className="py-16 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Multi-Vendor E-Commerce</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Online Marketplace & Supplies
            </h2>
            <p className="mt-1 text-sm text-slate-400 max-w-xl">
              Authentic computer hardware, premium paper reams, original inks, and peripherals verified by TAN TECH SUPPORT.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, or vendors..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Pills & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="featured">Featured First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 animate-pulse h-80" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">Try altering your search keyword or selected category filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-semibold hover:bg-slate-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const discountPct =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 group"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative w-full h-52 bg-slate-950 overflow-hidden rounded-t-2xl group/img">
                      <img
                        src={product.images[activeImageMap[product.id] || 0] || product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                      />

                      {/* Subtle Vignette Gradient for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Photo navigation arrows on card */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = activeImageMap[product.id] || 0;
                              const prevIdx = (current - 1 + product.images.length) % product.images.length;
                              setActiveImageMap((prev) => ({ ...prev, [product.id]: prevIdx }));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-cyan-600 transition-all z-10 shadow-md backdrop-blur-sm"
                            aria-label="Previous photo"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = activeImageMap[product.id] || 0;
                              const nextIdx = (current + 1) % product.images.length;
                              setActiveImageMap((prev) => ({ ...prev, [product.id]: nextIdx }));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-cyan-600 transition-all z-10 shadow-md backdrop-blur-sm"
                            aria-label="Next photo"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Multiple images gallery pagination dots */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700/60 shadow">
                          {product.images.map((_, imgIdx) => {
                            const isCurrent = (activeImageMap[product.id] || 0) === imgIdx;
                            return (
                              <button
                                key={imgIdx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImageMap((prev) => ({ ...prev, [product.id]: imgIdx }));
                                }}
                                className={`h-1.5 rounded-full transition-all ${
                                  isCurrent ? 'w-4 bg-cyan-400' : 'w-1.5 bg-slate-500 hover:bg-slate-300'
                                }`}
                                aria-label={`View image ${imgIdx + 1}`}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {product.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white shadow">
                            FEATURED
                          </span>
                        )}
                        {discountPct && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white shadow">
                            -{discountPct}%
                          </span>
                        )}
                      </div>

                      {/* Photo count indicator */}
                      {product.images.length > 1 && (
                        <div className="absolute top-2.5 right-12 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/60 flex items-center gap-1 z-10 shadow">
                          <Camera className="w-3 h-3 text-cyan-400" />
                          <span>{(activeImageMap[product.id] || 0) + 1}/{product.images.length}</span>
                        </div>
                      )}

                      {/* Floating actions */}
                      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                            isWishlisted
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-950/70 text-slate-300 hover:text-white'
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={() => {
                            setQuickViewProduct(product);
                            setModalSelectedImgIdx(0);
                            setModalQty(1);
                          }}
                          className="p-2 rounded-xl bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-white transition-colors"
                          aria-label="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stock pill */}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950/80 backdrop-blur-sm text-slate-300">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Vendor name */}
                      <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 mb-1 truncate">
                        <Store className="w-3 h-3 shrink-0" />
                        <span className="truncate">{product.vendorName}</span>
                      </div>

                      <h3
                        onClick={() => {
                          setQuickViewProduct(product);
                          setModalSelectedImgIdx(0);
                          setModalQty(1);
                        }}
                        className="text-sm font-bold text-white line-clamp-2 hover:text-cyan-300 cursor-pointer transition-colors leading-snug"
                      >
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold ml-1 text-slate-200">{product.rating}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">({product.reviewsCount} reviews)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-lg font-black text-white font-mono">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-500 line-through font-mono">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => handleBuyNow(product, 1)}
                      className="py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick View / Detail Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image & Gallery */}
              <div className="flex flex-col gap-2">
                <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-64 md:h-72 relative group">
                  <img
                    src={quickViewProduct.images[modalSelectedImgIdx] || quickViewProduct.images[0]}
                    alt={quickViewProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/60 flex items-center gap-1.5 shadow">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{modalSelectedImgIdx + 1} of {quickViewProduct.images.length}</span>
                  </div>
                </div>
                {/* Thumbnails */}
                {quickViewProduct.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {quickViewProduct.images.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setModalSelectedImgIdx(i)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border transition-all shrink-0 ${
                          modalSelectedImgIdx === i
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${i + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                      {quickViewProduct.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({quickViewProduct.stock})
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight">
                    {quickViewProduct.name}
                  </h3>

                  {/* Vendor Info */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 my-2">
                    <Store className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sold by: <strong className="text-slate-200">{quickViewProduct.vendorName}</strong></span>
                  </div>

                  <div className="flex items-baseline gap-3 my-3">
                    <span className="text-2xl font-black text-white font-mono">
                      ৳{quickViewProduct.price.toLocaleString()}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-slate-500 line-through font-mono">
                        ৳{quickViewProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {/* Quantity selector */}
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-semibold">Quantity:</span>
                    <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800">
                      <button
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        className="px-3 py-1.5 text-slate-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-white font-mono">
                        {modalQty}
                      </span>
                      <button
                        onClick={() => setModalQty((q) => Math.min(quickViewProduct.stock, q + 1))}
                        className="px-3 py-1.5 text-slate-300 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, modalQty);
                      setQuickViewProduct(null);
                    }}
                    className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      handleBuyNow(quickViewProduct, modalQty);
                      setQuickViewProduct(null);
                    }}
                    className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
