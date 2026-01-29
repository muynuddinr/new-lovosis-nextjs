import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/auth';

// GET all super sub categories (admin) - PROTECTED
export const GET = withAdminAuth(async (request: NextRequest) => {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: superSubCategories, error } = await supabase
            .from('super_sub_categories')
            .select(`
        *,
        sub_category:sub_categories(
          id, name, slug,
          category:categories(id, name, slug)
        )
      `)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ superSubCategories: superSubCategories || [] });
    } catch (error) {
        console.error('Admin super sub categories GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

// POST - Create new super sub category - PROTECTED
export const POST = withAdminAuth(async (request: NextRequest) => {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { name, slug, sub_category_id, description, image_url, status } = body;

        if (!name || !slug || !sub_category_id) {
            return NextResponse.json({ error: 'Name, slug, and sub_category_id are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('super_sub_categories')
            .insert([{ name, slug, sub_category_id, description, image_url, status: status || 'active' }])
            .select(`
        *,
        sub_category:sub_categories(
          id, name, slug,
          category:categories(id, name, slug)
        )
      `)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ superSubCategory: data }, { status: 201 });
    } catch (error) {
        console.error('Admin super sub categories POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

// PUT - Update super sub category - PROTECTED
export const PUT = withAdminAuth(async (request: NextRequest) => {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { id, name, slug, sub_category_id, description, image_url, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Super Sub Category ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('super_sub_categories')
            .update({ name, slug, sub_category_id, description, image_url, status })
            .eq('id', id)
            .select(`
        *,
        sub_category:sub_categories(
          id, name, slug,
          category:categories(id, name, slug)
        )
      `)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ superSubCategory: data });
    } catch (error) {
        console.error('Admin super sub categories PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

// DELETE - Delete super sub category - PROTECTED
export const DELETE = withAdminAuth(async (request: NextRequest) => {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Super Sub Category ID is required' }, { status: 400 });
        }

        // Check for products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id')
            .eq('super_sub_category_id', id)
            .limit(1);

        if (productsError) {
            return NextResponse.json({ error: productsError.message }, { status: 500 });
        }

        if (products && products.length > 0) {
            return NextResponse.json({ 
                error: 'Cannot delete super-sub-category. Please delete or reassign all products first.' 
            }, { status: 400 });
        }

        const { error } = await supabase
            .from('super_sub_categories')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin super sub categories DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
