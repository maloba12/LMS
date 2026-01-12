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

        // 4. Application counts
        const [applicationStats] = await connection.query<RowDataPacket[]>(
            `SELECT
                COUNT(*) as total_applications,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
             FROM loan_applications WHERE user_id = ?`,
            [session.userId]
        );

        // 5. Get some recommended loan products
        const [recommendedProducts] = await connection.query<RowDataPacket[]>(
            `SELECT lp.*, v.name as vendor_name, v.logo_url as vendor_logo
             FROM loan_products lp
             JOIN vendors v ON lp.vendor_id = v.id
             WHERE v.status = 'approved' AND lp.is_active = TRUE
             ORDER BY lp.min_amount ASC
             LIMIT 3`
        );

        // 6. Calculate profile completeness
        const profileComplete = profile && profile.phone_number && profile.national_id && profile.residential_address && profile.employment_status && profile.monthly_income;

        // 7. Get notifications/alerts
        const notifications = [];
        if (!docs.payslip) {
            notifications.push({
                id: 'missing_payslip',
                type: 'warning',
                message: 'Upload your payslip to improve loan eligibility',
                action: '/dashboard/customer/uploads/payslip'
            });
        }
        if (!docs.id) {
            notifications.push({
                id: 'missing_id',
                type: 'warning',
                message: 'Upload your national ID to complete verification',
                action: '/dashboard/customer/uploads/id'
            });
        }
        if (!profileComplete) {
            notifications.push({
                id: 'incomplete_profile',
                type: 'info',
                message: 'Complete your profile to unlock all features',
                action: '/dashboard/customer/profile'
            });
        }

        // 7. Calculate eligibility status
        const eligibilityChecks = [
            { name: 'Profile Complete', ok: !!profileComplete },
            { name: 'National ID Uploaded', ok: docs.id },
            { name: 'Payslip Uploaded', ok: docs.payslip },
            { name: 'No Active Loan', ok: !loan }
        ];
        const eligibleChecks = eligibilityChecks.filter(c => c.ok).length;
        let eligibilityStatus = 'not_eligible';
        if (eligibleChecks === 4) eligibilityStatus = 'eligible';
        else if (eligibleChecks >= 2) eligibilityStatus = 'partially_eligible';

        await connection.commit();

        return NextResponse.json({
            user,
            profile,
            loan,
            documents: docs,
            applicationStats: applicationStats[0],
            recommendedProducts,
            notifications,
            eligibility: {
                status: eligibilityStatus,
                checks: eligibilityChecks
            }
        });
    } catch (error) {
        await connection.rollback();
        console.error('Dashboard data fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
