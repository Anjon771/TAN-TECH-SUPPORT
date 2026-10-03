import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb } from '@/lib/db';
import { ServiceRequest } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const db = getDb();
    let requests = [...db.serviceRequests];

    if (customerId) {
      requests = requests.filter((r) => r.customerId === customerId);
    }
    if (category) {
      requests = requests.filter((r) => r.category === category);
    }
    if (status) {
      requests = requests.filter((r) => r.status === status);
    }

    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('ServiceRequests GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceId,
      serviceTitle,
      category,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      serviceType,
      quantity,
      requirements,
      deadline,
      estimatedCost,
      attachmentName,
    } = body;

    if (!serviceTitle || !customerName || !customerPhone || !requirements) {
      return NextResponse.json(
        { error: 'Service title, customer name, contact phone, and requirements details are required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const requestNumber = `TTS-SRV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: ServiceRequest = {
      id: `srv-req-${crypto.randomUUID().slice(0, 8)}`,
      requestNumber,
      serviceId: serviceId || 'srv-custom',
      serviceTitle,
      category: category || 'printing',
      customerId: customerId || 'guest',
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      serviceType: serviceType || 'Custom Request',
      quantity: quantity ? Number(quantity) : 1,
      requirements,
      deadline: deadline || 'Within 48 hours',
      estimatedCost: estimatedCost ? Number(estimatedCost) : undefined,
      attachmentName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.serviceRequests.unshift(newRequest);

    // Notification for customer
    if (customerId && customerId !== 'guest') {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: customerId,
        title: 'Service Request Submitted',
        message: `Your request #${requestNumber} for ${serviceTitle} has been received. Our team will contact you shortly.`,
        type: 'service',
        link: '/account',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: `Your service request #${requestNumber} has been received successfully!`,
    });
  } catch (error) {
    console.error('ServiceRequests POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, adminNotes, estimatedCost } = body;

    if (!id) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 });
    }

    const db = getDb();
    const idx = db.serviceRequests.findIndex((r) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 });
    }

    if (status) db.serviceRequests[idx].status = status;
    if (adminNotes !== undefined) db.serviceRequests[idx].adminNotes = adminNotes;
    if (estimatedCost !== undefined) db.serviceRequests[idx].estimatedCost = Number(estimatedCost);
    db.serviceRequests[idx].updatedAt = new Date().toISOString();

    // Notify customer
    if (db.serviceRequests[idx].customerId && db.serviceRequests[idx].customerId !== 'guest') {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: db.serviceRequests[idx].customerId,
        title: `Service Request Update: ${db.serviceRequests[idx].requestNumber}`,
        message: `Status changed to ${status.replace('_', ' ').toUpperCase()}${adminNotes ? `: "${adminNotes}"` : ''}`,
        type: 'service',
        link: '/account',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);

    return NextResponse.json({ success: true, request: db.serviceRequests[idx] });
  } catch (error) {
    console.error('ServiceRequests PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
