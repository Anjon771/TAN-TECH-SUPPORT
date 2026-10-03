import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb } from '@/lib/db';
import { ServicePackage } from '@/lib/types';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ services: db.services });
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, description, iconName, startingPrice, estimatedDelivery, options, features, popular } = body;

    if (!title || !category || !startingPrice) {
      return NextResponse.json({ error: 'Title, category, and price are required' }, { status: 400 });
    }

    const db = getDb();
    const newService: ServicePackage = {
      id: `srv-${crypto.randomUUID().slice(0, 6)}`,
      title,
      category,
      description: description || '',
      iconName: iconName || 'Wrench',
      startingPrice: Number(startingPrice),
      estimatedDelivery: estimatedDelivery || '24-48 Hours',
      options: options || ['Standard Request'],
      features: features || ['High Quality Guarantee'],
      popular: !!popular,
    };

    db.services.push(newService);
    saveDb(db);

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error('Services POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
