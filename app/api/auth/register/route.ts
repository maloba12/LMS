import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    try {
        const { full_name, email, password } = await request.json();

        if (!full_name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        // Default role is 'customer'
        const [result] = await pool.query('INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
            full_name,
            email,
            hashedPassword,
            'customer'
        ]);

        const insertId = (result as any).insertId;

        await createSession(insertId, 'customer');

        return NextResponse.json({ message: 'User registered successfully', role: 'customer' }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
