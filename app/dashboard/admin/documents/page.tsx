import { getSession } from '@/lib/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Eye, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDocuments() {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT d.*, u.full_name as user_name 
        FROM documents d 
        JOIN users u ON d.user_id = u.id 
        ORDER BY d.uploaded_at DESC
    `);
    return rows;
}

export default async function AdminDocumentsPage() {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        redirect('/auth/login');
    }

    const documents = await getDocuments();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 border-b border-gray-200 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Document Vault</h1>
                    <p className="text-gray-500 mt-2 font-medium">Access and review all uploaded customer CVs and supporting documents.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.length > 0 ? (
                    documents.map((doc: any) => (
                        <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                                    ID: {doc.id}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 truncate mb-1" title={doc.file_name}>
                                {doc.file_name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 font-medium italic">Owner: {doc.user_name}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-xs text-gray-400">
                                    {new Date(doc.uploaded_at).toLocaleDateString()}
                                </span>
                                <Link
                                    href={doc.file_path}
                                    target="_blank"
                                    className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800"
                                >
                                    <Eye size={16} className="mr-1" />
                                    View File
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-500 font-medium">No documents found in the system vault.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
