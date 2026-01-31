import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: subcategories, error } = await supabase
            .from('sub_categories')
            .select('*')
            .eq('status', 'active')
            .order('name');

        if (error) {
            console.error('Error fetching subcategories:', error);
            return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
        }

        return NextResponse.json({ subcategories: subcategories || [] });
    } catch (error) {
        console.error('Subcategories API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}