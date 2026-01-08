'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadIDPage() {
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
        formData.append('docType', 'id');

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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload National ID</h2>
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-purple-700">
                                Please upload a clear copy of your NRC (National Registration Card). Front side is sufficient if legible.
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                    Accepted formats: PDF, JPG, PNG (Max 5MB).
                </p>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            {file ? (
                                <span className="text-purple-600 font-medium">{file.name}</span>
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
                            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload ID'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
