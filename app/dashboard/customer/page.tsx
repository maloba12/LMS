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
    vendor_name?: string;
    product_name?: string;
}

interface EligibilityData {
    status: 'eligible' | 'partially_eligible' | 'not_eligible';
    checks: Array<{ name: string; ok: boolean }>;
}

interface Notification {
    id: string;
    type: 'warning' | 'info' | 'success';
    message: string;
    action?: string;
}

interface RecommendedProduct {
    id: number;
    name: string;
    description: string;
    min_amount: number;
    max_amount: number;
    interest_rate: number;
    vendor_name: string;
    vendor_logo?: string;
}

interface ApplicationStats {
    total_applications: number;
    pending_count: number;
    approved_count: number;
    rejected_count: number;
}

export default function CustomerDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loan, setLoan] = useState<Loan | null>(null);
    const [docs, setDocs] = useState<{ payslip: boolean; id: boolean }>({ payslip: false, id: false });
    const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
    const [applicationStats, setApplicationStats] = useState<ApplicationStats | null>(null);
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
                    setEligibility(data.eligibility);
                    setNotifications(data.notifications || []);
                    setRecommendedProducts(data.recommendedProducts || []);
                    setApplicationStats(data.applicationStats);
                }
            })
            .catch(() => setError('Network error'));
    }, []);

    const profileComplete = profile && profile.phone_number && profile.national_id && profile.residential_address && profile.employment_status && profile.monthly_income;
    const canApply = profileComplete && docs.payslip && docs.id && !loan;

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
                            <div className={docs.payslip ? 'text-green-600' : 'text-red-600'}>
                                Payslip: {docs.payslip ? 'Uploaded' : 'Not uploaded'}
                            </div>
                            <div className={docs.id ? 'text-green-600' : 'text-red-600'}>
                                National ID: {docs.id ? 'Uploaded' : 'Not uploaded'}
                            </div>
                            {!docs.id && (
                                <Link href="/dashboard/customer/uploads/id" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Lender</span>
                                        <p className="text-sm font-bold text-gray-900">{loan.vendor_name || 'System Default'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Product</span>
                                        <p className="text-sm font-bold text-gray-900">{loan.product_name || 'Standard Loan'}</p>
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

                {/* Additional Information Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                    {/* Loan Eligibility Status */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Eligibility</h3>
                        {eligibility ? (
                            <div className="space-y-3">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    eligibility.status === 'eligible' ? 'bg-green-100 text-green-800' :
                                    eligibility.status === 'partially_eligible' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {eligibility.status === 'eligible' ? 'Eligible' :
                                     eligibility.status === 'partially_eligible' ? 'Partially Eligible' : 'Not Eligible'}
                                </div>
                                <div className="space-y-2">
                                    {eligibility.checks.map((check, index) => (
                                        <div key={index} className="flex items-center text-sm">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${check.ok ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className={check.ok ? 'text-gray-900' : 'text-gray-500'}>{check.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Loading eligibility...</p>
                        )}
                    </div>

                    {/* Mini Application Summary */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Application Summary</h3>
                        {applicationStats ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Applications</span>
                                    <span className="font-bold text-lg">{applicationStats.total_applications}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <div className="text-yellow-600 font-bold">{applicationStats.pending_count}</div>
                                        <div className="text-xs text-gray-500">Pending</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-green-600 font-bold">{applicationStats.approved_count}</div>
                                        <div className="text-xs text-gray-500">Approved</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-red-600 font-bold">{applicationStats.rejected_count}</div>
                                        <div className="text-xs text-gray-500">Rejected</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Loading stats...</p>
                        )}
                    </div>

                    {/* Account & Security Status */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Email Verified</span>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-green-600">Verified</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">KYC Status</span>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${docs.id ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm ${docs.id ? 'text-green-600' : 'text-red-600'}`}>
                                        {docs.id ? 'Complete' : 'Incomplete'}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="text-xs text-gray-500">
                                    Last login: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Recommended Loan Offers */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Loan Offers</h3>
                        {recommendedProducts.length > 0 ? (
                            <div className="space-y-4">
                                {recommendedProducts.map((product) => (
                                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                <p className="text-sm text-gray-600">{product.vendor_name}</p>
                                            </div>
                                            <span className="text-sm font-bold text-blue-600">{product.interest_rate}% APR</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                                        <div className="text-xs text-gray-500">
                                            K{product.min_amount.toLocaleString()} - K{product.max_amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No recommendations available</p>
                        )}
                    </div>

                    {/* Notifications & Alerts */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications & Alerts</h3>
                        {notifications.length > 0 ? (
                            <div className="space-y-3">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
                                        notification.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
                                        notification.type === 'info' ? 'border-blue-400 bg-blue-50' :
                                        'border-green-400 bg-green-50'
                                    }`}>
                                        <div className="flex items-start justify-between">
                                            <p className="text-sm text-gray-800">{notification.message}</p>
                                            {notification.action && (
                                                <a
                                                    href={notification.action}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-800 ml-2"
                                                >
                                                    Fix →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-green-500 mb-2">
                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <p className="text-gray-500">No notifications</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Marketplace and Apply Loan Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Marketplace Section */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Browse Lenders</h3>
                        <p className="text-gray-600 mb-4">Explore available loan providers in Zambia</p>
                        <div className="space-y-4">
                            {/* Quick lender preview */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src="https://api.dicebear.com/7.x/initials/svg?seed=Zanaco&backgroundColor=2563eb" alt="Zanaco" className="w-8 h-8 rounded" />
                                        <div>
                                            <div className="font-medium text-sm">Zanaco Bank</div>
                                            <div className="text-xs text-gray-500">18% APR • 24h approval</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src="https://api.dicebear.com/7.x/initials/svg?seed=FINCA&backgroundColor=db2777" alt="FINCA" className="w-8 h-8 rounded" />
                                        <div>
                                            <div className="font-medium text-sm">FINCA Zambia</div>
                                            <div className="text-xs text-gray-500">28% APR • 24h approval</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/marketplace')}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                                View All Lenders
                            </button>
                        </div>
                    </div>

                    {/* Apply for Loan Section */}
                    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for a Loan</h3>
                        <p className="text-gray-600 mb-4">Submit a new loan application</p>

                        {/* Quick lender selection for global application */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Lender (Optional)</label>
                            <select className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2 text-sm">
                                <option value="">Global Application (Any Lender)</option>
                                <option value="zanaco">Zanaco Bank</option>
                                <option value="atlas">Atlas Mara Zambia</option>
                                <option value="finca">FINCA Zambia</option>
                                <option value="bayport">Bayport Zambia</option>
                                <option value="madison">Madison Finance</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => router.push('/dashboard/customer/apply-loan')}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                            >
                                Full Application
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/customer/apply-loan')}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                                Quick Apply
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
