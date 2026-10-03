import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    const db = getDb();

    if (id) {
      const vendor = db.vendors.find((v) => v.id === id);
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
      return NextResponse.json({ vendor });
    }

    let vendors = [...db.vendors];
    if (status) {
      vendors = vendors.filter((v) => v.status === status);
    }

    return NextResponse.json({ vendors });
  } catch (error) {
    console.error('Vendors GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, storeName, phone, address, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    const db = getDb();
    const idx = db.vendors.findIndex((v) => v.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    if (status) db.vendors[idx].status = status;
    if (storeName) db.vendors[idx].storeName = storeName;
    if (phone) db.vendors[idx].phone = phone;
    if (address) db.vendors[idx].address = address;
    if (description) db.vendors[idx].description = description;

    // Notify vendor user
    if (status) {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: db.vendors[idx].userId,
        title: `Vendor Account ${status === 'approved' ? 'Approved!' : 'Status Changed'}`,
        message: status === 'approved' 
          ? 'Congratulations! Your vendor store is approved and live. You can now post products and start selling.' 
          : `Your vendor account status was updated to: ${status}.`,
        type: 'vendor',
        link: '/vendor',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);

    return NextResponse.json({ success: true, vendor: db.vendors[idx] });
  } catch (error) {
    console.error('Vendors PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
