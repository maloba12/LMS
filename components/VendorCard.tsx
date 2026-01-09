import Link from 'next/link';
import { Vendor } from '@/types/marketplace';
import { Star, MapPin, Building2 } from 'lucide-react';

interface VendorCardProps {
    vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">
                        {vendor.logo_url ? (
                            <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            vendor.name.substring(0, 2).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{vendor.category.replace('_', ' ')}</p>
                    </div>
                </div>
                {vendor.rating !== undefined && (
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-xs font-medium text-yellow-700">
                        <Star className="w-3 h-3 fill-current mr-1" />
                        {Number(vendor.rating).toFixed(1)}
                    </div>
                )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {vendor.description}
            </p>

            <div className="space-y-2 mb-4 text-xs text-gray-500">
                {vendor.address && (
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{vendor.address}</span>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>Reg: PACRA Verified</span>
                </div>
            </div>

            <Link 
                href={`/vendors/${vendor.id}`} 
                className="mt-auto block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium text-center rounded-lg transition-colors"
            >
                View Profile & Products
            </Link>
        </div>
    );
}
