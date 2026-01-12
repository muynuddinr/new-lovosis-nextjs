import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// DELETE - Delete a specific contact enquiry
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { id } = params;

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

// PATCH - Update status of a contact enquiry
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { id } = params;
        const body = await request.json();
        const { status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('contact_enquiries')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Contact PATCH error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
