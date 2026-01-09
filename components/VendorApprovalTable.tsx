'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Check, 
    X, 
    ExternalLink, 
    Building2, 
    BadgeCheck, 
    Search 
} from 'lucide-react';

interface VendorApprovalTableProps {
    vendors: any[];
}

export default function VendorApprovalTable({ vendors }: VendorApprovalTableProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVendors = vendors.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.pacra_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleAction(vendorId: number, status: 'approved' | 'rejected') {
        if (!confirm(`Are you sure you want to set status to ${status}?`)) return;
        
        setLoading(vendorId);
        try {
            const res = await fetch('/api/admin/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vendor_id: vendorId, status })
            });

            if (!res.ok) throw new Error('Action failed');
            
            router.refresh();
        } catch (err) {
            alert('Failed to update vendor status');
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or PACRA..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Vendor & Owner</th>
                            <th className="px-6 py-4 font-semibold">Regulatory Info</th>
                            <th className="px-6 py-4 font-semibold">Contact</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredVendors.map((vendor) => (
                            <tr key={vendor.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                            {vendor.logo_url ? <img src={vendor.logo_url} className="w-full h-full object-cover rounded-lg" /> : vendor.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{vendor.name}</div>
                                            <div className="text-xs text-gray-500">{vendor.owner_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="font-medium text-gray-700">PACRA: {vendor.pacra_number}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <BadgeCheck className="w-3.5 h-3.5 text-green-500" />
                                            <span className="font-medium text-gray-700">BoZ: {vendor.boz_license_number}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    <div>{vendor.contact_email}</div>
                                    <div>{vendor.contact_phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                        vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {vendor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {vendor.status === 'pending' && (
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(vendor.id, 'approved')}
                                                disabled={loading === vendor.id}
                                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                                                title="Approve"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction(vendor.id, 'rejected')}
                                                disabled={loading === vendor.id}
                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                title="Reject"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    {vendor.status !== 'pending' && (
                                         <button className="text-gray-400 hover:text-gray-600">
                                            <ExternalLink className="w-4 h-4" />
                                         </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredVendors.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No vendors matched your search.
                    </div>
                )}
            </div>
        </div>
    );
}
