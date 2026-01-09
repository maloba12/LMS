import pool from '@/lib/db';
import { LoanProduct, Vendor } from '@/types/marketplace';
import { RowDataPacket } from 'mysql2';
import LoanProductCard from '@/components/LoanProductCard';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Mail, Globe, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

async function getVendorWithProducts(id: string) {
    const [vendors] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM vendors WHERE id = ?',
        [id]
    );

    if (vendors.length === 0) return null;
    const vendor = vendors[0] as Vendor;

    // Fetch products
    const [products] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM loan_products WHERE vendor_id = ? AND is_active = TRUE',
        [id]
    );
    
    // Fetch review stats
    const [stats] = await pool.query<RowDataPacket[]>(
        'SELECT AVG(rating) as rating, COUNT(*) as count FROM vendor_reviews WHERE vendor_id = ?',
        [id]
    );

    return {
        ...vendor,
        products: products as LoanProduct[],
        rating: stats[0].rating || 0,
        review_count: stats[0].count || 0
    };
}

export default async function VendorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const vendor = await getVendorWithProducts(id);

    if (!vendor) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24">
            {/* Vendor Banner/Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-gray-400 border border-gray-200 shadow-inner">
                            {vendor.logo_url ? (
                                <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                vendor.name.substring(0, 2).toUpperCase()
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                                {vendor.status === 'approved' && (
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                                        <ShieldCheck className="w-3 h-3" />
                                        Verified Lender
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                    {vendor.category.replace('_', ' ')}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="font-medium text-gray-900">{Number(vendor.rating).toFixed(1)}</span>
                                    <span className="text-gray-400">({vendor.review_count} reviews)</span>
                                </div>
                            </div>
                            
                            <p className="text-gray-600 max-w-3xl">
                                {vendor.description}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 text-sm min-w-[200px]">
                            {vendor.website_url && (
                                <a href={vendor.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                    <Globe className="w-4 h-4" />
                                    Visit Website
                                </a>
                            )}
                            {vendor.contact_phone && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    {vendor.contact_phone}
                                </div>
                            )}
                            {vendor.contact_email && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    {vendor.contact_email}
                                </div>
                            )}
                            {vendor.address && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate max-w-[200px]">{vendor.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Loan Products</h2>
                    <p className="text-gray-500">Available financial solutions from {vendor.name}</p>
                </div>

                {vendor.products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500">No loan products listed yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vendor.products.map(product => (
                            <LoanProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
