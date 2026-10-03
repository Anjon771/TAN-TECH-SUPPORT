export type UserRole = 'super_admin' | 'staff' | 'vendor' | 'driver' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
  vendorId?: string;
  driverId?: string;
  createdAt: string;
}

export interface UserRecord extends User {
  passwordHash: string;
}

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  description: string;
  logo?: string;
  banner?: string;
  rating: number;
  totalSales: number;
  revenue: number;
  createdAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'car' | 'van' | 'cng';
  vehicleModel: string;
  licensePlate: string;
  status: 'available' | 'on_trip' | 'offline';
  rating: number;
  totalTrips: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'electronics' | 'gadgets' | 'printing_supplies' | 'office_stationery' | 'computer_accessories';
  images: string[];
  stock: number;
  vendorId: string;
  vendorName: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  vendorId: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: {
    address: string;
    city: string;
    zone?: string;
    postalCode?: string;
    instructions?: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 'printing' | 'graphic_design' | 'video_editing' | 'computer_training';

export interface ServicePackage {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  iconName: string;
  startingPrice: number;
  estimatedDelivery: string;
  options: string[];
  features: string[];
  popular?: boolean;
}

export type ServiceRequestStatus = 'pending' | 'reviewed' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategory;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  quantity?: number;
  requirements: string;
  deadline?: string;
  estimatedCost?: number;
  attachmentName?: string;
  status: ServiceRequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryStatus = 
  | 'requested'
  | 'accepted'
  | 'pickup_assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface DeliveryTimelineItem {
  status: DeliveryStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface DeliveryRequest {
  id: string;
  trackingNumber: string;
  customerId: string;
  deliveryType: 'product_delivery' | 'parcel_delivery' | 'pickup_and_drop';
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  packageType: string;
  packageWeight: string;
  preferredPickupTime: string;
  scheduledDeliveryDate?: string;
  notes?: string;
  fare: number;
  status: DeliveryStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  timeline: DeliveryTimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export type VehicleType = 'car' | 'van' | 'cng';
export type TripType = 'one_way' | 'round_trip' | 'hourly';
export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'driver_on_the_way'
  | 'picked_up'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface VehicleBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleType: VehicleType;
  tripType: TripType;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  bookingTime: string;
  passengers: number;
  instructions?: string;
  estimatedFare: number;
  status: BookingStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  assignedVehiclePlate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  bannerUrl: string;
  targetUrl: string;
  ctaText: string;
  placement: 'hero' | 'marketplace' | 'services' | 'sidebar';
  startDate: string;
  endDate: string;
  isActive: boolean;
  clicks: number;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Tech News' | 'Announcement' | 'Tutorial' | 'Update';
  youtubeUrl?: string;
  thumbnailUrl: string;
  publishedAt: string;
  author: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  operatingHours: string;
  announcementText: string;
  announcementActive: boolean;
  facebookUrl?: string;
  youtubeUrl?: string;
  whatsappNumber?: string;
  deliveryBaseRate: number;
  cngRatePerKm: number;
  carRatePerKm: number;
  vanRatePerKm: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'booking' | 'service' | 'system' | 'vendor';
  link?: string;
  read: boolean;
  createdAt: string;
}
