'use client';

import Link from 'next/link';
import { Upload, CreditCard } from 'lucide-react';

export default function UploadsHubPage() {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-bold text-gray-900">Document Uploads</h1>
                <p className="mt-2 text-gray-500">Manage your essential documents for loan eligibility.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payslip Upload Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Upload size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Latest Payslip</h3>
                            <p className="text-sm text-gray-500">Income verification</p>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                        Upload your most recent payslip to verify your income and affordability. Accepted formats: PDF, JPG, PNG.
                    </p>
                    <Link
                        href="/dashboard/customer/uploads/payslip"
                        className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Upload Payslip
                    </Link>
                </div>

                {/* ID Upload Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">National ID (NRC)</h3>
                            <p className="text-sm text-gray-500">Identity verification</p>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                        Upload a clear copy of your National Registration Card (front and back). Accepted formats: PDF, JPG, PNG.
                    </p>
                    <Link
                        href="/dashboard/customer/uploads/id"
                        className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                    >
                        Upload ID
                    </Link>
                </div>
            </div>
        </div>
    );
}
