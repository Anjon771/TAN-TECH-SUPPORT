import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb } from '@/lib/db';
import { NewsItem } from '@/lib/types';

export async function GET() {
  try {
    const db = getDb();
    const sorted = [...db.news].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return NextResponse.json({ news: sorted });
  } catch (error) {
    console.error('News GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, excerpt, content, category, youtubeUrl, thumbnailUrl, author } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const db = getDb();
    const newArticle: NewsItem = {
      id: `news-${crypto.randomUUID().slice(0, 8)}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: excerpt || content.slice(0, 150) + '...',
      content,
      category: category || 'Tech News',
      youtubeUrl: youtubeUrl || '',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date().toISOString(),
      author: author || 'TAN TECH SUPPORT Faculty',
    };

    db.news.unshift(newArticle);
    saveDb(db);

    return NextResponse.json({ success: true, item: newArticle });
  } catch (error) {
    console.error('News POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'News ID required' }, { status: 400 });
    }

    const db = getDb();
    db.news = db.news.filter((n) => n.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, message: 'News item deleted' });
  } catch (error) {
    console.error('News DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
