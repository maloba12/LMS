'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileSpreadsheet,
    Users,
    Files,
    PieChart,
    LogOut,
    Menu,
    Plus,
    Building2,
    X
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Loan Applications', href: '/dashboard/admin/loans', icon: FileSpreadsheet },
    { name: 'Lenders / Marketplace', href: '/dashboard/admin/vendors', icon: Building2 },
    { name: 'Customers', href: '/dashboard/admin/users', icon: Users },
    { name: 'Documents', href: '/dashboard/admin/documents', icon: Files },
    { name: 'Reports', href: '/dashboard/admin/reports', icon: PieChart },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-40 w-64 h-screen transition-transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 bg-slate-900 text-white flex flex-col
            `}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-400">LMS Admin</h2>
                    <p className="text-xs text-slate-400 mt-1">Management Portal</p>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                    ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                                `}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
                />
            )}
        </>
    );
}
