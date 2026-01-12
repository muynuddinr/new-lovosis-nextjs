import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET single product by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { slug } = await params;

        const { data: product, error } = await supabase
            .from('products')
            .select(`
        *,
        category:categories(id, name, slug),
        sub_category:sub_categories(
          id, name, slug,
          category:categories(id, name, slug)
        ),
        super_sub_category:super_sub_categories(
          id, name, slug,
          sub_category:sub_categories(
            id, name, slug,
            category:categories(id, name, slug)
          )
        )
      `)
            .eq('slug', slug)
            .eq('status', 'active')
            .single();

        if (error || !product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Build breadcrumb based on product category level
        const breadcrumb = [];

        if (product.super_sub_category) {
            breadcrumb.push(
                { name: product.super_sub_category.sub_category.category.name, slug: product.super_sub_category.sub_category.category.slug },
                { name: product.super_sub_category.sub_category.name, slug: product.super_sub_category.sub_category.slug },
                { name: product.super_sub_category.name, slug: product.super_sub_category.slug }
            );
        } else if (product.sub_category) {
            breadcrumb.push(
                { name: product.sub_category.category.name, slug: product.sub_category.category.slug },
                { name: product.sub_category.name, slug: product.sub_category.slug }
            );
        } else if (product.category) {
            breadcrumb.push(
                { name: product.category.name, slug: product.category.slug }
            );
        }

        return NextResponse.json({ product, breadcrumb });

    } catch (error) {
        console.error('Product GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
