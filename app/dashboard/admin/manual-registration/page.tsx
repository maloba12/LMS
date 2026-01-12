import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import ManualCompanyRegistrationForm from '@/components/ManualCompanyRegistrationForm';

async function getSubscriptionPlans() {
  const [plans] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, description, price_monthly, price_yearly FROM subscription_plans WHERE is_active = TRUE ORDER BY price_monthly ASC'
  );
  return plans;
}

export default async function AdminManualRegistrationPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/auth/login');

  const plans = await getSubscriptionPlans();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manual Company Registration</h1>
        <p className="text-gray-500 text-sm">Register companies that visit the office in person</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <ManualCompanyRegistrationForm plans={plans as any[]} />
      </div>
    </div>
  );
}
