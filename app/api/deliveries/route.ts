import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb } from '@/lib/db';
import { DeliveryRequest, DeliveryStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingNumber = searchParams.get('trackingNumber');
    const customerId = searchParams.get('customerId');
    const driverId = searchParams.get('driverId');
    const status = searchParams.get('status');

    const db = getDb();

    // If searching by tracking number (e.g. from hero search or tracking page)
    if (trackingNumber) {
      const delivery = db.deliveries.find(
        (d) => d.trackingNumber.trim().toUpperCase() === trackingNumber.trim().toUpperCase()
      );
      if (!delivery) {
        return NextResponse.json({ error: 'No shipment found with this tracking number' }, { status: 404 });
      }
      return NextResponse.json({ delivery });
    }

    let items = [...db.deliveries];

    if (customerId) {
      items = items.filter((d) => d.customerId === customerId);
    }
    if (driverId) {
      items = items.filter((d) => d.assignedDriverId === driverId);
    }
    if (status) {
      items = items.filter((d) => d.status === status);
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ deliveries: items });
  } catch (error) {
    console.error('Deliveries GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      deliveryType = 'pickup_and_drop',
      senderName,
      senderPhone,
      pickupAddress,
      receiverName,
      receiverPhone,
      deliveryAddress,
      packageType,
      packageWeight = '1 kg',
      preferredPickupTime = 'Immediate',
      scheduledDeliveryDate,
      notes,
      fare,
    } = body;

    if (!senderName || !senderPhone || !pickupAddress || !receiverName || !receiverPhone || !deliveryAddress) {
      return NextResponse.json(
        { error: 'All sender and receiver contact details and addresses are required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const trackingNumber = `TTS-DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const calculatedFare = fare ? Number(fare) : db.settings.deliveryBaseRate + (packageWeight.includes('5') ? 60 : 40);

    // Assign default driver
    const availableDriver = db.drivers.find((d) => d.status === 'available') || db.drivers[0];

    const newDelivery: DeliveryRequest = {
      id: `del-${crypto.randomUUID().slice(0, 8)}`,
      trackingNumber,
      customerId: customerId || 'guest',
      deliveryType,
      senderName,
      senderPhone,
      pickupAddress,
      receiverName,
      receiverPhone,
      deliveryAddress,
      packageType: packageType || 'General Parcel / Box',
      packageWeight,
      preferredPickupTime,
      scheduledDeliveryDate,
      notes,
      fare: calculatedFare,
      status: 'requested',
      assignedDriverId: availableDriver?.id,
      assignedDriverName: availableDriver?.name,
      assignedDriverPhone: availableDriver?.phone,
      timeline: [
        {
          status: 'requested',
          title: 'Pickup Request Logged',
          description: `Dispatched to nearest Tan Tech rider. Pickup scheduled from ${pickupAddress}.`,
          timestamp: new Date().toISOString(),
          completed: true,
        },
        {
          status: 'accepted',
          title: 'Request Accepted by Dispatch',
          description: `Assigned to delivery partner ${availableDriver?.name || 'Assigned Courier'}.`,
          timestamp: new Date().toISOString(),
          completed: true,
        },
        {
          status: 'pickup_assigned',
          title: 'Rider En Route to Pickup',
          description: 'Courier is moving towards pickup location.',
          timestamp: '',
          completed: false,
        },
        {
          status: 'picked_up',
          title: 'Package Collected & Verified',
          description: 'Package picked up and in secure transit.',
          timestamp: '',
          completed: false,
        },
        {
          status: 'in_transit',
          title: 'In Transit to Destination',
          description: `Heading towards ${deliveryAddress}.`,
          timestamp: '',
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Delivered to Recipient',
          description: 'Signed for and successfully delivered.',
          timestamp: '',
          completed: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.deliveries.unshift(newDelivery);

    if (customerId && customerId !== 'guest') {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: customerId,
        title: 'Delivery Request Created',
        message: `Pickup & Drop request logged with Tracking Code: ${trackingNumber}. Estimated fare: ৳${calculatedFare}.`,
        type: 'delivery',
        link: `/delivery?track=${trackingNumber}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      delivery: newDelivery,
      trackingNumber,
      message: `Pickup & Drop request confirmed! Tracking ID: ${trackingNumber}`,
    });
  } catch (error) {
    console.error('Deliveries POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, driverId, driverName, driverPhone } = body;

    if (!id) {
      return NextResponse.json({ error: 'Delivery ID required' }, { status: 400 });
    }

    const db = getDb();
    const idx = db.deliveries.findIndex((d) => d.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    if (status) {
      db.deliveries[idx].status = status as DeliveryStatus;
      // Update timeline
      const stepIdx = db.deliveries[idx].timeline.findIndex((t) => t.status === status);
      if (stepIdx !== -1) {
        db.deliveries[idx].timeline[stepIdx].completed = true;
        db.deliveries[idx].timeline[stepIdx].timestamp = new Date().toISOString();
        // Mark previous steps as completed
        for (let i = 0; i <= stepIdx; i++) {
          db.deliveries[idx].timeline[i].completed = true;
          if (!db.deliveries[idx].timeline[i].timestamp) {
            db.deliveries[idx].timeline[i].timestamp = new Date().toISOString();
          }
        }
      }
    }

    if (driverId) db.deliveries[idx].assignedDriverId = driverId;
    if (driverName) db.deliveries[idx].assignedDriverName = driverName;
    if (driverPhone) db.deliveries[idx].assignedDriverPhone = driverPhone;
    db.deliveries[idx].updatedAt = new Date().toISOString();

    // Customer Notification
    if (db.deliveries[idx].customerId && db.deliveries[idx].customerId !== 'guest') {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: db.deliveries[idx].customerId,
        title: `Shipment Update: ${db.deliveries[idx].trackingNumber}`,
        message: `Status is now: ${status.replace('_', ' ').toUpperCase()}`,
        type: 'delivery',
        link: `/delivery?track=${db.deliveries[idx].trackingNumber}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);

    return NextResponse.json({ success: true, delivery: db.deliveries[idx] });
  } catch (error) {
    console.error('Deliveries PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
