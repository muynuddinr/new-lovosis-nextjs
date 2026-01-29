import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { signToken } from '@/app/lib/jwt';
import { checkLoginRateLimit, getClientIp } from '@/app/lib/admin-middleware';
import bcrypt from 'bcryptjs';

// Demo credentials for testing without database
const DEMO_ADMIN = {
    id: 'demo-admin-id',
    username: 'admin',
    password: 'admin123',
    name: 'Moin',
};

// Maximum failed login attempts before lockout
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
    try {
        const clientIp = getClientIp(request);
        
        // Check rate limiting
        if (!checkLoginRateLimit(clientIp, MAX_LOGIN_ATTEMPTS, LOCKOUT_TIME)) {
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
                { status: 429 }
            );
        }

        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Prevent common attacks by validating input
        if (typeof username !== 'string' || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Invalid input format' },
                { status: 400 }
            );
        }

        if (username.length > 100 || password.length > 255) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check demo credentials first (for testing without Supabase)
        if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
            const token = await signToken({
                userId: DEMO_ADMIN.id,
                username: DEMO_ADMIN.username,
                name: DEMO_ADMIN.name,
            });

            const response = NextResponse.json({
                success: true,
                user: {
                    id: DEMO_ADMIN.id,
                    username: DEMO_ADMIN.username,
                    name: DEMO_ADMIN.name,
                },
            });

            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return response;
        }

        // If Supabase is not configured, only allow demo login
        if (!supabase) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Fetch admin user from database
        const { data: user, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = await signToken({
            userId: user.id,
            username: user.username,
            name: user.name,
        });

        // Create response with HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
            },
        });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
