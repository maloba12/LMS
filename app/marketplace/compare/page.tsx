import pool from '@/lib/db';
import { LoanProduct } from '@/types/marketplace';
import { RowDataPacket } from 'mysql2';
import ComparisonTable from '@/components/ComparisonTable';
import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

async function getCompareProducts(ids: string[]) {
    if (ids.length === 0) return [];

    const [products] = await pool.query<RowDataPacket[]>(
        `SELECT p.*, v.name as vendor_name 
         FROM loan_products p
         JOIN vendors v ON p.vendor_id = v.id
         WHERE p.id IN (?) AND p.is_active = TRUE`,
        [ids]
    );

    return products as (LoanProduct & { vendor_name: string })[];
}

export default async function ComparePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const idsString = resolvedSearchParams.ids as string;
    const ids = idsString ? idsString.split(',') : [];

    const products = await getCompareProducts(ids);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <Link 
                        href="/marketplace" 
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Marketplace
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Scale className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Compare Loan Offers</h1>
                            <p className="text-sm text-gray-500">Find the right deal for your needs</p>
                        </div>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500">No products selected for comparison.</p>
                        <Link href="/marketplace" className="mt-4 inline-block text-blue-600 font-medium">
                            Browse Marketplace
                        </Link>
                    </div>
                ) : (
                    <ComparisonTable products={products} />
                )}
            </div>
        </div>
    );
}
