import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import VendorApprovalTable from '@/components/VendorApprovalTable';

async function getAllVendors() {
    const [vendors] = await pool.query<RowDataPacket[]>(
        `SELECT v.*, u.full_name as owner_name, u.email as owner_email
         FROM vendors v
         JOIN users u ON v.user_id = u.id
         ORDER BY v.status ASC, v.created_at DESC`
    );
    return vendors;
}

export default async function AdminVendorsPage() {
    const session = await getSession();
    if (!session || session.role !== 'admin') redirect('/auth/login');

    const vendors = await getAllVendors();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
                <p className="text-gray-500 text-sm">Review and moderate financial institutions on the marketplace.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <VendorApprovalTable vendors={vendors as any[]} />
            </div>
        </div>
    );
}
