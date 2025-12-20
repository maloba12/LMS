import { getSession } from '@/lib/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoanList from './LoanList';

export const dynamic = 'force-dynamic';

async function getLoans() {
    const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT DISTINCT
      l.id,
      l.user_id,
      l.loan_amount,
      l.loan_purpose,
      l.repayment_period_months,
      l.declared_employment_status,
      l.declared_monthly_income,
      l.terms_accepted,
      l.affordability_ratio,
      l.max_affordable_amount,
      l.status,
      l.applied_at,
      l.reviewed_at,
      u.full_name,
      u.email
    FROM loan_applications l
    JOIN users u ON l.user_id = u.id
    ORDER BY l.applied_at DESC
  `);
    return rows;
}

async function getUsers() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC');
    return rows;
}

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        redirect('/auth/login');
    }

    const loans = await getLoans();
    const users = await getUsers();

    const pendingLoans = loans.filter(l => l.status === 'pending').length;
    const approvedLoans = loans.filter(l => l.status === 'approved').length;
    const totalAmount = loans.reduce((acc, curr) => acc + (curr.status === 'approved' ? Number(curr.loan_amount) : 0), 0);

    const stats = [
        { label: 'Total Applications', value: loans.length, color: 'blue' },
        { label: 'Pending Review', value: pendingLoans, color: 'yellow' },
        { label: 'Total Approved', value: approvedLoans, color: 'green' },
        { label: 'Total Disbursement', value: `K${totalAmount.toLocaleString()}`, color: 'indigo' },
        { label: 'Total Users', value: users.length, color: 'purple' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 border-b border-gray-200 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">System Overview</h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">Real-time statistics and platform health metrics.</p>
                </div>
                <div className="flex space-x-3">
                    <Link href="/dashboard/admin/loans" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
                        Process Loans
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">{stat.label}</p>
                        <p className={`text-3xl font-black text-${stat.color}-600`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 border-t-4 border-t-blue-600">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/admin/loans" className="p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                            <p className="font-bold text-gray-900 group-hover:text-blue-600">Review Loans</p>
                            <p className="text-xs text-gray-500 mt-1">Pending approval requests</p>
                        </Link>
                        <Link href="/dashboard/admin/users" className="p-4 bg-gray-50 rounded-2xl hover:bg-purple-50 transition-colors group">
                            <p className="font-bold text-gray-900 group-hover:text-purple-600">User Management</p>
                            <p className="text-xs text-gray-500 mt-1">Manage system accounts</p>
                        </Link>
                        <Link href="/dashboard/admin/documents" className="p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors group">
                            <p className="font-bold text-gray-900 group-hover:text-green-600">View Documents</p>
                            <p className="text-xs text-gray-500 mt-1">CVs and supporting files</p>
                        </Link>
                        <Link href="/dashboard/admin/reports" className="p-4 bg-gray-50 rounded-2xl hover:bg-orange-50 transition-colors group">
                            <p className="font-bold text-gray-900 group-hover:text-orange-600">System Reports</p>
                            <p className="text-xs text-gray-500 mt-1">View analytics and statistics</p>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity Mini-List (Optional placeholder) */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Activity</h2>
                    <div className="space-y-4">
                        {loans.slice(0, 5).map((loan, index) => (
                            <div key={`loan-${loan.id}-${index}`} className="flex items-center justify-between p-3 rounded-xl border border-gray-50">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{loan.full_name}</p>
                                    <p className="text-xs text-gray-500">Applied for K{parseFloat(loan.loan_amount).toLocaleString()}</p>
                                </div>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${loan.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        loan.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {loan.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
