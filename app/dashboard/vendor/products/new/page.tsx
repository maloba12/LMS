'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Package, 
    ArrowLeft, 
    DollarSign, 
    Calendar, 
    Percent, 
    FileText,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const LOAN_TYPES = [
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'salary_advance', label: 'Salary Advance' },
    { value: 'sme_loan', label: 'SME Loan' },
    { value: 'school_fees_loan', label: 'School Fees Loan' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'asset_financing', label: 'Asset Financing' },
    { value: 'other', label: 'Other' }
];

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        loan_type: 'personal_loan',
        min_amount: '',
        max_amount: '',
        min_tenure_months: '',
        max_tenure_months: '',
        interest_rate: '',
        interest_type: 'flat',
        processing_fee_percent: '0',
        min_income_requirement: '',
        eligibility_criteria: ''
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    min_amount: Number(formData.min_amount),
                    max_amount: Number(formData.max_amount),
                    min_tenure_months: Number(formData.min_tenure_months),
                    max_tenure_months: Number(formData.max_tenure_months),
                    interest_rate: Number(formData.interest_rate),
                    processing_fee_percent: Number(formData.processing_fee_percent),
                    min_income_requirement: formData.min_income_requirement ? Number(formData.min_income_requirement) : null
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create product');
            }

            router.push('/dashboard/vendor/products');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link 
                href="/dashboard/vendor/products" 
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-gray-900">New Loan Product</h1>
                <p className="text-gray-500 text-sm">Define the terms and requirements for your new loan offering.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Basic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Quick Salary Advance"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">Loan Type</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.loan_type}
                                onChange={(e) => setFormData({...formData, loan_type: e.target.value})}
                                required
                            >
                                {LOAN_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Briefly describe the purpose of this loan..."
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Loan Terms</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400" /> Amount Range (ZMW)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                    value={formData.min_amount}
                                    onChange={(e) => setFormData({...formData, min_amount: e.target.value})}
                                    required
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                    value={formData.max_amount}
                                    onChange={(e) => setFormData({...formData, max_amount: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" /> Tenure Range (Months)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                    value={formData.min_tenure_months}
                                    onChange={(e) => setFormData({...formData, min_tenure_months: e.target.value})}
                                    required
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                    value={formData.max_tenure_months}
                                    onChange={(e) => setFormData({...formData, max_tenure_months: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Percent className="w-4 h-4 text-gray-400" /> Monthly Interest Rate (%)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                value={formData.interest_rate}
                                onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Calculation</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                value={formData.interest_type}
                                onChange={(e) => setFormData({...formData, interest_type: e.target.value})}
                            >
                                <option value="flat">Flat Rate</option>
                                <option value="reducing_balance">Reducing Balance</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Eligibility & Fees</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Monthly Income (ZMW)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                value={formData.min_income_requirement}
                                onChange={(e) => setFormData({...formData, min_income_requirement: e.target.value})}
                                placeholder="Optional"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Processing Fee (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                                value={formData.processing_fee_percent}
                                onChange={(e) => setFormData({...formData, processing_fee_percent: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" /> Eligibility Criteria / Requirements
                        </label>
                        <textarea
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none h-32"
                            value={formData.eligibility_criteria}
                            onChange={(e) => setFormData({...formData, eligibility_criteria: e.target.value})}
                            placeholder="List requirements (e.g. 3 months payslips, Zambian ID, etc.)"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link 
                        href="/dashboard/vendor/products"
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Publishing...' : <><CheckCircle2 className="w-5 h-5" /> Publish Product</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
