import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Count pending loans
        const [loanRows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) as count FROM loan_applications WHERE status = 'pending'`
        );
        const pendingLoans = loanRows[0].count;

        // Get recent pending loans details (limit 5)
        const [recentLoans] = await pool.query<RowDataPacket[]>(
            `SELECT l.id, u.full_name, l.applied_at 
             FROM loan_applications l 
             JOIN users u ON l.user_id = u.id 
             WHERE l.status = 'pending' 
             ORDER BY l.applied_at DESC LIMIT 5`
        );

        // Count pending vendors
        const [vendorRows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) as count FROM vendors WHERE status = 'pending'`
        );
        const pendingVendors = vendorRows[0].count;

        // Get recent pending vendors details (limit 5)
        const [recentVendors] = await pool.query<RowDataPacket[]>(
            `SELECT id, name, created_at 
             FROM vendors 
             WHERE status = 'pending' 
             ORDER BY created_at DESC LIMIT 5`
        );

        return NextResponse.json({
            counts: {
                loans: pendingLoans,
                vendors: pendingVendors,
                total: pendingLoans + pendingVendors
            },
            recent: {
                loans: recentLoans,
                vendors: recentVendors
            }
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
