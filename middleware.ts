import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const path = request.nextUrl.pathname;

    // Protected routes
    const isDashboard = path.startsWith('/dashboard');
    const isCustomer = path.startsWith('/dashboard/customer');
    const isAdmin = path.startsWith('/dashboard/admin');

    if (isDashboard && !session) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // We can't easily verify the JWT signature in edge middleware (middleware runs on edge),
    // but we can check if the token exists. For role-based access validation,
    // we could decode the token if it's not encrypted, or rely on Server Components to do the check.
    // For better security, checking role inside the page (Server Component) is recommended if verification is complex.
    // HOWEVER, we can do a basic check here if we used a library compatible with Edge, e.g. jose.
    // Since we are using jsonwebtoken (Node.js only), we can't fully verify here without `jose`.
    // So we will allow access if session exists, but let the Layout/Page handle the specific role redirect if needed.
    // Or better, let's just make sure they don't access wrong dashboard.

    // NOTE: In a real app, use 'jose' for middleware JWT verification.
    // For this MVP, we will rely on the server components/api to enforce detailed role checks,
    // preventing data access. But for UX, we might want to redirect.

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
