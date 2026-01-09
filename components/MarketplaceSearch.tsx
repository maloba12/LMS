'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

export default function MarketplaceSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');

    function handleSearch() {
        startTransition(() => {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (category) params.set('category', category);
            if (location) params.set('location', location);
            
            router.push(`/marketplace?${params.toString()}`);
        });
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search lenders (e.g. Absa, Zanaco)..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="City (e.g. Lusaka)"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="commercial_bank">Banks</option>
                        <option value="microfinance">Microfinance</option>
                        <option value="digital_lender">Digital Lenders</option>
                        <option value="sacco">SACCOs</option>
                    </select>
                    
                    <button
                        onClick={handleSearch}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {isPending ? '...' : <Search className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
