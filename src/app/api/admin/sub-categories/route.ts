import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all sub categories (admin)
export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { data: subCategories, error } = await supabase
            .from('sub_categories')
            .select(`
        *,
        category:categories(id, name, slug)
      `)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ subCategories: subCategories || [] });
    } catch (error) {
        console.error('Admin sub categories GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new sub category
export async function POST(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { name, slug, category_id, description, image_url, status } = body;

        if (!name || !slug || !category_id) {
            return NextResponse.json({ error: 'Name, slug, and category_id are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('sub_categories')
            .insert([{ name, slug, category_id, description, image_url, status: status || 'active' }])
            .select(`*, category:categories(id, name, slug)`)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ subCategory: data }, { status: 201 });
    } catch (error) {
        console.error('Admin sub categories POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update sub category
export async function PUT(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { id, name, slug, category_id, description, image_url, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Sub Category ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('sub_categories')
            .update({ name, slug, category_id, description, image_url, status })
            .eq('id', id)
            .select(`*, category:categories(id, name, slug)`)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ subCategory: data });
    } catch (error) {
        console.error('Admin sub categories PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete sub category
export async function DELETE(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Sub Category ID is required' }, { status: 400 });
        }

        // Check for super-sub-categories
        const { data: superSubCategories, error: superSubError } = await supabase
            .from('super_sub_categories')
            .select('id')
            .eq('sub_category_id', id)
            .limit(1);

        if (superSubError) {
            return NextResponse.json({ error: superSubError.message }, { status: 500 });
        }

        if (superSubCategories && superSubCategories.length > 0) {
            return NextResponse.json({ 
                error: 'Cannot delete sub-category. Please delete all super-sub-categories first.' 
            }, { status: 400 });
        }

        // Check for products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id')
            .eq('sub_category_id', id)
            .limit(1);

        if (productsError) {
            return NextResponse.json({ error: productsError.message }, { status: 500 });
        }

        if (products && products.length > 0) {
            return NextResponse.json({ 
                error: 'Cannot delete sub-category. Please delete or reassign all products first.' 
            }, { status: 400 });
        }

        const { error } = await supabase
            .from('sub_categories')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin sub categories DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
