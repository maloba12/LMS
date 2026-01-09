import { LoanProduct } from '@/types/marketplace';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface LoanProductCardProps {
    product: LoanProduct;
    showVendorName?: boolean; // Optional if we are on a vendor page
    vendorName?: string;
}

export default function LoanProductCard({ product, showVendorName = false, vendorName }: LoanProductCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden group">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        {showVendorName && vendorName && (
                            <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                                {vendorName}
                            </div>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {product.name}
                        </h3>
                         <span className="inline-block px-2 py-0.5 mt-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                            {product.loan_type.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            {product.interest_rate}%
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                            Interest ({product.interest_type.replace('_', ' ')})
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-gray-50">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Loan Amount</div>
                        <div className="font-semibold text-gray-900">
                            K{product.min_amount.toLocaleString()} - K{product.max_amount.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Tenure</div>
                        <div className="font-semibold text-gray-900">
                            {product.min_tenure_months} - {product.max_tenure_months} Months
                        </div>
                    </div>
                </div>
                
                {product.min_income_requirement && product.min_income_requirement > 0 && (
                     <div className="flex items-start gap-2 mb-4 text-xs text-gray-600">
                        <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>Min Income: K{product.min_income_requirement.toLocaleString()}</span>
                     </div>
                )}

                <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                    {product.description}
                </p>

                <Link
                    href={`/dashboard/loans/apply?vendor_id=${product.vendor_id}&product_id=${product.id}`}
                    className="flex w-full items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                >
                    Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            
            {product.processing_fee_percent > 0 && (
                <div className="bg-gray-50 px-6 py-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Processing Fee: {product.processing_fee_percent}%</span>
                </div>
            )}
        </div>
    );
}
