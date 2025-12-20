'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: number;
    full_name: string;
    email: string;
    created_at: string;
}

interface Profile {
    phone_number?: string;
    national_id?: string;
    residential_address?: string;
    employment_status?: string;
    monthly_income?: number;
}

interface Loan {
    id: number;
    loan_amount: number;
    loan_purpose: string;
    status: 'pending' | 'approved' | 'rejected';
    applied_at: string;
    reviewed_at?: string;
}

export default function CustomerDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loan, setLoan] = useState<Loan | null>(null);
    const [docs, setDocs] = useState<{ cv: boolean; id: boolean }>({ cv: false, id: false });
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetch('/api/customer/dashboard')
            .then(r => r.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setUser(data.user);
                    setProfile(data.profile);
                    setLoan(data.loan);
                    setDocs(data.documents);
                }
            })
            .catch(() => setError('Network error'));
    }, []);

    const profileComplete = profile && profile.phone_number && profile.national_id && profile.residential_address && profile.employment_status && profile.monthly_income;
    const canApply = profileComplete && docs.cv && docs.id && !loan;

    if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
    if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">Customer Dashboard</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Welcome back, {user?.full_name}</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Profile Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile</h3>
                        <p className="text-gray-500">Email: {user?.email}</p>
                        <div className="mt-4">
                            {profileComplete ? (
                                <div className="flex items-center text-green-600">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Profile complete
                                    <Link href="/dashboard/customer/profile" className="ml-4 text-sm text-blue-600 hover:underline">Edit</Link>
                                </div>
                            ) : (
                                <Link href="/dashboard/customer/profile" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                    Complete Profile
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Documents Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Documents</h3>
                        <div className="space-y-2 text-sm">
                            <div className={docs.cv ? 'text-green-600' : 'text-red-600'}>
                                CV: {docs.cv ? 'Uploaded' : 'Not uploaded'}
                            </div>
                            <div className={docs.id ? 'text-green-600' : 'text-red-600'}>
                                National ID: {docs.id ? 'Uploaded' : 'Not uploaded'}
                            </div>
                            {!docs.id && (
                                <Link href="/dashboard/customer/upload-id" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Upload ID
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Loan Status Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Current Loan Application</h3>
                        {loan ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Amount</span>
                                        <p className="text-xl font-bold">K{loan.loan_amount}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {loan.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <span className="text-sm text-gray-500">Purpose</span>
                                    <p className="text-gray-900">{loan.loan_purpose}</p>
                                </div>

                                {loan.status === 'rejected' && (
                                    <Link href="/dashboard/customer/apply-loan" className="text-indigo-600 hover:text-indigo-900 font-medium">
                                        Apply Again &rarr;
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                {canApply ? (
                                    <div className="space-y-4">
                                        <p className="text-gray-500">You don't have any active loan applications.</p>
                                        <Link href="/dashboard/customer/apply-loan" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                            Apply for a Loan
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-yellow-600 bg-yellow-50 p-4 rounded-md">
                                        <p>Complete your profile and upload required documents before applying.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}
