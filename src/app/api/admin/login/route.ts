import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { signToken } from '@/app/lib/jwt';
import bcrypt from 'bcryptjs';

// Demo credentials for testing without database
const DEMO_ADMIN = {
    id: 'demo-admin-id',
    username: 'admin',
    password: 'admin123',
    name: 'Moin',
};

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
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
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
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
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
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
