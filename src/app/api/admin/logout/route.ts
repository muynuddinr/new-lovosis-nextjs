import { NextResponse } from 'next/server';

/**
 * Logout endpoint - Clears admin authentication token
 * This is a public endpoint that anyone can call, but effectively only
 * works for users who have a valid admin_token cookie
 */
export async function POST() {
    const response = NextResponse.json({ 
        success: true,
        message: 'Successfully logged out'
    });

    // Clear the admin token cookie
    response.cookies.set('admin_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });

    return response;
}
