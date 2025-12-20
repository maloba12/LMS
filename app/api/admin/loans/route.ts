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

        const [loans] = await pool.query<RowDataPacket[]>(
            `SELECT
                la.id,
                la.user_id,
                u.full_name,
                u.email,
                la.loan_amount,
                la.loan_purpose,
                la.repayment_period_months,
                la.declared_employment_status,
                la.declared_monthly_income,
                la.terms_accepted,
                la.affordability_ratio,
                la.max_affordable_amount,
                la.status,
                la.applied_at,
                la.reviewed_at
            FROM loan_applications la
            JOIN users u ON la.user_id = u.id
            ORDER BY la.applied_at DESC`
        );

        return NextResponse.json(loans);
    } catch (error) {
        console.error('Admin loans fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
