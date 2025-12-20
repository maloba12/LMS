import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const connection = await pool.getConnection();
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const loanId = parseInt(id);
        if (isNaN(loanId)) {
            return NextResponse.json({ error: 'Invalid loan ID' }, { status: 400 });
        }

        const { action, comment } = await request.json();
        if (!action || !['approved', 'rejected'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        await connection.beginTransaction();

        // Verify loan exists and is pending
        const [loans] = await connection.query<RowDataPacket[]>(
            'SELECT id, status FROM loan_applications WHERE id = ? FOR UPDATE',
            [loanId]
        );
        if (!loans.length) {
            await connection.rollback();
            return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
        }
        if (loans[0].status !== 'pending') {
            await connection.rollback();
            return NextResponse.json({ error: 'Loan already processed' }, { status: 400 });
        }

        // Update loan status and reviewed_at
        await connection.query(
            'UPDATE loan_applications SET status = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
            [action, loanId]
        );

        // Log admin action with optional comment
        await connection.query(
            'INSERT INTO admin_actions (admin_id, loan_id, action, comment) VALUES (?, ?, ?, ?)',
            [session.userId, loanId, action, comment || null]
        );

        await connection.commit();
        return NextResponse.json({ message: `Loan ${action} successfully` });
    } catch (error) {
        await connection.rollback();
        console.error('Admin loan action error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
