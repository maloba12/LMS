'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Loan {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
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

export default function AdminLoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rejectComment, setRejectComment] = useState('');
    const [rejectingLoanId, setRejectingLoanId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/admin/loans')
            .then((r) => r.json())
            .then((data) => {
                if (data.error) setError(data.error);
                else setLoans(data);
            })
            .catch(() => setError('Failed to fetch loans'));
    }, []);

    const handleApprove = async (loanId: number) => {
        setLoading(true);
        const res = await fetch(`/api/admin/loans/${loanId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'approved' }),
        });
        const data = await res.json();
        if (!res.ok) setError(data.error || 'Failed to approve');
        else {
            setLoans(loans.map(l => l.id === loanId ? { ...l, status: 'approved', reviewed_at: new Date().toISOString() } : l));
            setRejectComment('');
            setRejectingLoanId(null);
        }
        setLoading(false);
    };

    const handleReject = async (loanId: number) => {
        if (!rejectComment.trim()) {
            setError('Rejection requires a comment');
            return;
        }
        setLoading(true);
        const res = await fetch(`/api/admin/loans/${loanId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'rejected', comment: rejectComment }),
        });
        const data = await res.json();
        if (!res.ok) setError(data.error || 'Failed to reject');
        else {
            setLoans(loans.map(l => l.id === loanId ? { ...l, status: 'rejected', reviewed_at: new Date().toISOString() } : l));
            setRejectComment('');
            setRejectingLoanId(null);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Loan Applications</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment / Income</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affordability</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loans.map((loan) => (
                                <tr key={loan.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{loan.full_name}</div>
                                            <div className="text-sm text-gray-500">{loan.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">K{parseFloat(String(loan.loan_amount)).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={loan.loan_purpose}>
                                        {loan.loan_purpose}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {loan.declared_employment_status} / K{loan.declared_monthly_income ? parseFloat(String(loan.declared_monthly_income)).toFixed(2) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {loan.max_affordable_amount ? `K${parseFloat(String(loan.max_affordable_amount)).toFixed(2)}` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {loan.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(loan.id)}
                                                    disabled={loading}
                                                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setRejectingLoanId(loan.id);
                                                        setRejectComment('');
                                                    }}
                                                    disabled={loading}
                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loans.length === 0 && !error && (
                        <div className="text-center py-12 text-gray-500">No loan applications found.</div>
                    )}
                </div>

                {rejectingLoanId && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Loan Application</h3>
                            <textarea
                                rows={4}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm text-black"
                                placeholder="Enter rejection reason (required)"
                                value={rejectComment}
                                onChange={(e) => setRejectComment(e.target.value)}
                            />
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => setRejectingLoanId(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReject(rejectingLoanId)}
                                    disabled={loading || !rejectComment.trim()}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
