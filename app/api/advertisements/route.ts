import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb } from '@/lib/db';
import { Advertisement } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get('placement');
    const all = searchParams.get('all');

    const db = getDb();
    let ads = [...db.advertisements];

    if (all !== 'true') {
      ads = ads.filter((a) => a.isActive);
    }

    if (placement) {
      ads = ads.filter((a) => a.placement === placement);
    }

    return NextResponse.json({ advertisements: ads });
  } catch (error) {
    console.error('Ads GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subtitle, badge, bannerUrl, targetUrl, ctaText, placement, startDate, endDate, isActive } = body;

    if (!title || !bannerUrl) {
      return NextResponse.json({ error: 'Title and banner image URL are required' }, { status: 400 });
    }

    const db = getDb();
    const newAd: Advertisement = {
      id: `ad-${crypto.randomUUID().slice(0, 8)}`,
      title,
      subtitle: subtitle || '',
      badge: badge || 'Promo',
      bannerUrl,
      targetUrl: targetUrl || '/services',
      ctaText: ctaText || 'Learn More',
      placement: placement || 'hero',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      isActive: isActive !== undefined ? !!isActive : true,
      clicks: 0,
    };

    db.advertisements.unshift(newAd);
    saveDb(db);

    return NextResponse.json({ success: true, advertisement: newAd });
  } catch (error) {
    console.error('Ads POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, click, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ad ID required' }, { status: 400 });
    }

    const db = getDb();
    const idx = db.advertisements.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    if (click) {
      db.advertisements[idx].clicks += 1;
    } else {
      db.advertisements[idx] = { ...db.advertisements[idx], ...updates };
    }

    saveDb(db);
    return NextResponse.json({ success: true, advertisement: db.advertisements[idx] });
  } catch (error) {
    console.error('Ads PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Ad ID required' }, { status: 400 });
    }

    const db = getDb();
    db.advertisements = db.advertisements.filter((a) => a.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, message: 'Ad deleted' });
  } catch (error) {
    console.error('Ads DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
