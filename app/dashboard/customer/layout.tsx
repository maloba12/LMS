import CustomerSidebar from '@/components/CustomerSidebar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.role !== 'customer') {
        redirect('/auth/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <CustomerSidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                <main className="p-4 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
