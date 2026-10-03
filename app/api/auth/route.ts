import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getDb, saveDb, hashPassword, verifyPassword, sanitizeUser } from '@/lib/db';
import { UserRecord, Vendor } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const db = getDb();

    if (userId) {
      const user = db.users.find((u) => u.id === userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user: sanitizeUser(user) });
    }

    // Return list of available demo profiles for quick testing/switching
    const demoAccounts = db.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      vendorId: u.vendorId,
      driverId: u.driverId,
    }));

    return NextResponse.json({ users: demoAccounts });
  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const db = getDb();

    if (action === 'login') {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials. User not found.' }, { status: 401 });
      }

      if (!verifyPassword(password, user.passwordHash)) {
        return NextResponse.json({ error: 'Invalid password. Please check and try again.' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: sanitizeUser(user),
        message: `Welcome back, ${user.name}!`,
      });
    }

    if (action === 'quick_switch') {
      const { role } = body;
      const targetUser = db.users.find((u) => u.role === role);
      if (!targetUser) {
        return NextResponse.json({ error: `No user found for role ${role}` }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        user: sanitizeUser(targetUser),
        message: `Switched to ${role.replace('_', ' ').toUpperCase()} mode.`,
      });
    }

    if (action === 'register') {
      const { name, email, password, phone, role = 'customer', storeName, businessDescription, address } = body;
      if (!name || !email || !password) {
        return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
      }

      const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
      }

      const newUserId = `usr-${crypto.randomUUID().slice(0, 8)}`;
      let vendorId: string | undefined = undefined;

      if (role === 'vendor') {
        vendorId = `ven-${crypto.randomUUID().slice(0, 8)}`;
        const newVendor: Vendor = {
          id: vendorId,
          userId: newUserId,
          storeName: storeName || `${name}'s Store`,
          ownerName: name,
          email,
          phone: phone || '',
          address: address || 'Chittagong, Bangladesh',
          category: 'General Digital & Hardware',
          status: 'pending', // Pending admin approval!
          description: businessDescription || 'New vendor store awaiting verification.',
          rating: 5.0,
          totalSales: 0,
          revenue: 0,
          createdAt: new Date().toISOString(),
        };
        db.vendors.push(newVendor);
      }

      const newUser: UserRecord = {
        id: newUserId,
        name,
        email: email.toLowerCase(),
        role: role as any,
        phone: phone || '',
        address: address || '',
        vendorId,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      db.users.push(newUser);

      // Notification
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: newUserId,
        title: 'Welcome to TAN TECH SUPPORT!',
        message: role === 'vendor' 
          ? 'Your vendor registration is received and pending Admin review.' 
          : 'Thank you for registering. You can now order products, request digital services, and book rides!',
        type: 'system',
        read: false,
        createdAt: new Date().toISOString(),
      });

      saveDb(db);

      return NextResponse.json({
        success: true,
        user: sanitizeUser(newUser),
        message: role === 'vendor' 
          ? 'Vendor account registered! An administrator will review your application shortly.' 
          : 'Account created successfully!',
      });
    }

    if (action === 'update_profile') {
      const { userId, name, phone, address } = body;
      const userIdx = db.users.findIndex((u) => u.id === userId);
      if (userIdx === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (name) db.users[userIdx].name = name;
      if (phone) db.users[userIdx].phone = phone;
      if (address) db.users[userIdx].address = address;

      saveDb(db);
      return NextResponse.json({
        success: true,
        user: sanitizeUser(db.users[userIdx]),
        message: 'Profile updated successfully!',
      });
    }

    if (action === 'change_password') {
      const { userId, currentPassword, newPassword } = body;
      const user = db.users.find((u) => u.id === userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (!verifyPassword(currentPassword, user.passwordHash)) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
      }

      user.passwordHash = hashPassword(newPassword);
      saveDb(db);

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully!',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
