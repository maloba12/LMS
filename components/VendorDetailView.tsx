'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2,
    User,
    CreditCard,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Globe,
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Ban,
    Play
} from 'lucide-react';

interface VendorDetailViewProps {
  vendor: any;
  products: any[];
  applications: any[];
}

export default function VendorDetailView({ vendor, products, applications }: VendorDetailViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status} this vendor?`)) return;

    setLoading(status);
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_id: vendor.id, status })
      });

      if (!res.ok) throw new Error('Failed to update vendor status');

      router.refresh();
    } catch (err) {
      alert('Failed to update vendor status');
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Vendor Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
              <p className="text-gray-500">{vendor.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(vendor.status)}`}>
                  {vendor.status}
                </span>
                <span className="text-sm text-gray-500 capitalize">{vendor.category.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {vendor.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange('approved')}
                  disabled={loading === 'approved'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {loading === 'approved' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={loading === 'rejected'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {loading === 'rejected' ? 'Rejecting...' : 'Reject'}
                </button>
              </>
            )}
            {vendor.status === 'approved' && (
              <button
                onClick={() => handleStatusChange('rejected')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Suspend
              </button>
            )}
            {vendor.status === 'rejected' && (
              <button
                onClick={() => handleStatusChange('approved')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Reactivate
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">PACRA Number</p>
                    <p className="text-sm text-gray-500">{vendor.pacra_number}</p>
                  </div>
                </div>
                {vendor.boz_license_number && (
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bank of Zambia License</p>
                      <p className="text-sm text-gray-500">{vendor.boz_license_number}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-500">{vendor.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{vendor.contact_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-500">{vendor.contact_phone}</p>
                  </div>
                </div>
                {vendor.website_url && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Website</p>
                      <a href={vendor.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-500">
                        {vendor.website_url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{vendor.owner_name}</p>
                <p className="text-sm text-gray-500">{vendor.owner_email}</p>
              </div>
            </div>
          </div>

          {/* Loan Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Products ({products.length})</h3>
            {products.length === 0 ? (
              <p className="text-gray-500 text-sm">No loan products created yet.</p>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        ZMW {product.min_amount.toLocaleString()} - {product.max_amount.toLocaleString()} • {product.interest_rate}% interest
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">And {products.length - 5} more products...</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subscription & Stats */}
        <div className="space-y-6">
          {/* Subscription Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
            {vendor.plan_name ? (
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{vendor.plan_name}</p>
                  <p className="text-sm text-gray-500 capitalize">{vendor.subscription_type} plan</p>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ZMW {vendor.subscription_type === 'monthly' ? vendor.price_monthly : vendor.price_yearly}
                  <span className="text-sm font-normal text-gray-500">/{vendor.subscription_type === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {formatDate(vendor.start_date)} - {formatDate(vendor.end_date)}
                  </span>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  vendor.subscription_status === 'active' ? 'bg-green-100 text-green-800' :
                  vendor.subscription_status === 'expired' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {vendor.subscription_status}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No active subscription</p>
            )}
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications ({applications.length})</h3>
            {applications.length === 0 ? (
              <p className="text-gray-500 text-sm">No loan applications yet.</p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.customer_name}</p>
                      <p className="text-xs text-gray-500">ZMW {app.loan_amount.toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

