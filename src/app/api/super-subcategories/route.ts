import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: superSubcategories, error } = await supabase
            .from('super_sub_categories')
            .select('*')
            .eq('status', 'active')
            .order('name');

        if (error) {
            console.error('Error fetching super-subcategories:', error);
            return NextResponse.json({ error: 'Failed to fetch super-subcategories' }, { status: 500 });
        }

        return NextResponse.json({ superSubcategories: superSubcategories || [] });
    } catch (error) {
        console.error('Super-subcategories API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}