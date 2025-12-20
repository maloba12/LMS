import AdminSidebar from '@/components/AdminSidebar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        redirect('/auth/login');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminSidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                <main className="p-4 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
