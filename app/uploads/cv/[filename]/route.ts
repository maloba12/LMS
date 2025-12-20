import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readFile } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { filename } = await params;

        // Security check: Either admin or the owner of this specific file
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT user_id FROM documents WHERE file_path LIKE ?',
            [`%/cv/${filename}`]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: 'File not registered in database' }, { status: 404 });
        }

        const documentOwnerId = rows[0].user_id;

        if (session.role !== 'admin' && session.userId !== documentOwnerId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const filePath = path.join(process.cwd(), 'uploads/cv', filename);

        try {
            const buffer = await readFile(filePath);

            const extension = path.extname(filename).toLowerCase();
            let contentType = 'application/octet-stream';
            if (extension === '.pdf') contentType = 'application/pdf';
            else if (extension === '.doc') contentType = 'application/msword';
            else if (extension === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': contentType,
                    'Content-Disposition': `inline; filename="${filename}"`
                },
            });
        } catch (error) {
            console.error('File read error:', error);
            return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
        }
    } catch (error) {
        console.error('CV Serve error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
