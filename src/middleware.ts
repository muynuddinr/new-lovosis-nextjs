import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Only protect dashboard routes
    if (path.startsWith('/admin/dashboard')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        const payload = await verifyToken(token);

        if (!payload) {
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    // Redirect to dashboard if already logged in and trying to access login
    if (path === '/admin') {
        const token = request.cookies.get('admin_token')?.value;

        if (token) {
            const payload = await verifyToken(token);
            if (payload) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
