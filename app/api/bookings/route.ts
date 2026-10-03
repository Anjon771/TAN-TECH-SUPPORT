import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb } from '@/lib/db';
import { VehicleBooking, BookingStatus } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const driverId = searchParams.get('driverId');
    const status = searchParams.get('status');

    const db = getDb();
    let bookings = [...db.vehicleBookings];

    if (customerId) {
      bookings = bookings.filter((b) => b.customerId === customerId);
    }
    if (driverId) {
      bookings = bookings.filter((b) => b.assignedDriverId === driverId);
    }
    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      vehicleType = 'car',
      tripType = 'one_way',
      pickupLocation,
      dropLocation,
      bookingDate,
      bookingTime,
      passengers = 1,
      instructions,
      estimatedFare,
    } = body;

    if (!customerName || !customerPhone || !pickupLocation || !dropLocation || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: 'Customer name, phone, pickup, drop location, date, and time are required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const bookingNumber = `TTS-VEH-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calculate baseline fare if not supplied
    let fare = estimatedFare ? Number(estimatedFare) : 0;
    if (!fare) {
      const baseRates = { cng: 150, car: 450, van: 950 };
      const base = baseRates[vehicleType as 'cng' | 'car' | 'van'] || 300;
      const multiplier = tripType === 'round_trip' ? 1.8 : tripType === 'hourly' ? 2.5 : 1.0;
      fare = Math.round(base * multiplier);
    }

    // Auto-match an available driver of the same vehicle type
    const matchedDriver = db.drivers.find(
      (d) => d.vehicleType === vehicleType && d.status === 'available'
    ) || db.drivers.find((d) => d.vehicleType === vehicleType);

    const newBooking: VehicleBooking = {
      id: `veh-${crypto.randomUUID().slice(0, 8)}`,
      bookingNumber,
      customerId: customerId || 'guest',
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      vehicleType,
      tripType,
      pickupLocation,
      dropLocation,
      bookingDate,
      bookingTime,
      passengers: Number(passengers),
      instructions,
      estimatedFare: fare,
      status: 'pending',
      assignedDriverId: matchedDriver?.id,
      assignedDriverName: matchedDriver?.name,
      assignedDriverPhone: matchedDriver?.phone,
      assignedVehiclePlate: matchedDriver?.licensePlate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.vehicleBookings.unshift(newBooking);

    if (customerId && customerId !== 'guest') {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: customerId,
        title: 'Ride Booking Requested',
        message: `Your ${vehicleType.toUpperCase()} booking #${bookingNumber} is pending confirmation. Estimated Fare: ৳${fare}.`,
        type: 'booking',
        link: '/vehicle-booking',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: `Vehicle booking #${bookingNumber} submitted! Driver dispatch confirmed.`,
    });
  } catch (error) {
    console.error('Bookings POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, driverId, driverName, driverPhone, vehiclePlate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    const db = getDb();
    const idx = db.vehicleBookings.findIndex((b) => b.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (status) db.vehicleBookings[idx].status = status as BookingStatus;
    if (driverId) db.vehicleBookings[idx].assignedDriverId = driverId;
    if (driverName) db.vehicleBookings[idx].assignedDriverName = driverName;
    if (driverPhone) db.vehicleBookings[idx].assignedDriverPhone = driverPhone;
    if (vehiclePlate) db.vehicleBookings[idx].assignedVehiclePlate = vehiclePlate;
    db.vehicleBookings[idx].updatedAt = new Date().toISOString();

    // Customer Notification
    if (db.vehicleBookings[idx].customerId && db.vehicleBookings[idx].customerId !== 'guest') {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: db.vehicleBookings[idx].customerId,
        title: `Ride Update: ${db.vehicleBookings[idx].bookingNumber}`,
        message: `Booking status updated to: ${status.replace(/_/g, ' ').toUpperCase()}`,
        type: 'booking',
        link: '/vehicle-booking',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);

    return NextResponse.json({ success: true, booking: db.vehicleBookings[idx] });
  } catch (error) {
    console.error('Bookings PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
