import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb } from '@/lib/db';
import { Product } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const vendorId = searchParams.get('vendorId');
    const featured = searchParams.get('featured');

    const db = getDb();
    let items = [...db.products];

    if (category && category !== 'all') {
      items = items.filter((p) => p.category === category);
    }

    if (vendorId) {
      items = items.filter((p) => p.vendorId === vendorId);
    }

    if (featured === 'true') {
      items = items.filter((p) => p.isFeatured);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ products: items });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, originalPrice, category, stock, images, vendorId, vendorName, isFeatured } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Product name, price, and category are required' }, { status: 400 });
    }

    const db = getDb();
    const newProduct: Product = {
      id: `prod-${crypto.randomUUID().slice(0, 8)}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: description || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'],
      stock: Number(stock) || 10,
      vendorId: vendorId || 'ven-1',
      vendorName: vendorName || 'Tan Tech Digital Print & Gadgets Hub',
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: !!isFeatured,
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveDb(db);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Product POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const db = getDb();
    const idx = db.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    db.products[idx] = {
      ...db.products[idx],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : db.products[idx].price,
      stock: updates.stock !== undefined ? Number(updates.stock) : db.products[idx].stock,
    };

    saveDb(db);
    return NextResponse.json({ success: true, product: db.products[idx] });
  } catch (error) {
    console.error('Product PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const db = getDb();
    db.products = db.products.filter((p) => p.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, message: 'Product removed' });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
