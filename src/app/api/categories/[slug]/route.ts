import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { slug } = await params;

        // Get category by slug
        const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'active')
            .single();

        if (categoryError || !category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Get subcategories for this category
        const { data: subCategories, error: subError } = await supabase
            .from('sub_categories')
            .select('*')
            .eq('category_id', category.id)
            .eq('status', 'active')
            .order('name');

        if (subError) {
            console.error('Error fetching subcategories:', subError);
        }

        return NextResponse.json({
            category,
            subCategories: subCategories || [],
        });
    } catch (error) {
        console.error('Category API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
