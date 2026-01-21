'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, FileText, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminHeader() {
    const [notifications, setNotifications] = useState<any>({
        counts: { loans: 0, vendors: 0, total: 0 },
        recent: { loans: [], vendors: [] }
    });
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-4 lg:px-8 absolute top-0 right-0 left-0 lg:left-64 z-30">
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all relative"
                >
                    <Bell className="w-6 h-6" />
                    {notifications.counts.total > 0 && (
                        <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                            {notifications.counts.total}
                        </span>
                    )}
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 text-sm">Notifications</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{notifications.counts.total} New</span>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.counts.total === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No new notifications
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.recent.loans.map((loan: any) => (
                                        <Link 
                                            key={`loan-${loan.id}`}
                                            href={`/dashboard/admin/loans?id=${loan.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block p-4 hover:bg-blue-50/50 transition-colors group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        New loan application
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Submitted by <span className="font-bold">{loan.full_name}</span>
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        {new Date(loan.applied_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {notifications.recent.vendors.map((vendor: any) => (
                                        <Link 
                                            key={`vendor-${vendor.id}`}
                                            href={`/dashboard/admin/vendors?id=${vendor.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block p-4 hover:bg-purple-50/50 transition-colors group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors">
                                                    <Building2 className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        New company registered
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        <span className="font-bold">{vendor.name}</span> is pending approval
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        {new Date(vendor.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
                            <Link href="/dashboard/admin" onClick={() => setIsOpen(false)} className="text-xs text-blue-600 font-bold hover:underline">
                                View Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
