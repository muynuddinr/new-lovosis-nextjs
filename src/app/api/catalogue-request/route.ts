import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// POST - Submit catalogue request and return PDF URL
export async function POST(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { product_id, product_name, customer_name, customer_phone, customer_email, catalogue_pdf_url } = body;

        if (!product_name || !customer_name || !customer_phone || !customer_email) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Save the request to database
        const { data, error } = await supabase
            .from('catalogue_requests')
            .insert([{
                product_id,
                product_name,
                customer_name,
                customer_phone,
                customer_email,
                catalogue_pdf_url,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            request: data,
            pdf_url: catalogue_pdf_url
        }, { status: 201 });

    } catch (error) {
        console.error('Catalogue request error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - Fetch all catalogue requests (admin)
export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: requests, error } = await supabase
            .from('catalogue_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ requests: requests || [] });

    } catch (error) {
        console.error('Catalogue requests GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete a request
export async function DELETE(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('catalogue_requests')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
