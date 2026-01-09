import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const [vendors] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM vendors WHERE id = ?', 
            [id]
        );

        if (vendors.length === 0) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        const vendor = vendors[0];

        // Fetch active products
        const [products] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM loan_products WHERE vendor_id = ? AND is_active = TRUE',
            [id]
        );
        
        // Fetch reviews summary (optional, or separate call)
        const [reviews] = await pool.query<RowDataPacket[]>(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM vendor_reviews WHERE vendor_id = ?',
            [id]
        );

        return NextResponse.json({
            ...vendor,
            products,
            rating: reviews[0].avg_rating || 0,
            review_count: reviews[0].count || 0
        });

    } catch (error) {
        console.error('Error fetching vendor details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { id } = await params;
        const body = await req.json();

        // Check ownership
        const [vendor] = await pool.query<RowDataPacket[]>(
            'SELECT user_id FROM vendors WHERE id = ?',
            [id]
        );

        if (vendor.length === 0) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        
        if (session.role !== 'admin' && vendor[0].user_id !== session.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update fields
        const {
            name, description, logo_url, address, contact_email, contact_phone, website_url
        } = body;
        
        await pool.query(
            `UPDATE vendors SET 
                name = ?, description = ?, logo_url = ?, address = ?, 
                contact_email = ?, contact_phone = ?, website_url = ?
            WHERE id = ?`,
            [name, description, logo_url, address, contact_email, contact_phone, website_url, id]
        );

        return NextResponse.json({ message: 'Vendor updated successfully' });

    } catch (error) {
        console.error('Error updating vendor:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
