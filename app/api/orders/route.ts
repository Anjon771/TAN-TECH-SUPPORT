import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb } from '@/lib/db';
import { Order, DeliveryRequest } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status');

    const db = getDb();
    let orders = [...db.orders];

    if (customerId) {
      orders = orders.filter((o) => o.customerId === customerId);
    }

    if (vendorId) {
      orders = orders.filter((o) => o.items.some((item) => item.vendorId === vendorId));
    }

    if (status) {
      orders = orders.filter((o) => o.orderStatus === status);
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      deliveryFee,
      discount = 0,
      totalAmount,
      deliveryAddress,
      paymentMethod = 'cod',
    } = body;

    if (!items || items.length === 0 || !customerName || !customerPhone || !deliveryAddress?.address) {
      return NextResponse.json(
        { error: 'Order must contain items, customer details, and a valid delivery address.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const orderNumber = `TTS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TTS-DEL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${crypto.randomUUID().slice(0, 8)}`,
      orderNumber,
      customerId: customerId || 'guest',
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      items,
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee) || 60,
      discount: Number(discount) || 0,
      totalAmount: Number(totalAmount),
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'card' ? 'paid' : 'pending',
      orderStatus: 'processing',
      trackingNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Decrement stock and calculate vendor revenue
    items.forEach((item: any) => {
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
      const vendor = db.vendors.find((v) => v.id === item.vendorId);
      if (vendor) {
        vendor.totalSales += item.quantity;
        vendor.revenue += item.price * item.quantity;
      }
    });

    // Auto-create Delivery record for Tan Tech Delivery tracking
    const newDelivery: DeliveryRequest = {
      id: `del-${crypto.randomUUID().slice(0, 8)}`,
      trackingNumber,
      customerId: customerId || 'guest',
      deliveryType: 'product_delivery',
      senderName: 'TAN TECH SUPPORT Hub',
      senderPhone: '+880 1711-234567',
      pickupAddress: 'Shop 14, Tech Commercial Center, GEC Circle',
      receiverName: customerName,
      receiverPhone: customerPhone,
      deliveryAddress: `${deliveryAddress.address}, ${deliveryAddress.city || 'Chittagong'}`,
      packageType: `Marketplace Order (${items.map((i: any) => i.productName).join(', ').slice(0, 50)}...)`,
      packageWeight: 'Standard Parcel',
      preferredPickupTime: 'Immediate Express Dispatch',
      fare: Number(deliveryFee) || 60,
      status: 'accepted',
      assignedDriverId: 'drv-2',
      assignedDriverName: 'Karim Ullah',
      assignedDriverPhone: '+880 1833-445566',
      timeline: [
        {
          status: 'requested',
          title: 'Order Placed & Delivery Generated',
          description: `Order #${orderNumber} processed by Tan Tech Logistics.`,
          timestamp: new Date().toISOString(),
          completed: true,
        },
        {
          status: 'accepted',
          title: 'Dispatch Confirmed',
          description: 'Package queued for rider pickup at Tan Tech Hub.',
          timestamp: new Date().toISOString(),
          completed: true,
        },
        {
          status: 'picked_up',
          title: 'Parcel Picked Up by Courier',
          description: 'Courier Karim Ullah has received the items.',
          timestamp: '',
          completed: false,
        },
        {
          status: 'in_transit',
          title: 'In Transit to Destination',
          description: 'On route to customer address.',
          timestamp: '',
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Delivered to recipient.',
          timestamp: '',
          completed: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    db.deliveries.unshift(newDelivery);

    // Customer Notification
    if (customerId && customerId !== 'guest') {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: customerId,
        title: 'Order Confirmed! #' + orderNumber,
        message: `Your order for ৳${totalAmount} has been confirmed. Track your delivery with code ${trackingNumber}.`,
        type: 'order',
        link: '/account',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      order: newOrder,
      trackingNumber,
      message: `Order #${orderNumber} placed successfully!`,
    });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, orderStatus, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const db = getDb();
    const idx = db.orders.findIndex((o) => o.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (orderStatus) db.orders[idx].orderStatus = orderStatus;
    if (paymentStatus) db.orders[idx].paymentStatus = paymentStatus;
    db.orders[idx].updatedAt = new Date().toISOString();

    // If order status changes to delivered, update associated delivery
    if (orderStatus === 'delivered' && db.orders[idx].trackingNumber) {
      const del = db.deliveries.find((d) => d.trackingNumber === db.orders[idx].trackingNumber);
      if (del) {
        del.status = 'delivered';
        del.updatedAt = new Date().toISOString();
        const deliveredStep = del.timeline.find((t) => t.status === 'delivered');
        if (deliveredStep) {
          deliveredStep.completed = true;
          deliveredStep.timestamp = new Date().toISOString();
        }
      }
    }

    saveDb(db);

    return NextResponse.json({ success: true, order: db.orders[idx] });
  } catch (error) {
    console.error('Orders PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
