import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
    try {
        if (!supabase) {
            console.error('Supabase client not initialized');
            return NextResponse.json({ error: 'Database not configured', categories: [] }, { status: 200 });
        }

        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .eq('status', 'active')
            .order('name');

        if (error) {
            console.error('Supabase Error fetching categories:', error);
            return NextResponse.json({ error: 'Failed to fetch categories', categories: [] }, { status: 200 });
        }

        console.log(`Successfully fetched ${categories?.length || 0} categories`);
        return NextResponse.json({ categories: categories || [] }, { status: 200 });
    } catch (error) {
        console.error('Categories API error:', error);
        return NextResponse.json({ error: 'Internal server error', categories: [] }, { status: 200 });
    }
}
