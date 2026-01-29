import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

/**
 * Verify admin authentication for API routes
 * Returns user payload if authenticated, throws error if not
 */
export async function verifyAdmin(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
        return NextResponse.json(
            { error: 'Unauthorized - No authentication token provided' },
            { status: 401 }
        );
    }

    const payload = await verifyToken(token);

    if (!payload) {
        return NextResponse.json(
            { error: 'Unauthorized - Invalid or expired token' },
            { status: 401 }
        );
    }

    return payload;
}

/**
 * Wrapper function to protect admin API routes
 * Usage: export const GET = withAdminAuth(async (request, user) => { ... })
 */
export function withAdminAuth<T = any>(
    handler: (request: NextRequest, user?: any) => Promise<NextResponse<T> | NextResponse>
) {
    return async (request: NextRequest): Promise<NextResponse<T> | NextResponse> => {
        const authResult = await verifyAdmin(request);

        // If authResult is a NextResponse (error), return it
        if (authResult instanceof NextResponse) {
            return authResult;
        }

        // Otherwise, authResult is the user payload, call the handler
        return handler(request, authResult);
    };
}
