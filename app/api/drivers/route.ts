import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vehicleType = searchParams.get('vehicleType');
    const status = searchParams.get('status');

    const db = getDb();
    let drivers = [...db.drivers];

    if (vehicleType) {
      drivers = drivers.filter((d) => d.vehicleType === vehicleType);
    }
    if (status) {
      drivers = drivers.filter((d) => d.status === status);
    }

    return NextResponse.json({ drivers });
  } catch (error) {
    console.error('Drivers GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, vehicleModel, licensePlate, phone } = body;

    if (!id) {
      return NextResponse.json({ error: 'Driver ID required' }, { status: 400 });
    }

    const db = getDb();
    const idx = db.drivers.findIndex((d) => d.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    if (status) db.drivers[idx].status = status;
    if (vehicleModel) db.drivers[idx].vehicleModel = vehicleModel;
    if (licensePlate) db.drivers[idx].licensePlate = licensePlate;
    if (phone) db.drivers[idx].phone = phone;

    saveDb(db);

    return NextResponse.json({ success: true, driver: db.drivers[idx] });
  } catch (error) {
    console.error('Drivers PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
