'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, User, LogOut, Package } from 'lucide-react';
import { deleteSession } from '@/lib/auth'; // Ensure this is client-safe or handle logout via api

export default function VendorSidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard/vendor', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/vendor/profile', label: 'Company Profile', icon: User },
        { href: '/dashboard/vendor/products', label: 'Loan Products', icon: Package },
        { href: '/dashboard/vendor/applications', label: 'Loan Applications', icon: FileText },
    ];

    const handleLogout = async () => {
        // Trigger server logout
        await fetch('/api/auth/logout', { method: 'POST' }); 
        window.location.href = '/auth/login';
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white transition-transform lg:translate-x-0">
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Vendor Portal
                </span>
            </div>
            
            <div className="flex h-[calc(100vh-4rem)] flex-col justify-between py-4">
                <nav className="space-y-1 px-3">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
