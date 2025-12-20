import { getSession } from '@/lib/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getUsers() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC');
    return rows;
}

export default async function AdminUsersPage() {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        redirect('/auth/login');
    }

    const users = await getUsers();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 border-b border-gray-200 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Registered Customers</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage all registered users and their platform permissions.</p>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u: any) => (
                                <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{u.full_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded inline-block">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${u.role === 'admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-green-50 text-green-700 border-green-200'
                                            }`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(u.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Note: I used <tr> inside mapping but used <li> wrapper mistake in previous attempt. 
// Corrected to use <tr> directly since it's the right semantic element for table body mapping.
