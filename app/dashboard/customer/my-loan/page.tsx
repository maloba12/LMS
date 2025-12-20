'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Loan {
    id: number;
    loan_amount: string | number;
    loan_purpose: string;
    repayment_period_months: number | null;
    declared_employment_status: string | null;
    declared_monthly_income: string | number | null;
    terms_accepted: boolean | null;
    affordability_ratio: string | number | null;
    max_affordable_amount: string | number | null;
    status: 'pending' | 'approved' | 'rejected';
    applied_at: string;
    reviewed_at: string | null;
}

export default function MyLoanStatusPage() {
    const [loan, setLoan] = useState<Loan | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/loans/my-loan')
            .then(r => r.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    // The API returns loans array directly, take the first one or null
                    const loans = Array.isArray(data) ? data : [];
                    setLoan(loans.length > 0 ? loans[0] : null);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load loan status');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>;
    if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Loan Status</h2>
                
                {loan ? (
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Details</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Amount:</span> K{parseFloat(String(loan.loan_amount)).toFixed(2)}</p>
                                    <p><span className="font-medium">Purpose:</span> {loan.loan_purpose}</p>
                                    {loan.repayment_period_months && (
                                        <p><span className="font-medium">Repayment Period:</span> {loan.repayment_period_months} months</p>
                                    )}
                                    <p><span className="font-medium">Applied:</span> {new Date(loan.applied_at).toLocaleDateString()}</p>
                                    {loan.reviewed_at && (
                                        <p><span className="font-medium">Reviewed:</span> {new Date(loan.reviewed_at).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Status</h3>
                                <div className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${
                                    loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {loan.status.toUpperCase()}
                                </div>
                                
                                {loan.status === 'pending' && (
                                    <p className="mt-4 text-sm text-gray-600">
                                        Your loan application is under review. We'll notify you once a decision has been made.
                                    </p>
                                )}
                                
                                {loan.status === 'rejected' && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-4">
                                            Unfortunately, your loan application was not approved.
                                        </p>
                                        <Link href="/dashboard/customer/apply-loan" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                            Apply Again
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {loan.max_affordable_amount && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Affordability Details</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Employment Status:</span> {loan.declared_employment_status}</p>
                                    <p><span className="font-medium">Monthly Income:</span> K{loan.declared_monthly_income ? parseFloat(String(loan.declared_monthly_income)).toFixed(2) : 'N/A'}</p>
                                    <p><span className="font-medium">Max Affordable Amount:</span> K{parseFloat(String(loan.max_affordable_amount)).toFixed(2)}</p>
                                    <p><span className="font-medium">Affordability Ratio:</span> {loan.affordability_ratio ? (parseFloat(String(loan.affordability_ratio)) * 100).toFixed(0) : 'N/A'}%</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">No Loan Applications</h3>
                        <p className="text-gray-600 mb-6">You haven't applied for any loans yet.</p>
                        <Link href="/dashboard/customer/apply-loan" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                            Apply for a Loan
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
