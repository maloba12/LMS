import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { comparePassword, createSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        console.log('Login attempt for:', email);
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
        console.log('User query done, found:', rows.length);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = rows[0];
        console.log('Comparing password for user ID:', user.id);
        const isMatch = await comparePassword(password, user.password_hash);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        console.log('Creating session...');
        await createSession(user.id, user.role);
        console.log('Session created');

        return NextResponse.json({ message: 'Login successful', role: user.role }, { status: 200 });
    } catch (error: any) {
        console.error('Login error detail:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        }, { status: 500 });
    }
}
