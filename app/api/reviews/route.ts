import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'customer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { vendor_id, rating, comment } = body;

        if (!vendor_id || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        // Check if user has a loan with this vendor to verify the review
        // For now, we allow any user to review, but mark as unverified if no loan exists.
        // Or we can enforce "Verified" flag logic.
        
        const [loans] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM loan_applications WHERE user_id = ? AND vendor_id = ? AND status = "approved"',
            [session.userId, vendor_id]
        );

        const isVerified = loans.length > 0;

        await pool.query(
            'INSERT INTO vendor_reviews (vendor_id, user_id, rating, comment, is_verified) VALUES (?, ?, ?, ?, ?)',
            [vendor_id, session.userId, rating, comment, isVerified]
        );

        return NextResponse.json({ message: 'Review submitted successfully', verified: isVerified });

    } catch (error) {
        console.error('Submit review error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
