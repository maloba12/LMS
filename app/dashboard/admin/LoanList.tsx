'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoanList({ loans }: { loans: any[] }) {
    const router = useRouter();
    const [processing, setProcessing] = useState<number | null>(null);

    const handleAction = async (loanId: number, status: 'approved' | 'rejected') => {
        console.log('handleAction triggered', { loanId, status });

        // Remove confirm temporarily to verify if it's blocking
        // if (!confirm(`Are you sure you want to ${status} this loan?`)) return;

        setProcessing(loanId);
        console.log(`Processing ${status} for loan ${loanId}...`);

        try {
            const res = await fetch(`/api/admin/loans/${loanId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            console.log('Fetch response status:', res.status);
            const data = await res.json();
            console.log('Fetch response data:', data);

            if (!res.ok) {
                console.error('API Error:', data.error);
                alert(`Failed to update status: ${data.error || 'Unknown error'}`);
            } else {
                console.log('Update successful, refreshing data...');
                // Direct status update for immediate feedback
                setTimeout(() => {
                    console.log('Triggering router refresh');
                    router.refresh();
                }, 100);
            }
        } catch (e) {
            console.error('Execution Error:', e);
            alert('Error updating status. See console for details.');
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {loans.map((loan) => (
                    <li key={loan.id} className="p-4 hover:bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg font-medium text-blue-600">K{loan.loan_amount}</span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {loan.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Applicant: {loan.full_name} ({loan.email})</p>
                            <p className="mt-1 text-sm text-gray-600">Purpose: {loan.loan_purpose}</p>
                            <div className="mt-2 text-sm text-gray-500">
                                Applied: {new Date(loan.applied_at).toLocaleDateString()}
                                {loan.cv_path && (
                                    <a href={loan.cv_path} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:underline">
                                        View CV ({loan.cv_name})
                                    </a>
                                )}
                            </div>
                        </div>

                        {loan.status === 'pending' && (
                            <div className="mt-4 md:mt-0 flex space-x-2">
                                <button
                                    onClick={() => handleAction(loan.id, 'approved')}
                                    disabled={processing === loan.id}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(loan.id, 'rejected')}
                                    disabled={processing === loan.id}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </li>
                ))}
                {loans.length === 0 && (
                    <li className="p-4 text-center text-gray-500">No loan applications found.</li>
                )}
            </ul>
        </div>
    );
}
