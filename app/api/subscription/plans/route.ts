import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [plans] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, description, price_monthly, price_yearly, features, max_products, max_users, priority_support FROM subscription_plans WHERE is_active = TRUE ORDER BY price_monthly ASC'
    );

    // Parse JSON features for each plan
    const processedPlans = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features as string)
    }));

    return NextResponse.json(processedPlans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
