import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { redirect, notFound } from 'next/navigation';
import VendorProfileForm from '@/components/VendorProfileForm';
import { Vendor } from '@/types/marketplace';

async function getVendorData(userId: number) {
    const [vendors] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM vendors WHERE user_id = ?',
        [userId]
    );

    if (vendors.length === 0) return null;
    return vendors[0] as Vendor;
}

export default async function VendorProfilePage() {
    const session = await getSession();
    if (!session) redirect('/auth/login');

    const vendor = await getVendorData(session.userId);

    if (!vendor) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
                <p className="text-gray-500 text-sm">Update your public profile and contact information.</p>
            </div>

            <VendorProfileForm vendor={vendor} />
        </div>
    );
}
