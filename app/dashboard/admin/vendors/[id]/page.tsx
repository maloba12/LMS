import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { redirect, notFound } from 'next/navigation';
import VendorDetailView from '@/components/VendorDetailView';

async function getVendorDetails(id: string) {
  const [vendors] = await pool.query<RowDataPacket[]>(
    `SELECT v.*, u.full_name as owner_name, u.email as owner_email,
     s.plan_id, s.subscription_type, s.start_date, s.end_date, s.status as subscription_status,
     s.amount_paid, sp.name as plan_name, sp.price_monthly, sp.price_yearly
     FROM vendors v
     JOIN users u ON v.user_id = u.id
     LEFT JOIN company_subscriptions s ON v.subscription_id = s.id
     LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
     WHERE v.id = ?`,
    [id]
  );

  if (vendors.length === 0) return null;

  const vendor = vendors[0];

  // Get loan products for this vendor
  const [products] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM loan_products WHERE vendor_id = ? ORDER BY created_at DESC',
    [id]
  );

  // Get recent loan applications for this vendor
  const [applications] = await pool.query<RowDataPacket[]>(
    `SELECT la.*, u.full_name as customer_name, u.email as customer_email
     FROM loan_applications la
     JOIN users u ON la.user_id = u.id
     WHERE la.vendor_id = ?
     ORDER BY la.applied_at DESC LIMIT 10`,
    [id]
  );

  return {
    vendor,
    products,
    applications
  };
}

export default async function AdminVendorDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/auth/login');

  const { id } = await params;
  const vendorData = await getVendorDetails(id);
  if (!vendorData) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Details</h1>
        <p className="text-gray-500 text-sm">Detailed information about {vendorData.vendor.name}</p>
      </div>

      <VendorDetailView
        vendor={vendorData.vendor}
        products={vendorData.products}
        applications={vendorData.applications}
      />
    </div>
  );
}

