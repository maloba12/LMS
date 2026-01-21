import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { DirectusService } from '@/lib/directus-service';

export async function GET(req: NextRequest) {
    try {
        // Fetch products from Directus (New Source of Truth for Metadata/Config)
        const products = await DirectusService.getLoanProducts();

        // ✅ Keep this line as-is
        return NextResponse.json(products);

    } catch (error) {
        console.error('Directus GET error:', error);

        // Fallback to local DB if Directus is down or not configured
        try {
            const [rows] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM loan_products WHERE is_active = TRUE'
            );
            return NextResponse.json(rows);
        } catch (dbError) {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }
}


export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || (session.role !== 'vendor_admin' && session.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            name, description, loan_type, min_amount, max_amount,
            min_tenure_months, max_tenure_months, interest_rate, interest_type,
            processing_fee_percent, min_income_requirement, eligibility_criteria
        } = body;

        // Get Vendor ID for this user
        const [vendor] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM vendors WHERE user_id = ?',
            [session.userId]
        );

        if (vendor.length === 0 && session.role !== 'admin') {
            return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
        }
        
        // Admin might need to pass vendor_id explicitly if creating on behalf of vendor, 
        // but for now let's assume valid vendor_admin
        const vendorId = vendor[0].id;

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO loan_products (
                vendor_id, name, description, loan_type, min_amount, max_amount,
                min_tenure_months, max_tenure_months, interest_rate, interest_type,
                processing_fee_percent, min_income_requirement, eligibility_criteria
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                vendorId, name, description, loan_type, min_amount, max_amount,
                min_tenure_months, max_tenure_months, interest_rate, interest_type,
                processing_fee_percent, min_income_requirement, eligibility_criteria
            ]
        );

        return NextResponse.json({ message: 'Product created', id: result.insertId }, { status: 201 });

    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
