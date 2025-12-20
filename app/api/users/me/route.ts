import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'customer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [users] = await pool.query<RowDataPacket[]>(
            'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
            [session.userId]
        );
        if (!users.length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const [profiles] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM customer_profiles WHERE user_id = ?',
            [session.userId]
        );
        const profile = profiles[0] || {};

        return NextResponse.json({ user: users[0], profile });
    } catch (error) {
        console.error('Get me error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'customer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { phone_number, national_id, residential_address, employment_status, monthly_income } = body;

        await pool.query(
            `INSERT INTO customer_profiles (user_id, phone_number, national_id, residential_address, employment_status, monthly_income)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             phone_number = VALUES(phone_number),
             national_id = VALUES(national_id),
             residential_address = VALUES(residential_address),
             employment_status = VALUES(employment_status),
             monthly_income = VALUES(monthly_income),
             updated_at = CURRENT_TIMESTAMP`,
            [session.userId, phone_number, national_id, residential_address, employment_status, monthly_income]
        );

        return NextResponse.json({ message: 'Profile updated' });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
