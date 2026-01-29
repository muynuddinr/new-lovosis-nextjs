import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

/**
 * Middleware to verify admin authentication
 * Used to protect all admin API routes
 */
export async function verifyAdminAuth(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return {
                authenticated: false,
                error: 'No authentication token found',
                user: null,
            };
        }

        const decoded = await verifyToken(token);

        if (!decoded || !decoded.userId) {
            return {
                authenticated: false,
                error: 'Invalid or expired token',
                user: null,
            };
        }

        return {
            authenticated: true,
            error: null,
            user: decoded,
        };
    } catch (error) {
        return {
            authenticated: false,
            error: 'Authentication verification failed',
            user: null,
        };
    }
}

/**
 * Create authenticated response for protected endpoints
 */
export function createUnauthorizedResponse(message: string = 'Unauthorized') {
    return NextResponse.json(
        { error: message, success: false },
        { status: 401 }
    );
}

/**
 * Create forbidden response for insufficient permissions
 */
export function createForbiddenResponse(message: string = 'Forbidden') {
    return NextResponse.json(
        { error: message, success: false },
        { status: 403 }
    );
}
