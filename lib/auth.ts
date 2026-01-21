import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    console.log('comparePassword called');
    return bcrypt.compare(password, hash);
}

export async function createSession(userId: number, role: string) {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    console.log('createSession starting for:', userId, role);
    const token = jwt.sign({ userId, role }, secret, { expiresIn: '1d' });
    console.log('JWT signed');
    const cookieStore = await cookies();
    console.log('Cookies store accessed');
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
    console.log('Session cookie set');
}

export async function getSession() {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;

    try {
        return jwt.verify(session, secret) as { userId: number; role: string };
    } catch (error) {
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
