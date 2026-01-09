import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [vendors] = await pool.query<RowDataPacket[]>(
            `SELECT v.*, u.full_name as owner_name 
             FROM vendors v
             JOIN users u ON v.user_id = u.id
             ORDER BY v.created_at DESC`
        );

        return NextResponse.json(vendors);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { vendor_id, status } = body; // 'approved' or 'rejected'

        if (!vendor_id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await pool.query(
            'UPDATE vendors SET status = ? WHERE id = ?',
            [status, vendor_id]
        );

        return NextResponse.json({ message: `Vendor ${status} successfully` });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
