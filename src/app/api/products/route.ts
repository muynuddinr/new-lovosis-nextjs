import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all products (PUBLIC)
export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: products, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(id, name, slug),
                sub_category:sub_categories(id, name, slug)
            `)
            .eq('status', 'active') // Only fetch active products
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Products fetch error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ products: products || [] });
    } catch (error) {
        console.error('Public products GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
