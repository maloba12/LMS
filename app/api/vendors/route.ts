import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { DirectusService } from '@/lib/directus-service';

export async function GET(req: NextRequest) {
    try {
        // Fetch vendors from Directus (Content & Metadata Source)
        const vendors = await DirectusService.getVendors();
        return NextResponse.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors from Directus:', error);
        // Fallback to local DB
        try {
            const [rows] = await pool.query<RowDataPacket[]>(`
                SELECT id, name, description, logo_url, category, address, status 
                FROM vendors 
                WHERE status = 'approved'
            `);
            return NextResponse.json(rows);
        } catch (dbError) {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
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

            // Notify Directus for Admin Workflow/Approval
            try {
                await DirectusService.createNotification({
                    title: 'New Vendor Application',
                    message: `Vendor "${name}" has applied for an account.`,
                    type: 'vendor_application',
                    user_id: String(session.userId)
                });
            } catch (notifyError) {
                console.warn('Failed to notify Directus:', notifyError);
                // Don't fail the whole request if Directus notification fails
            }

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
