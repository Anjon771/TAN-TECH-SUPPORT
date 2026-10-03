'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, CartItem, Product, SiteSettings, NotificationItem, ServicePackage } from '@/lib/types';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markAllNotifsRead: () => void;
  refreshNotifications: () => void;

  // Settings
  settings: SiteSettings | null;
  refreshSettings: () => void;

  // UI state
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  showCartDrawer: boolean;
  setShowCartDrawer: (show: boolean) => void;
  showCheckoutModal: boolean;
  setShowCheckoutModal: (show: boolean) => void;
  activeServiceModal: ServicePackage | null;
  setActiveServiceModal: (srv: ServicePackage | null) => void;
  trackingQuery: string;
  setTrackingQuery: (code: string) => void;

  // Toasts
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SiteSettings = {
  businessName: 'TAN TECH SUPPORT',
  tagline: 'Your Trusted Digital Partner',
  contactPhone: '+880 1711-234567',
  contactEmail: 'support@tantech.com',
  address: 'Level 2 & 4, Tan Tech Complex, GEC Circle, Chittagong, Bangladesh',
  operatingHours: 'Sat - Thu: 8:30 AM - 10:00 PM (Fri: 2:00 PM - 9:00 PM)',
  announcementText: '🎉 Welcome to TAN TECH SUPPORT! Fast Delivery across city • Book Cars & CNGs instantly • Certified Computer Training enrolling now!',
  announcementActive: true,
  facebookUrl: 'https://facebook.com/tantechsupport',
  youtubeUrl: 'https://youtube.com/@tantechsupport',
  whatsappNumber: '+8801711234567',
  deliveryBaseRate: 60,
  cngRatePerKm: 25,
  carRatePerKm: 55,
  vanRatePerKm: 90,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user defaults to customer for immediate usability, but can switch anytime
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(DEFAULT_SETTINGS);

  // Modals & UI state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [activeServiceModal, setActiveServiceModal] = useState<ServicePackage | null>(null);
  const [trackingQuery, setTrackingQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Load initial settings and default user session
  useEffect(() => {
    // 1. Fetch site settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    // 2. Fetch default customer for immediate interaction
    fetch('/api/auth?userId=usr-customer')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    // 3. Load cart from local storage if available
    try {
      const savedCart = localStorage.getItem('tts_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem('tts_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (_) {}
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('tts_cart', JSON.stringify(cart));
    } catch (_) {}
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem('tts_wishlist', JSON.stringify(wishlist));
    } catch (_) {}
  }, [wishlist]);

  // Fetch notifications whenever user changes
  const refreshNotifications = useCallback(() => {
    if (!user) return;
    fetch(`/api/notifications?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const refreshSettings = useCallback(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role switching
  const switchRole = async (role: UserRole) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'quick_switch', role }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        showToast(`Role switched to ${role.replace('_', ' ').toUpperCase()}`, 'success');
      } else {
        showToast(data.error || 'Failed to switch role', 'error');
      }
    } catch (e) {
      showToast('Network error switching role', 'error');
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setShowAuthModal(false);
        showToast(data.message, 'success');
        return { success: true, message: data.message };
      }
      showToast(data.error || 'Login failed', 'error');
      return { success: false, message: data.error || 'Login failed' };
    } catch (e) {
      showToast('Connection error during login', 'error');
      return { success: false, message: 'Connection error' };
    }
  };

  // Register
  const register = async (formData: any) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...formData }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setShowAuthModal(false);
        showToast(data.message, 'success');
        return { success: true, message: data.message };
      }
      showToast(data.error || 'Registration failed', 'error');
      return { success: false, message: data.error || 'Registration failed' };
    } catch (e) {
      showToast('Network error during registration', 'error');
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      }
      showToast('Saved to wishlist!', 'success');
      return [...prev, productId];
    });
  };

  // Mark all notifications read
  const markAllNotifsRead = async () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, markAll: true }),
      });
    } catch (_) {}
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        notifications,
        unreadNotifsCount,
        markAllNotifsRead,
        refreshNotifications,
        settings,
        refreshSettings,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        showCartDrawer,
        setShowCartDrawer,
        showCheckoutModal,
        setShowCheckoutModal,
        activeServiceModal,
        setActiveServiceModal,
        trackingQuery,
        setTrackingQuery,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
