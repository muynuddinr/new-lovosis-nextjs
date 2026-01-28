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

        // Get subcategory by slug with parent category
        const { data: subCategory, error: subError } = await supabase
            .from('sub_categories')
            .select(`
        *,
        category:categories(*)
      `)
            .eq('slug', slug)
            .eq('status', 'active')
            .single();

        if (subError || !subCategory) {
            return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
        }

        // Get super subcategories for this subcategory
        const { data: superSubCategories, error: superError } = await supabase
            .from('super_sub_categories')
            .select('*')
            .eq('sub_category_id', subCategory.id)
            .eq('status', 'active')
            .order('name');

        if (superError) {
            console.error('Error fetching super subcategories:', superError);
        }

        // Get products directly under this subcategory (no super-subcategory)
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name, slug, image_url')
            .eq('sub_category_id', subCategory.id)
            .is('super_sub_category_id', null)
            .eq('status', 'active')
            .order('name')
            .limit(20);

        if (productsError) {
            console.error('Error fetching products:', productsError);
        }

        return NextResponse.json({
            subCategory,
            superSubCategories: superSubCategories || [],
            products: products || [],
        });
    } catch (error) {
        console.error('Subcategory API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
