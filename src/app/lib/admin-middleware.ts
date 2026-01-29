import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

/**
 * Middleware to protect all admin routes
 * Redirects to login if not authenticated
 */
export async function adminAuthMiddleware(request: NextRequest) {
    // Skip middleware for login page
    if (request.nextUrl.pathname === '/admin') {
        return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
        const payload = await verifyToken(token);

        if (!payload) {
            // Clear invalid token
            const response = NextResponse.redirect(new URL('/admin', request.url));
            response.cookies.delete('admin_token');
            return response;
        }

        return NextResponse.next();
    } catch (error) {
        // Clear invalid token
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('admin_token');
        return response;
    }
}

/**
 * Rate limiting for login attempts
 * Prevents brute force attacks
 */
export const loginRateLimitMap = new Map<string, { attempts: number; timestamp: number }>();

export function checkLoginRateLimit(ip: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    const now = Date.now();
    const record = loginRateLimitMap.get(ip);

    if (!record) {
        loginRateLimitMap.set(ip, { attempts: 1, timestamp: now });
        return true;
    }

    if (now - record.timestamp > windowMs) {
        loginRateLimitMap.set(ip, { attempts: 1, timestamp: now });
        return true;
    }

    if (record.attempts >= maxAttempts) {
        return false;
    }

    record.attempts++;
    return true;
}

export function getClientIp(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}
