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

        const [loans] = await pool.query<RowDataPacket[]>('SELECT * FROM loan_applications WHERE user_id = ?', [session.userId]);

        return NextResponse.json(loans);
    } catch (error) {
        console.error('Get my loans error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
