import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [documents] = await pool.query<RowDataPacket[]>(
            'SELECT id, file_name, file_type, doc_type, uploaded_at FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC',
            [session.userId]
        );

        return NextResponse.json({ documents });
    } catch (error) {
        console.error('Documents fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
