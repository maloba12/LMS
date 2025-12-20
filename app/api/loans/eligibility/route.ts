import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

const MIN_LOAN = 500;
const MAX_LOAN = 50000;
const AFFORDABILITY_RATIO = 0.5; // 50%

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'customer') {
            return NextResponse.json({ eligible: false, checks: [{ ok: false, message: 'Unauthorized or not a customer' }], limits: { min: MIN_LOAN, max: MAX_LOAN } }, { status: 401 });
        }

        const checks: { ok: boolean; message: string }[] = [];

        // 1. Profile completeness
        let profile = null;
        try {
            const [profiles] = await pool.query<RowDataPacket[]>(
                'SELECT phone_number, national_id, residential_address, employment_status, monthly_income FROM customer_profiles WHERE user_id = ?',
                [session.userId]
            );
            profile = profiles[0];
        } catch (err) {
            console.error('Profile query error:', err);
            checks.push({ ok: false, message: 'Error checking profile completeness' });
        }

        if (profile) {
            const requiredProfileFields = ['phone_number', 'national_id', 'residential_address', 'employment_status', 'monthly_income'];
            const missing = requiredProfileFields.filter(f => !profile || !profile[f]);
            if (missing.length) {
                checks.push({ ok: false, message: 'Complete your profile to apply for a loan' });
            } else {
                checks.push({ ok: true, message: 'Profile complete' });
            }
        } else {
            checks.push({ ok: false, message: 'Complete your profile to apply for a loan' });
        }

        // 2. Required documents (CV and ID)
        try {
            const [docs] = await pool.query<RowDataPacket[]>(
                'SELECT doc_type FROM documents WHERE user_id = ?',
                [session.userId]
            );
            const docTypes = new Set(docs.map((d: any) => d.doc_type));
            if (!docTypes.has('cv')) checks.push({ ok: false, message: 'Upload your CV before applying' });
            else checks.push({ ok: true, message: 'CV uploaded' });
            if (!docTypes.has('id')) checks.push({ ok: false, message: 'Upload your National ID before applying' });
            else checks.push({ ok: true, message: 'National ID uploaded' });
        } catch (err) {
            console.error('Documents query error:', err);
            checks.push({ ok: false, message: 'Error checking document uploads' });
        }

        // 3. Active loan check
        try {
            const [activeLoans] = await pool.query<RowDataPacket[]>(
                'SELECT status FROM loan_applications WHERE user_id = ? AND status IN (?, ?)',
                [session.userId, 'pending', 'approved']
            );
            if (activeLoans.length) {
                const status = activeLoans[0].status;
                if (status === 'approved') {
                    checks.push({ ok: false, message: 'You already have an approved loan. View your loan status for details.' });
                } else {
                    checks.push({ ok: false, message: 'You already have a loan application under review' });
                }
            } else {
                checks.push({ ok: true, message: 'No active loans' });
            }
        } catch (err) {
            console.error('Active loans query error:', err);
            checks.push({ ok: false, message: 'Error checking active loans' });
        }

        // 4. Employment status rule
        if (profile?.employment_status === 'unemployed') {
            checks.push({ ok: false, message: 'Employment status must not be "unemployed"' });
        } else if (profile?.employment_status) {
            checks.push({ ok: true, message: 'Employment status acceptable' });
        }

        // 5. Affordability calculation (if income present)
        if (profile?.monthly_income) {
            const maxAffordable = profile.monthly_income * AFFORDABILITY_RATIO * 12; // 1-year baseline
            checks.push({ ok: true, message: `Maximum affordable amount: K${maxAffordable.toFixed(2)}` });
        }

        const eligible = checks.every(c => c.ok);
        return NextResponse.json({ eligible, checks, limits: { min: MIN_LOAN, max: MAX_LOAN } });
    } catch (error) {
        console.error('Eligibility check error:', error);
        return NextResponse.json({ eligible: false, checks: [{ ok: false, message: 'Server error checking eligibility' }], limits: { min: MIN_LOAN, max: MAX_LOAN }, error: 'Internal server error' }, { status: 500 });
    }
}
