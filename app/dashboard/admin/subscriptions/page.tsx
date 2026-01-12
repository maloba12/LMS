import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import SubscriptionManagementTable from '@/components/SubscriptionManagementTable';

async function getAllSubscriptions() {
  const [subscriptions] = await pool.query<RowDataPacket[]>(
    `SELECT s.*, v.name as vendor_name, v.status as vendor_status,
     sp.name as plan_name, sp.price_monthly, sp.price_yearly,
     u.full_name as owner_name, u.email as owner_email
     FROM company_subscriptions s
     JOIN vendors v ON s.vendor_id = v.id
     JOIN subscription_plans sp ON s.plan_id = sp.id
     JOIN users u ON v.user_id = u.id
     ORDER BY s.status ASC, s.end_date ASC`
  );
  return subscriptions;
}

export default async function AdminSubscriptionsPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/auth/login');

  const subscriptions = await getAllSubscriptions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-500 text-sm">Monitor and manage company subscriptions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SubscriptionManagementTable subscriptions={subscriptions as any[]} />
      </div>
    </div>
  );
}
