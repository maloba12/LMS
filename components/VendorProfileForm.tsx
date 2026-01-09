'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Building2, MapPin, Phone, Mail, Globe, Hash } from 'lucide-react';
import { Vendor } from '@/types/marketplace';

interface VendorProfileFormProps {
    vendor: Vendor;
}

export default function VendorProfileForm({ vendor }: VendorProfileFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: vendor.name,
        description: vendor.description,
        logo_url: vendor.logo_url || '',
        address: vendor.address || '',
        contact_email: vendor.contact_email || '',
        contact_phone: vendor.contact_phone || '',
        website_url: vendor.website_url || '',
        pacra_number: (vendor as any).pacra_number || '',
        boz_license_number: (vendor as any).boz_license_number || ''
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`/api/vendors/${vendor.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update profile');
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            router.refresh();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Company Details
                    </h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                        <textarea
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Tell customers about your services..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.logo_url}
                            onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                </div>

                {/* Regulatory & Contact */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <Hash className="w-5 h-5 text-blue-600" />
                        Regulatory & Contact
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PACRA Number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.pacra_number}
                                onChange={(e) => setFormData({...formData, pacra_number: e.target.value})}
                                disabled
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Read-only after onboarding</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">BoZ License</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.boz_license_number}
                                onChange={(e) => setFormData({...formData, boz_license_number: e.target.value})}
                                disabled
                            />
                             <p className="text-[10px] text-gray-400 mt-1">Read-only after onboarding</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Physical Address
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Phone
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Public Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.contact_email}
                                onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Website URL
                        </label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.website_url}
                            onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
