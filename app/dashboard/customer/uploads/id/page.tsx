'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadIDPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate file size
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError('File size exceeds maximum limit of 5MB. Please choose a smaller file.');
                setFile(null);
                return;
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Invalid file type. Please upload PDF, JPG, or PNG files only.');
                setFile(null);
                return;
            }

            setFile(selectedFile);
            setError('');
            setSuccess('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setError('');
        setSuccess('');

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
                if (res.status === 413) {
                    setError('File size exceeds maximum limit of 5MB. Please choose a smaller file.');
                } else if (res.status >= 500) {
                    setError('Server error occurred. Please try again later or contact support.');
                } else {
                    setError(data.error || 'Upload failed. Please check your connection and try again.');
                }
                setUploading(false);
                return;
            }

            setSuccess('Document uploaded successfully!');
            setTimeout(() => {
                router.push('/dashboard/customer/uploads');
                router.refresh();
            }, 2000);

        } catch (err) {
            console.error('Upload error:', err);
            setError('Network error occurred. Please check your internet connection and try again.');
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

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-green-700 text-sm">{success}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        error ? 'border-red-300 bg-red-50' :
                        file ? 'border-green-300 bg-green-50' :
                        'border-gray-300 hover:border-purple-500'
                    }`}>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer block">
                            {file ? (
                                <div className="space-y-2">
                                    <svg className="w-8 h-8 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <span className="text-green-700 font-medium block">{file.name}</span>
                                        <span className="text-green-600 text-sm">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div>
                                        <span className="text-gray-600 font-medium">Click to select file</span>
                                        <span className="text-gray-500 text-sm block">PDF, JPG, PNG up to 5MB</span>
                                    </div>
                                </div>
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
