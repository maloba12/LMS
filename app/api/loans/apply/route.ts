import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

const MIN_LOAN = 500;
const MAX_LOAN = 50000;
const AFFORDABILITY_RATIO = 0.5; // 50%

export async function POST(request: Request) {
    const connection = await pool.getConnection();
    let requestBody: any = {};
    try {
        const session = await getSession();
        if (!session || session.role !== 'customer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        requestBody = await request.json();
        const { amount, purpose, repayment_period_months, declared_employment_status, declared_monthly_income, terms_accepted } = requestBody;

        // Basic field validation
        if (!amount || !purpose || !repayment_period_months || declared_employment_status === undefined || declared_monthly_income === undefined || !terms_accepted) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (amount <= 0 || repayment_period_months <= 0 || declared_monthly_income <= 0) {
            return NextResponse.json({ error: 'Amount, repayment period, and income must be positive' }, { status: 400 });
        }

        if (amount < MIN_LOAN || amount > MAX_LOAN) {
            return NextResponse.json({ error: `Loan amount must be between K${MIN_LOAN} and K${MAX_LOAN}` }, { status: 400 });
        }

        await connection.beginTransaction();

        // 1. Profile completeness
        const [profiles] = await connection.query<RowDataPacket[]>(
            'SELECT phone_number, national_id, residential_address, employment_status, monthly_income FROM customer_profiles WHERE user_id = ? FOR UPDATE',
            [session.userId]
        );
        const profile = profiles[0];
        const requiredProfileFields = ['phone_number', 'national_id', 'residential_address', 'employment_status', 'monthly_income'];
        const missing = requiredProfileFields.filter(f => !profile || !profile[f]);
        if (missing.length) {
            await connection.rollback();
            console.error('Profile check failed. Missing fields:', missing, 'Profile:', profile);
            return NextResponse.json({ error: 'Complete your profile before applying for a loan' }, { status: 400 });
        }

        // 2. Required documents (CV and ID)
        const [docs] = await connection.query<RowDataPacket[]>(
            'SELECT doc_type FROM documents WHERE user_id = ?',
            [session.userId]
        );
        const docTypes = new Set(docs.map((d: any) => d.doc_type));
        if (!docTypes.has('cv') || !docTypes.has('id')) {
            await connection.rollback();
            console.error('Documents check failed. Found docTypes:', Array.from(docTypes), 'Docs:', docs);
            return NextResponse.json({ error: 'Upload both CV and National ID before applying' }, { status: 400 });
        }

        // 3. Active loan check (prevent duplicate)
        const [existingLoans] = await connection.query<RowDataPacket[]>(
            'SELECT id FROM loan_applications WHERE user_id = ? AND status IN (?, ?) FOR UPDATE',
            [session.userId, 'pending', 'approved']
        );
        if (existingLoans.length > 0) {
            await connection.rollback();
            return NextResponse.json({ error: 'You already have an active loan application' }, { status: 400 });
        }

        // 4. Employment status rule
        if (declared_employment_status === 'unemployed') {
            await connection.rollback();
            return NextResponse.json({ error: 'Employment status must not be "unemployed"' }, { status: 400 });
        }

        // 5. Affordability calculation
        const maxAffordable = declared_monthly_income * repayment_period_months * AFFORDABILITY_RATIO;
        if (amount > maxAffordable) {
            await connection.rollback();
            return NextResponse.json({ error: `Requested amount exceeds affordable limit of K${maxAffordable.toFixed(2)}` }, { status: 400 });
        }

        // Insert loan application with qualification details
        await connection.query(
            `INSERT INTO loan_applications (
                user_id, loan_amount, loan_purpose, repayment_period_months,
                declared_employment_status, declared_monthly_income, terms_accepted,
                affordability_ratio, max_affordable_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [session.userId, amount, purpose, repayment_period_months, declared_employment_status, declared_monthly_income, terms_accepted, AFFORDABILITY_RATIO, maxAffordable]
        );

        await connection.commit();
        return NextResponse.json({ message: 'Loan application submitted successfully' }, { status: 201 });
    } catch (error) {
        await connection.rollback();
        console.error('Loan application error:', error);
        console.error('Request body:', requestBody);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
