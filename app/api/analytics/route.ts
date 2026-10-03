import { NextResponse } from 'next/server';
import { getDb, sanitizeUser } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    const totalUsers = db.users.length;
    const totalCustomers = db.users.filter((u) => u.role === 'customer').length;
    const totalVendors = db.vendors.length;
    const pendingVendors = db.vendors.filter((v) => v.status === 'pending').length;
    const totalDrivers = db.drivers.length;
    const totalProducts = db.products.length;
    const totalOrders = db.orders.length;
    const totalRevenue = db.orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
    const pendingDeliveries = db.deliveries.filter((d) => d.status !== 'delivered' && d.status !== 'cancelled').length;
    const pendingBookings = db.vehicleBookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length;
    const pendingServiceRequests = db.serviceRequests.filter((r) => r.status === 'pending' || r.status === 'reviewed').length;

    // Monthly revenue simulation data for admin chart
    const revenueByMonth = [
      { month: 'May', revenue: 145000, orders: 48 },
      { month: 'Jun', revenue: 182000, orders: 62 },
      { month: 'Jul', revenue: 210000, orders: 74 },
      { month: 'Aug', revenue: 265000, orders: 95 },
      { month: 'Sep', revenue: 320000, orders: 118 },
      { month: 'Oct', revenue: 385000, orders: 142 },
    ];

    const stats = {
      totalUsers,
      totalCustomers,
      totalVendors,
      pendingVendors,
      totalDrivers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingDeliveries,
      pendingBookings,
      pendingServiceRequests,
      revenueByMonth,
      recentUsers: db.users.slice(0, 5).map(sanitizeUser),
      recentOrders: db.orders.slice(0, 5),
      recentDeliveries: db.deliveries.slice(0, 5),
      recentBookings: db.vehicleBookings.slice(0, 5),
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
