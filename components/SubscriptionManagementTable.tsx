'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    Building2,
    User,
    CreditCard,
    AlertTriangle,
    CheckCircle,
    Search,
    MoreHorizontal,
    Eye,
    Ban,
    Play
} from 'lucide-react';

interface Subscription {
  id: number;
  vendor_id: number;
  plan_id: number;
  subscription_type: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending_payment';
  amount_paid: number;
  vendor_name: string;
  vendor_status: string;
  plan_name: string;
  price_monthly: number;
  price_yearly: number;
  owner_name: string;
  owner_email: string;
}

interface SubscriptionManagementTableProps {
  subscriptions: Subscription[];
}

export default function SubscriptionManagementTable({ subscriptions }: SubscriptionManagementTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.owner_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-100">
        <div className="flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by vendor or owner..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending_payment">Pending Payment</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">Vendor & Owner</th>
              <th className="px-6 py-4 font-semibold">Plan & Type</th>
              <th className="px-6 py-4 font-semibold">Dates</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Payment</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSubscriptions.map((subscription) => {
              const daysUntilExpiry = getDaysUntilExpiry(subscription.end_date);
              const isExpiringSoon = subscription.status === 'active' && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
              const isExpired = daysUntilExpiry < 0;

              return (
                <tr key={subscription.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                        {subscription.vendor_name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{subscription.vendor_name}</div>
                        <div className="text-xs text-gray-500">{subscription.owner_name}</div>
                        <div className="text-xs text-gray-400">{subscription.owner_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{subscription.plan_name}</div>
                      <div className="text-xs text-gray-500 capitalize">{subscription.subscription_type}</div>
                      <div className="text-xs text-gray-500">
                        ZMW {subscription.subscription_type === 'monthly' ? subscription.price_monthly : subscription.price_yearly}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Start: {formatDate(subscription.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>End: {formatDate(subscription.end_date)}</span>
                      </div>
                      {subscription.status === 'active' && (
                        <div className={`text-xs font-medium ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}`}>
                          {isExpired ? 'Expired' : `${daysUntilExpiry} days left`}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(subscription.status)}`}>
                        {subscription.status.replace('_', ' ')}
                      </span>
                      {isExpiringSoon && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div>ZMW {subscription.amount_paid}</div>
                    <div className="text-xs text-gray-400">Paid</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/admin/vendors/${subscription.vendor_id}`)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="View Vendor Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {subscription.status === 'expired' && (
                        <button
                          className="p-2 text-green-600 hover:text-green-700 rounded-lg hover:bg-green-50"
                          title="Reactivate Subscription"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {subscription.status === 'active' && (
                        <button
                          className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
                          title="Suspend Subscription"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredSubscriptions.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No subscriptions found matching your criteria.
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50/50 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {subscriptions.filter(s => s.status === 'active').length}
          </div>
          <div className="text-xs text-gray-500">Active Subscriptions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {subscriptions.filter(s => s.status === 'expired').length}
          </div>
          <div className="text-xs text-gray-500">Expired</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {subscriptions.filter(s => s.status === 'pending_payment').length}
          </div>
          <div className="text-xs text-gray-500">Pending Payment</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            ZMW {subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount_paid, 0)}
          </div>
          <div className="text-xs text-gray-500">Monthly Revenue</div>
        </div>
      </div>
    </div>
  );
}
