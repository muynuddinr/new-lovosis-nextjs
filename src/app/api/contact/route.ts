import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// POST - Submit contact form
export async function POST(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { firstName, lastName, business, email, phone, message } = body;

        if (!firstName || !lastName || !email || !message) {
            return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('contact_enquiries')
            .insert([{
                first_name: firstName,
                last_name: lastName,
                business,
                email,
                phone,
                message,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 201 });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - Admin fetch all contact enquiries
export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: enquiries, error } = await supabase
            .from('contact_enquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(enquiries || []);

    } catch (error) {
        console.error('Contact GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete contact enquiry
export async function DELETE(request: NextRequest) {
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
            .from('contact_enquiries')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Contact DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
