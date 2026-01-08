'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPayslipPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', 'payslip');

        try {
            const res = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Upload failed');
                setUploading(false);
                return;
            }

            router.push('/dashboard/customer/uploads');
            router.refresh();
        } catch (err) {
            setError('An error occurred. Please try again.');
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Latest Payslip</h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                Your payslip is used to assess affordability and eligibility. Please upload your most recent payslip (last 3 months preferred).
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                    Accepted formats: PDF, JPG, PNG (Max 5MB).
                </p>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            {file ? (
                                <span className="text-blue-600 font-medium">{file.name}</span>
                            ) : (
                                <span className="text-gray-500">Click to select file</span>
                            )}
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload Payslip'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
