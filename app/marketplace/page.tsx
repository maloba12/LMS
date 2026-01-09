import MarketplaceSearch from '@/components/MarketplaceSearch';
import VendorCard from '@/components/VendorCard';
import pool from '@/lib/db';
import { Vendor } from '@/types/marketplace';
import { RowDataPacket } from 'mysql2';
import Link from 'next/link';

async function getVendors(searchParams: { [key: string]: string | string[] | undefined }) {
    const search = searchParams.search as string;
    const category = searchParams.category as string;
    const location = searchParams.location as string;

    let query = `
        SELECT id, name, description, logo_url, category, address, status 
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

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    // Fetch ratings separately or join (simplified for now to basic query)
    // To minimize complexity, we'll do a quick loop or subquery if performant, 
    // or just fetch all reviews and aggregate in JS (not scalable) or join.
    // Let's do a subquery in the main select for avg rating.
    
    // Refined Query with Rating:
    /*
    SELECT v.*, AVG(r.rating) as rating, COUNT(r.id) as review_count
    FROM vendors v
    LEFT JOIN vendor_reviews r ON v.id = r.vendor_id
    WHERE v.status = 'approved'
    ...
    GROUP BY v.id
    */
   
    let advancedQuery = `
        SELECT v.*, AVG(r.rating) as rating, COUNT(r.id) as review_count
        FROM vendors v
        LEFT JOIN vendor_reviews r ON v.id = r.vendor_id
        WHERE v.status = 'approved'
    `;
    
    if (category) {
        advancedQuery += ` AND v.category = ?`;
    }
    if (search) {
        advancedQuery += ` AND v.name LIKE ?`;
    }
    if (location) {
        advancedQuery += ` AND v.address LIKE ?`;
    }
    
    advancedQuery += ' GROUP BY v.id';

    const [vendors] = await pool.query<RowDataPacket[]>(advancedQuery, params);
    return vendors as Vendor[];
}

export default async function MarketplacePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams; // Await params in recent Next.js versions
    const vendors = await getVendors(resolvedSearchParams);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-200 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                        Find the Best Loan in <span className="text-blue-600">Zambia</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-500">
                        Compare offers from top banks, microfinance institutions, and digital lenders.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <MarketplaceSearch />

                {vendors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No lenders found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vendors.map((vendor) => (
                            <VendorCard key={vendor.id} vendor={vendor} />
                        ))}
                    </div>
                )}
                
                <div className="mt-12 text-center">
                    <p className="text-gray-500 mb-4">Are you a registered financial institution?</p>
                    <Link 
                        href="/auth/register?role=vendor" 
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                        Join the Marketplace
                    </Link>
                </div>
            </div>
        </div>
    );
}
