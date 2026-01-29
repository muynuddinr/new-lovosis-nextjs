import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';

/**
 * Middleware to protect admin routes and enforce authentication
 * - Verifies JWT tokens in admin_token cookie
 * - Protects /admin/dashboard/* routes
 * - Redirects unauthorized users to login
 * - Clears invalid/expired tokens
 */
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect admin dashboard routes
    if (path.startsWith('/admin/dashboard')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        try {
            const payload = await verifyToken(token);

            if (!payload) {
                const response = NextResponse.redirect(new URL('/admin', request.url));
                response.cookies.delete('admin_token');
                return response;
            }

            // Token is valid, add user info to request headers for use in components
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-admin-user-id', payload.userId || '');
            requestHeaders.set('x-admin-username', payload.username || '');

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (error) {
            console.error('Token verification failed:', error);
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin_token');
            return response;
        }
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (path === '/admin' || path === '/admin/') {
        const token = request.cookies.get('admin_token')?.value;

        if (token) {
            try {
                const payload = await verifyToken(token);
                if (payload) {
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                }
            } catch (error) {
                // Token is invalid, let user stay on login page
                const response = NextResponse.next();
                response.cookies.delete('admin_token');
                return response;
            }
        }
    }

    return NextResponse.next();
}

/**
 * Apply middleware to admin routes
 * This protects the entire /admin/* path
 */
export const config = {
    matcher: ['/admin/:path*'],
};
