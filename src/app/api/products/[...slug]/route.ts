import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Universal slug resolver - handles any level of category hierarchy
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string[] }> }
) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { slug } = await params;
        const slugArray = slug || [];

        if (slugArray.length === 0) {
            return NextResponse.json({ error: 'No slug provided' }, { status: 400 });
        }

        // Get the last slug in the path
        const targetSlug = slugArray[slugArray.length - 1];

        // Try to find what this slug refers to (category, subcategory, super-subcategory)
        // and get products accordingly

        // 1. Check if it's a super sub category
        const { data: superSub } = await supabase
            .from('super_sub_categories')
            .select(`
        *,
        sub_category:sub_categories(
          *,
          category:categories(*)
        )
      `)
            .eq('slug', targetSlug)
            .eq('status', 'active')
            .single();

        if (superSub) {
            // Get products under this super sub category
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('super_sub_category_id', superSub.id)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            return NextResponse.json({
                type: 'super_sub_category',
                data: superSub,
                products: products || [],
                breadcrumb: [
                    { name: superSub.sub_category?.category?.name, slug: superSub.sub_category?.category?.slug },
                    { name: superSub.sub_category?.name, slug: superSub.sub_category?.slug },
                    { name: superSub.name, slug: superSub.slug }
                ]
            });
        }

        // 2. Check if it's a sub category
        const { data: subCat } = await supabase
            .from('sub_categories')
            .select(`
        *,
        category:categories(*)
      `)
            .eq('slug', targetSlug)
            .eq('status', 'active')
            .single();

        if (subCat) {
            // Check if there are super sub categories under this
            const { data: superSubs } = await supabase
                .from('super_sub_categories')
                .select('*')
                .eq('sub_category_id', subCat.id)
                .eq('status', 'active')
                .order('name');

            // Also get products directly under this sub category
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('sub_category_id', subCat.id)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            return NextResponse.json({
                type: 'sub_category',
                data: subCat,
                superSubCategories: superSubs || [],
                products: products || [],
                breadcrumb: [
                    { name: subCat.category?.name, slug: subCat.category?.slug },
                    { name: subCat.name, slug: subCat.slug }
                ]
            });
        }

        // 3. Check if it's a category
        const { data: category } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', targetSlug)
            .eq('status', 'active')
            .single();

        if (category) {
            // Check if there are sub categories under this
            const { data: subCats } = await supabase
                .from('sub_categories')
                .select('*')
                .eq('category_id', category.id)
                .eq('status', 'active')
                .order('name');

            // Also get products directly under this category
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('category_id', category.id)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            return NextResponse.json({
                type: 'category',
                data: category,
                subCategories: subCats || [],
                products: products || [],
                breadcrumb: [
                    { name: category.name, slug: category.slug }
                ]
            });
        }

        // Nothing found
        return NextResponse.json({ error: 'Not found' }, { status: 404 });

    } catch (error) {
        console.error('Products resolve error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
