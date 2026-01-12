import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
  try {
    const {
      companyName,
      email,
      phone,
      address,
      pacraNumber,
      description,
      category,
      fullName,
      password,
      planId,
      subscriptionType,
    } = await request.json();

    // Validation
    if (!companyName || !email || !phone || !address || !pacraNumber || !category || !fullName || !password || !planId || !subscriptionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Check if PACRA number already exists
    const [existingVendors] = await pool.query<RowDataPacket[]>('SELECT id FROM vendors WHERE pacra_number = ?', [pacraNumber]);
    if (existingVendors.length > 0) {
      return NextResponse.json({ error: 'PACRA number already registered' }, { status: 409 });
    }

    // Get subscription plan details
    const [plans] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, price_monthly, price_yearly FROM subscription_plans WHERE id = ? AND is_active = TRUE',
      [planId]
    );

    if (plans.length === 0) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 });
    }

    const plan = plans[0];
    const subscriptionPrice = subscriptionType === 'monthly' ? plan.price_monthly : plan.price_yearly;

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (subscriptionType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Create user account
      const hashedPassword = await hashPassword(password);
      const [userResult] = await connection.query<ResultSetHeader>(
        'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [fullName, email, hashedPassword, 'vendor_admin']
      );

      const userId = userResult.insertId;

      // 2. Create vendor profile
      const [vendorResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO vendors (
          user_id, name, description, address, contact_email, contact_phone,
          pacra_number, category, status, subscription_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'none')`,
        [userId, companyName, description, address, email, phone, pacraNumber, category]
      );

      const vendorId = vendorResult.insertId;

      // 3. Create subscription record
      await connection.query<ResultSetHeader>(
        `INSERT INTO company_subscriptions (
          vendor_id, plan_id, subscription_type, start_date, end_date,
          status, amount_paid
        ) VALUES (?, ?, ?, ?, ?, 'active', ?)`,
        [vendorId, planId, subscriptionType, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], subscriptionPrice]
      );

      // 4. Update vendor with subscription info
      await connection.query(
        'UPDATE vendors SET subscription_id = LAST_INSERT_ID(), subscription_status = ?, subscription_end_date = ? WHERE id = ?',
        ['active', endDate.toISOString().split('T')[0], vendorId]
      );

      await connection.commit();

      // Create session for the new user
      await createSession(userId, 'vendor_admin');

      return NextResponse.json({
        message: 'Company registration submitted successfully. Your account will be reviewed by our administrators.',
        role: 'vendor_admin'
      }, { status: 201 });

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Company registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
