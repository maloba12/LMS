import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST(request: Request) {
    await deleteSession();
    return NextResponse.redirect(new URL('/auth/login', request.url), {
        status: 303 // See Other is appropriate for redirecting after a POST
    });
}
