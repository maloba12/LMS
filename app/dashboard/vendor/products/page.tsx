import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Eye, 
    Package,
    TrendingUp,
    Calendar,
    DollarSign
} from 'lucide-react';
import Link from 'next/link';

async function getVendorProducts(userId: number) {
    const [vendors] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM vendors WHERE user_id = ?',
        [userId]
    );

    if (vendors.length === 0) return [];
    const vendorId = vendors[0].id;

    const [products] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM loan_products WHERE vendor_id = ? ORDER BY created_at DESC',
        [vendorId]
    );

    return products;
}

export default async function VendorProductsPage() {
    const session = await getSession();
    if (!session) redirect('/auth/login');

    const products = await getVendorProducts(session.userId);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Loan Products</h1>
                    <p className="text-gray-500 text-sm">Create and manage your financial offerings.</p>
                </div>
                <Link 
                    href="/dashboard/vendor/products/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 text-center">
                    <Package className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">
                        You haven't added any loan products. Start by creating your first offering to appear in the marketplace.
                    </p>
                    <Link 
                        href="/dashboard/vendor/products/new"
                        className="mt-6 text-blue-600 font-medium flex items-center gap-1 hover:underline"
                    >
                        Create your first product <Plus className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:border-blue-200 transition-all group">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                product.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                                                {product.loan_type.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-1 mb-4">
                                            {product.description}
                                        </p>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                <span>{product.interest_rate}% ({product.interest_type})</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <DollarSign className="w-3.5 h-3.5" />
                                                <span>K{Number(product.min_amount).toLocaleString()} - K{Number(product.max_amount).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{product.min_tenure_months}-{product.max_tenure_months} Mo</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                                <span>Publicly Visible</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 md:border-l md:pl-6">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
