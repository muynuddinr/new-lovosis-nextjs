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

        // Get super subcategory by slug with parent hierarchy
        const { data: superSubCategory, error: superError } = await supabase
            .from('super_sub_categories')
            .select(`
        *,
        sub_category:sub_categories(
          *,
          category:categories(*)
        )
      `)
            .eq('slug', slug)
            .eq('status', 'active')
            .single();

        if (superError || !superSubCategory) {
            return NextResponse.json({ error: 'Super subcategory not found' }, { status: 404 });
        }

        // Get products for this super subcategory
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('super_sub_category_id', superSubCategory.id)
            .eq('status', 'active')
            .order('name');

        if (productsError) {
            console.error('Error fetching products:', productsError);
        }

        return NextResponse.json({
            superSubCategory,
            products: products || [],
        });
    } catch (error) {
        console.error('Super subcategory API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
