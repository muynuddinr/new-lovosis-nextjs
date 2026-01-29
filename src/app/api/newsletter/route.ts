import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/auth';

// POST - Subscribe to newsletter - PUBLIC (Users can subscribe)
export async function POST(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscriptions')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('newsletter_subscriptions')
            .insert([{ email, status: 'active' }])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 201 });

    } catch (error) {
        console.error('Newsletter error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - Admin fetch all subscriptions - PROTECTED (Admin only)
export const GET = withAdminAuth(async () => {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: subscriptions, error } = await supabase
            .from('newsletter_subscriptions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(subscriptions || []);

    } catch (error) {
        console.error('Newsletter GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

// DELETE - Delete subscription - PROTECTED (Admin only)
export const DELETE = withAdminAuth(async (request: NextRequest) => {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('newsletter_subscriptions')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Newsletter DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

