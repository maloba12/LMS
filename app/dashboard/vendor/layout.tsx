import VendorSidebar from '@/components/VendorSidebar';
import InactivityTimeout from '@/components/InactivityTimeout';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

async function checkVendorAccess(userId: number) {
    const [vendors] = await pool.query<RowDataPacket[]>(
        `SELECT v.id, v.status, v.subscription_status, v.subscription_end_date,
         s.status as sub_status, s.end_date
         FROM vendors v
         LEFT JOIN company_subscriptions s ON v.subscription_id = s.id
         WHERE v.user_id = ?`,
        [userId]
    );

    if (vendors.length === 0) return { hasAccess: false, reason: 'No vendor profile found' };

    const vendor = vendors[0];

    // Check if vendor is approved
    if (vendor.status === 'pending') {
        return { hasAccess: false, reason: 'pending_approval', redirectTo: '/vendor/pending-approval' };
    }

    if (vendor.status === 'rejected') {
        return { hasAccess: false, reason: 'Vendor account was rejected' };
    }

    if (vendor.status !== 'approved') {
        return { hasAccess: false, reason: 'Vendor account not approved' };
    }

    // Check subscription status
    if (!vendor.subscription_status || vendor.subscription_status === 'none') {
        return { hasAccess: false, reason: 'No active subscription' };
    }

    if (vendor.subscription_status === 'expired' || (vendor.sub_status === 'expired')) {
        return { hasAccess: false, reason: 'Subscription expired', redirectTo: '/subscription/expired' };
    }

    // Check if subscription end date has passed
    if (vendor.subscription_end_date || vendor.end_date) {
        const endDate = new Date(vendor.subscription_end_date || vendor.end_date);
        const now = new Date();
        if (endDate < now) {
            return { hasAccess: false, reason: 'Subscription expired', redirectTo: '/subscription/expired' };
        }
    }

    return { hasAccess: true };
}

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || (session.role !== 'vendor_admin' && session.role !== 'admin')) {
        redirect('/auth/login');
    }

    // Check access for vendor_admin users
    if (session.role === 'vendor_admin') {
        const accessCheck = await checkVendorAccess(session.userId);
        if (!accessCheck.hasAccess) {
            const redirectPath = accessCheck.redirectTo || '/subscription/expired';
            redirect(`${redirectPath}?reason=${encodeURIComponent(accessCheck.reason)}`);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <VendorSidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                <main className="p-4 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </main>
            </div>

            {/* Inactivity timeout component */}
            <InactivityTimeout />
        </div>
    );
}
