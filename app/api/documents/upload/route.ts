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

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validation
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only PDF and Word documents allowed.' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), 'uploads/cv');
        await mkdir(uploadDir, { recursive: true });

        const filename = `${session.userId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        // Save to DB (Delete old CV logic? Requirement says "New upload replaces previous CV")
        // Let's delete old one from DB (or just keep history but only show latest). "New upload replaces previous".
        // I'll just insert new row. Query fetches "latest".
        // Alternatively, delete old rows first if I want to clean up.
        // Let's keep it simple: insert new. The dashboard fetches `LIMIT 1` ordered by date.

        await pool.query(
            'INSERT INTO documents (user_id, file_name, file_path, file_type) VALUES (?, ?, ?, ?)',
            [session.userId, file.name, `/uploads/cv/${filename}`, file.type]
        );

        return NextResponse.json({ message: 'CV uploaded successfully' }, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
