import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'customer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const docType = formData.get('docType') as string || 'payslip';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validation
        const allowedMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/jpg'
        ];
        
        if (!allowedMimeTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only PDF, JPG, and PNG allowed.' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), `uploads/${docType}s`);
        await mkdir(uploadDir, { recursive: true });

        const filename = `${session.userId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        // Save to DB
        await pool.query(
            'INSERT INTO documents (user_id, file_name, file_path, file_type, doc_type) VALUES (?, ?, ?, ?, ?)',
            [session.userId, file.name, `/uploads/${docType}s/${filename}`, file.type, docType]
        );

        return NextResponse.json({ message: 'Document uploaded successfully' }, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
