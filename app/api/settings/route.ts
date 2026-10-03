import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({ settings: db.settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    db.settings = {
      ...db.settings,
      ...body,
      deliveryBaseRate: body.deliveryBaseRate !== undefined ? Number(body.deliveryBaseRate) : db.settings.deliveryBaseRate,
      cngRatePerKm: body.cngRatePerKm !== undefined ? Number(body.cngRatePerKm) : db.settings.cngRatePerKm,
      carRatePerKm: body.carRatePerKm !== undefined ? Number(body.carRatePerKm) : db.settings.carRatePerKm,
      vanRatePerKm: body.vanRatePerKm !== undefined ? Number(body.vanRatePerKm) : db.settings.vanRatePerKm,
    };

    saveDb(db);
    return NextResponse.json({ success: true, settings: db.settings });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
