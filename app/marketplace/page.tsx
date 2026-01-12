import MarketplaceSearch from '@/components/MarketplaceSearch';
import VendorCard from '@/components/VendorCard';
import pool from '@/lib/db';
import { Vendor } from '@/types/marketplace';
import { RowDataPacket } from 'mysql2';
import Link from 'next/link';

// Fake vendor data for development
const fakeVendors: Vendor[] = [
    {
        id: 1,
        name: 'Zanaco Bank',
        description: 'Leading commercial bank in Zambia offering competitive loan rates',
        logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Zanaco&backgroundColor=2563eb',
        category: 'commercial_bank',
        address: 'Lusaka, Zambia',
        contact_email: 'loans@zanaco.co.zm',
        contact_phone: '+260 211 123456',
        website_url: 'https://zanaco.co.zm',
        rating: 4.8,
        review_count: 1250
    },
    {
        id: 2,
        name: 'Atlas Mara Zambia',
        description: 'Digital banking solutions with fast loan approvals',
        logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Atlas&backgroundColor=059669',
        category: 'commercial_bank',
        address: 'Lusaka, Zambia',
        contact_email: 'loans@atlasmara.co.zm',
        contact_phone: '+260 211 234567',
        website_url: 'https://atlasmara.co.zm',
        rating: 4.7,
        review_count: 920
    },
    {
        id: 3,
        name: 'FINCA Zambia',
        description: 'Microfinance institution specializing in SME loans',
        logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=FINCA&backgroundColor=db2777',
        category: 'microfinance',
        address: 'Lusaka, Zambia',
        contact_email: 'loans@finca.co.zm',
        contact_phone: '+260 211 345678',
        website_url: 'https://finca.co.zm',
        rating: 4.4,
        review_count: 1800
    },
    {
        id: 4,
        name: 'Bayport Zambia',
        description: 'Salary advance loans with flexible repayment terms',
        logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Bayport&backgroundColor=ea580c',
        category: 'digital_lender',
        address: 'Lusaka, Zambia',
        contact_email: 'loans@bayport.co.zm',
        contact_phone: '+260 211 456789',
        website_url: 'https://bayport.co.zm',
        rating: 4.5,
        review_count: 5400
    },
    {
        id: 5,
        name: 'Madison Finance',
        description: 'Personal and business loans with competitive rates',
        logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Madison&backgroundColor=1d4ed8',
        category: 'microfinance',
        address: 'Lusaka, Zambia',
        contact_email: 'loans@madison.co.zm',
        contact_phone: '+260 211 567890',
        website_url: 'https://madison.co.zm',
        rating: 4.7,
        review_count: 750
    },
    {
        id: 6,
        name: 'Zambia SACCO Union',
        description: 'Cooperative lending for members with community focus',
        logo_url: 'https://api.dicebear.com/7.x/initials/svg?seed=SACCO&backgroundColor=7c3aed',
        category: 'sacco',
        address: 'Lusaka, Zambia',
        contact_email: 'loans@saccounion.co.zm',
        contact_phone: '+260 211 678901',
        website_url: 'https://saccounion.co.zm',
        rating: 4.3,
        review_count: 320
    }
];

async function getVendors(searchParams: { [key: string]: string | string[] | undefined }) {
    const search = searchParams.search as string;
    const category = searchParams.category as string;
    const location = searchParams.location as string;

    let filteredVendors = fakeVendors;

    // Apply filters
    if (category) {
        filteredVendors = filteredVendors.filter(v => v.category === category);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filteredVendors = filteredVendors.filter(v =>
            v.name.toLowerCase().includes(searchLower) ||
            v.description.toLowerCase().includes(searchLower)
        );
    }

    if (location) {
        const locationLower = location.toLowerCase();
        filteredVendors = filteredVendors.filter(v =>
            v.address.toLowerCase().includes(locationLower)
        );
    }

    return filteredVendors;
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
