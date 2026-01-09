'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Package } from 'lucide-react';
import { Vendor, LoanProduct } from '@/types/marketplace';

export default function ApplyLoanPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ApplyLoanForm />
        </Suspense>
    );
}

function ApplyLoanForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [form, setForm] = useState({
        amount: '',
        purpose: '',
        repayment_period_months: '12',
        declared_employment_status: '',
        declared_monthly_income: '',
        terms_accepted: false,
        vendor_id: searchParams.get('vendor_id') || '',
        loan_product_id: searchParams.get('product_id') || '',
    });
    const [eligibility, setEligibility] = useState<any>(null);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [products, setProducts] = useState<LoanProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Fetch vendors
        fetch('/api/vendors')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setVendors(data);
                else setVendors([]);
            })
            .catch(err => {
                console.error(err);
                setVendors([]);
            });

        fetch('/api/loans/eligibility')
            .then((r) => r.json())
            .then(setEligibility)
            .catch(() => setEligibility({ eligible: false, checks: [{ ok: false, message: 'Could not verify eligibility' }] }));
    }, []);

    useEffect(() => {
        if (form.vendor_id) {
            fetch(`/api/products?vendor_id=${form.vendor_id}`)
                .then(r => r.json())
                .then(data => {
                    if (Array.isArray(data)) setProducts(data);
                    else setProducts([]);
                })
                .catch(err => {
                    console.error(err);
                    setProducts([]);
                });
        } else {
            setProducts([]);
        }
    }, [form.vendor_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/loans/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(form.amount),
                    purpose: form.purpose,
                    repayment_period_months: parseInt(form.repayment_period_months),
                    declared_employment_status: form.declared_employment_status,
                    declared_monthly_income: parseFloat(form.declared_monthly_income),
                    terms_accepted: form.terms_accepted,
                    vendor_id: form.vendor_id ? parseInt(form.vendor_id) : null,
                    loan_product_id: form.loan_product_id ? parseInt(form.loan_product_id) : null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to submit application');
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/customer/my-loan');
            }, 3000);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = eligibility?.eligible && form.terms_accepted;

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Apply for a Loan</h2>

                {eligibility && (
                    <div className={`mb-6 p-4 rounded-md ${eligibility.eligible ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                        <p className={`font-medium ${eligibility.eligible ? 'text-green-800' : 'text-yellow-800'}`}>
                            {eligibility.eligible ? 'You are eligible to apply' : 'Complete the following to apply'}
                        </p>
                        {!eligibility.eligible && (eligibility.checks || []).filter((c: any) => !c.ok).length > 0 && (
                            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                                {(eligibility.checks || []).filter((c: any) => !c.ok).map((c: any, i: number) => (
                                    <li key={i}>{c.message}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
                        <p className="font-medium text-green-800">
                            Loan application submitted successfully! Redirecting to your loan status...
                        </p>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> Select Lender
                            </label>
                            <select
                                name="vendor_id"
                                value={form.vendor_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2 text-sm text-black"
                            >
                                <option value="">Global Application (Any Lender)</option>
                                {Array.isArray(vendors) && vendors.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4" /> Select Product
                            </label>
                            <select
                                name="loan_product_id"
                                value={form.loan_product_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2 text-sm text-black"
                                disabled={!form.vendor_id}
                            >
                                <option value="">General Purpose Loan</option>
                                {Array.isArray(products) && products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.interest_rate}%)</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loan Amount (K)</label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                            required
                            min="500"
                            max="50000"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Purpose</label>
                        <textarea
                            name="purpose"
                            value={form.purpose}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                            rows={4}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Repayment Period (months)</label>
                        <select
                            name="repayment_period_months"
                            value={form.repayment_period_months}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                            required
                        >
                            <option value="6">6 months</option>
                            <option value="12">12 months</option>
                            <option value="18">18 months</option>
                            <option value="24">24 months</option>
                            <option value="36">36 months</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                        <select
                            name="declared_employment_status"
                            value={form.declared_employment_status}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                            required
                        >
                            <option value="">Select...</option>
                            <option value="employed">Employed</option>
                            <option value="self-employed">Self-employed</option>
                            <option value="contract">Contract</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Monthly Income (K)</label>
                        <input
                            type="number"
                            name="declared_monthly_income"
                            value={form.declared_monthly_income}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="terms_accepted"
                            checked={form.terms_accepted}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            required
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            I agree to the terms and conditions
                        </label>
                    </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit || loading}
                            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!canSubmit || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
