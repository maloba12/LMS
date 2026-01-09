'use client';

import { LoanProduct } from '@/types/marketplace';
import { Check, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ComparisonTableProps {
    products: (LoanProduct & { vendor_name: string })[];
}

export default function ComparisonTable({ products }: ComparisonTableProps) {
    if (products.length === 0) return null;

    const rows = [
        { label: 'Interest Rate', key: 'interest_rate', suffix: '%' },
        { label: 'Interest Type', key: 'interest_type', capitalize: true },
        { label: 'Min Amount', key: 'min_amount', prefix: 'K' },
        { label: 'Max Amount', key: 'max_amount', prefix: 'K' },
        { label: 'Min Tenure', key: 'min_tenure_months', suffix: ' Months' },
        { label: 'Max Tenure', key: 'max_tenure_months', suffix: ' Months' },
        { label: 'Processing Fee', key: 'processing_fee_percent', suffix: '%' },
        { label: 'Min Income', key: 'min_income_requirement', prefix: 'K' },
    ];

    return (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-6 bg-gray-50 border-r border-b border-gray-200 w-48 sticky left-0 z-10">
                            <span className="text-gray-500 font-medium">Comparison</span>
                        </th>
                        {products.map((product) => (
                            <th key={product.id} className="p-6 border-b border-gray-200 min-w-[250px] bg-white">
                                <div className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">
                                    {product.vendor_name}
                                </div>
                                <div className="text-lg font-bold text-gray-900 line-clamp-1">
                                    {product.name}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.map((row) => (
                        <tr key={row.label} className="group hover:bg-gray-50/50">
                            <td className="p-4 bg-gray-50/50 border-r border-gray-200 font-medium text-gray-600 sticky left-0 z-10">
                                {row.label}
                            </td>
                            {products.map((product) => {
                                let val = (product as any)[row.key];
                                if (val === null || val === undefined) val = '-';
                                
                                return (
                                    <td key={product.id} className="p-4 text-center text-gray-900">
                                        {row.prefix && val !== '-' && row.prefix}
                                        {row.capitalize && typeof val === 'string' ? val.replace(/_/g, ' ').toUpperCase() : val}
                                        {row.suffix && val !== '-' && row.suffix}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    <tr className="bg-gray-50/30">
                        <td className="p-4 bg-gray-50 border-r border-gray-200 sticky left-0 z-10"></td>
                        {products.map((product) => (
                            <td key={product.id} className="p-6 text-center">
                                <Link
                                    href={`/dashboard/loans/apply?vendor_id=${product.vendor_id}&product_id=${product.id}`}
                                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-bold transition-all text-sm group"
                                >
                                    Apply <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
