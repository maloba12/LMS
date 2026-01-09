import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const location = searchParams.get('location'); // Checking address for now

        let query = `
            SELECT id, name, description, logo_url, category, address, interest_rate_range, status 
            FROM vendors 
            WHERE status = 'approved'
        `;
        const params: any[] = [];

        if (category) {
            query += ` AND category = ?`;
            params.push(category);
        }

        if (search) {
            query += ` AND name LIKE ?`;
            params.push(`%${search}%`);
        }
        
        if (location) {
             query += ` AND address LIKE ?`;
             params.push(`%${location}%`);
        }

        // We might want to compute min/max interest rates from products dynamically, simplified for now
        // Or we can join loan_products to get rate ranges.
        // Let's stick to basic vendor data first.

        const [rows] = await pool.query<RowDataPacket[]>(query, params);

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            name, description, logo_url, pacra_number, boz_license_number,
            address, contact_email, contact_phone, website_url, category
        } = body;

        // Validation
        if (!name || !category || !pacra_number) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // update user role to vendor_admin (pending approval?)
            // Or maybe we treat them as vendor_admin immediately? 
            // Let's assume the user applying becomes the vendor owner.
            
            // Check if user already has a vendor profile
            const [existing] = await connection.query<RowDataPacket[]>(
                'SELECT id FROM vendors WHERE user_id = ?', 
                [session.userId]
            );
            
            if (existing.length > 0) {
                 await connection.rollback();
                 return NextResponse.json({ error: 'User already has a vendor profile' }, { status: 400 });
            }

            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO vendors (
                    user_id, name, description, logo_url, pacra_number, boz_license_number,
                    address, contact_email, contact_phone, website_url, category, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
                [
                    session.userId, name, description, logo_url, pacra_number, boz_license_number,
                    address, contact_email, contact_phone, website_url, category
                ]
            );

            // Update user role
            await connection.query(
                'UPDATE users SET role = ? WHERE id = ?',
                ['vendor_admin', session.userId]
            );

            await connection.commit();

            return NextResponse.json({ message: 'Vendor application submitted', vendorId: result.insertId }, { status: 201 });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error creating vendor:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
