import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import { 
    Users, 
    Package, 
    Star, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

async function getVendorStats(userId: number) {
    // Get vendor info
    const [vendors] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM vendors WHERE user_id = ?',
        [userId]
    );

    if (vendors.length === 0) return null;
    const vendor = vendors[0];

    // Get count of applications
    const [appCount] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM loan_applications WHERE vendor_id = ?',
        [vendor.id]
    );

    // Get count of products
    const [prodCount] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM loan_products WHERE vendor_id = ? AND is_active = TRUE',
        [vendor.id]
    );

    // Get avg rating
    const [rating] = await pool.query<RowDataPacket[]>(
        'SELECT AVG(rating) as avg FROM vendor_reviews WHERE vendor_id = ?',
        [vendor.id]
    );

    // Get recent applications
    const [recentApps] = await pool.query<RowDataPacket[]>(
        `SELECT la.*, u.full_name 
         FROM loan_applications la
         JOIN users u ON la.user_id = u.id
         WHERE la.vendor_id = ?
         ORDER BY la.created_at DESC
         LIMIT 5`,
        [vendor.id]
    );

    return {
        vendor,
        stats: {
            applications: appCount[0].count,
            products: prodCount[0].count,
            rating: rating[0].avg || 0
        },
        recentApplications: recentApps
    };
}

export default async function VendorDashboard() {
    const session = await getSession();
    if (!session) redirect('/auth/login');

    const data = await getVendorStats(session.userId);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Profile Not Found</h2>
                <p className="text-gray-600 mb-6">It looks like you haven't set up your vendor profile yet.</p>
                <Link 
                    href="/dashboard/vendor/onboarding" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Complete Onboarding
                </Link>
            </div>
        );
    }

    const { vendor, stats, recentApplications } = data;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {vendor.name}</h1>
                    <p className="text-gray-500">Manage your loan products and view incoming applications.</p>
                </div>
                {vendor.status === 'pending' && (
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Status: Pending Admin Approval
                    </div>
                )}
                {vendor.status === 'approved' && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Status: Verified Vendor
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <Link href="/dashboard/vendor/applications" className="text-blue-600 hover:text-blue-700">
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.applications}</div>
                    <div className="text-sm text-gray-500">Total Applications</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <Package className="w-6 h-6" />
                        </div>
                        <Link href="/dashboard/vendor/products" className="text-blue-600 hover:text-blue-700">
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.products}</div>
                    <div className="text-sm text-gray-500">Active Loan Products</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                            <Star className="w-6 h-6" />
                        </div>
                        <Link href="/dashboard/vendor/reviews" className="text-blue-600 hover:text-blue-700">
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{Number(stats.rating).toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Average Rating</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Applications */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">Recent Applications</h2>
                        <Link href="/dashboard/vendor/applications" className="text-sm text-blue-600 font-medium hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentApplications.map((app) => (
                            <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">{app.full_name}</div>
                                        <div className="text-sm text-gray-500">
                                            K{Number(app.loan_amount).toLocaleString()} • {app.loan_purpose}
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                                        app.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                        app.status === 'approved' ? 'bg-green-50 text-green-700' :
                                        'bg-red-50 text-red-700'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentApplications.length === 0 && (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No applications received yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                        <h2 className="text-lg font-bold mb-2">Drive More Applications</h2>
                        <p className="text-blue-100 text-sm mb-6">
                            Update your loan products frequently and ensure your interest rates are competitive to attract more customers in Zambia.
                        </p>
                        <Link 
                            href="/dashboard/vendor/products" 
                            className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
                        >
                            Manage Products
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Marketplace Visibility</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Your profile is currently {vendor.status === 'approved' ? 'visible' : 'hidden'} on the public marketplace.
                        </p>
                        <Link 
                            href={`/vendors/${vendor.id}`} 
                            target="_blank"
                            className="text-sm text-blue-600 font-medium hover:underline"
                        >
                            Preview Public Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
