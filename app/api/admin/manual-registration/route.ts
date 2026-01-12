import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      companyName,
      email,
      phone,
      address,
      pacraNumber,
      bozLicenseNumber,
      description,
      category,
      websiteUrl,
      contactName,
      contactEmail,
      contactPhone,
      accountEmail,
      tempPassword,
      planId,
      subscriptionType,
      documentUrls = [],
    } = body;

    // Validation
    if (!companyName || !phone || !address || !pacraNumber || !category || !accountEmail || !tempPassword || !planId || !subscriptionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [accountEmail]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'Account email already exists' }, { status: 409 });
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
      const hashedPassword = await hashPassword(tempPassword);
      const [userResult] = await connection.query<ResultSetHeader>(
        'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [contactName || 'Contact Person', accountEmail, hashedPassword, 'vendor_admin']
      );

      const userId = userResult.insertId;

      // 2. Create vendor profile (immediately approved for manual registration)
      const [vendorResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO vendors (
          user_id, name, description, logo_url, pacra_number, boz_license_number,
          address, contact_email, contact_phone, website_url, category, status,
          subscription_status, subscription_end_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 'active', ?)`,
        [
          userId, companyName, description, null, pacraNumber, bozLicenseNumber || null,
          address, contactEmail || email || accountEmail, contactPhone || phone, websiteUrl || null, category,
          endDate.toISOString().split('T')[0]
        ]
      );

      const vendorId = vendorResult.insertId;

      // 3. Create subscription record
      const [subscriptionResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO company_subscriptions (
          vendor_id, plan_id, subscription_type, start_date, end_date,
          status, amount_paid
        ) VALUES (?, ?, ?, ?, ?, 'active', ?)`,
        [vendorId, planId, subscriptionType, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], subscriptionPrice]
      );

      // 4. Update vendor with subscription ID
      await connection.query(
        'UPDATE vendors SET subscription_id = ? WHERE id = ?',
        [subscriptionResult.insertId, vendorId]
      );

      // 5. Store document references if provided
      if (documentUrls.length > 0) {
        for (let i = 0; i < documentUrls.length; i++) {
          await connection.query(
            'INSERT INTO documents (user_id, file_path, file_type, doc_type) VALUES (?, ?, ?, ?)',
            [userId, documentUrls[i], 'application/pdf', 'other']
          );
        }
      }

      await connection.commit();

      return NextResponse.json({
        message: 'Company registered successfully and account activated',
        vendorId,
        userId
      }, { status: 201 });

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Manual company registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
