import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    const connection = await pool.getConnection();
    try {
        const session = await getSession();
        if (!session || session.role !== 'customer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all data in a single transaction
        await connection.beginTransaction();

        // 1. User and profile data
        const [users] = await connection.query<RowDataPacket[]>(
            'SELECT id, full_name, email FROM users WHERE id = ?',
            [session.userId]
        );
        const user = users[0];

        const [profiles] = await connection.query<RowDataPacket[]>(
            'SELECT phone_number, national_id, residential_address, employment_status, monthly_income FROM customer_profiles WHERE user_id = ?',
            [session.userId]
        );
        const profile = profiles[0];

        // 2. Loan data
        const [loans] = await connection.query<RowDataPacket[]>(
            `SELECT la.*, v.name as vendor_name, lp.name as product_name
             FROM loan_applications la
             LEFT JOIN vendors v ON la.vendor_id = v.id
             LEFT JOIN loan_products lp ON la.loan_product_id = lp.id
             WHERE la.user_id = ? 
             ORDER BY la.applied_at DESC LIMIT 1`,
            [session.userId]
        );
        const loan = loans[0] || null;

        // 3. Documents data
        const [documents] = await connection.query<RowDataPacket[]>(
            'SELECT doc_type FROM documents WHERE user_id = ?',
            [session.userId]
        );
        const docTypes = new Set(documents.map((d: any) => d.doc_type));
        const docs = { payslip: docTypes.has('payslip'), id: docTypes.has('id') };

        await connection.commit();

        return NextResponse.json({
            user,
            profile,
            loan,
            documents: docs
        });
    } catch (error) {
        await connection.rollback();
        console.error('Dashboard data fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
