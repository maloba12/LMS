'use client';

import { useState, useEffect } from 'react';

interface LoanStats {
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    totalLoanAmount: number;
    averageLoanAmount: number;
}

interface UserStats {
    totalUsers: number;
    totalCustomers: number;
    totalAdmins: number;
}

export default function AdminReportsPage() {
    const [loanStats, setLoanStats] = useState<LoanStats | null>(null);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch loan statistics
        fetch('/api/admin/loans')
            .then(r => r.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }
                
                // The API returns loans array directly, not wrapped in data.loans
                const loans = Array.isArray(data) ? data : [];
                const stats: LoanStats = {
                    totalApplications: loans.length,
                    pendingApplications: loans.filter((l: any) => l.status === 'pending').length,
                    approvedApplications: loans.filter((l: any) => l.status === 'approved').length,
                    rejectedApplications: loans.filter((l: any) => l.status === 'rejected').length,
                    totalLoanAmount: loans.reduce((sum: number, l: any) => sum + parseFloat(String(l.loan_amount || '0')), 0),
                    averageLoanAmount: loans.length > 0 ? loans.reduce((sum: number, l: any) => sum + parseFloat(String(l.loan_amount || '0')), 0) / loans.length : 0
                };
                setLoanStats(stats);
            })
            .catch(err => {
                console.error('Failed to fetch loan stats:', err);
                setError('Failed to load loan statistics');
            });

        // Fetch user statistics (we'll need to create this endpoint or calculate from existing data)
        // For now, using mock data
        const mockUserStats: UserStats = {
            totalUsers: 2,
            totalCustomers: 1,
            totalAdmins: 1
        };
        setUserStats(mockUserStats);
        
        setLoading(false);
    }, []);

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading reports...</p></div>;
    if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">System Reports</h2>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Applications</h3>
                        <p className="text-3xl font-bold text-blue-600">{loanStats?.totalApplications || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Pending</h3>
                        <p className="text-3xl font-bold text-yellow-600">{loanStats?.pendingApplications || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Approved</h3>
                        <p className="text-3xl font-bold text-green-600">{loanStats?.approvedApplications || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Rejected</h3>
                        <p className="text-3xl font-bold text-red-600">{loanStats?.rejectedApplications || 0}</p>
                    </div>
                </div>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Loan Statistics */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Statistics</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Loan Amount:</span>
                                <span className="font-medium">K{loanStats?.totalLoanAmount.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Average Loan Amount:</span>
                                <span className="font-medium">K{loanStats?.averageLoanAmount.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Approval Rate:</span>
                                <span className="font-medium">
                                    {loanStats?.totalApplications ? 
                                        ((loanStats.approvedApplications / loanStats.totalApplications) * 100).toFixed(1) : '0'}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Statistics */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">User Statistics</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Users:</span>
                                <span className="font-medium">{userStats?.totalUsers || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Customers:</span>
                                <span className="font-medium">{userStats?.totalCustomers || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Administrators:</span>
                                <span className="font-medium">{userStats?.totalAdmins || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Distribution Chart Placeholder */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Application Status Distribution</h3>
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Chart visualization coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
