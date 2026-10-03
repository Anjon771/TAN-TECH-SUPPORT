import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const db = getDb();
    let notifications = [...db.notifications];

    if (userId) {
      notifications = notifications.filter((n) => n.userId === userId);
    }

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, userId, markAll } = body;

    const db = getDb();

    if (markAll && userId) {
      db.notifications.forEach((n) => {
        if (n.userId === userId) n.read = true;
      });
    } else if (id) {
      const notif = db.notifications.find((n) => n.id === id);
      if (notif) notif.read = true;
    }

    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
