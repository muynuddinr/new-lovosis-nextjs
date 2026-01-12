import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all products (admin)
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
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ products: products || [] });
    } catch (error) {
        console.error('Admin products GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new product
export async function POST(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const {
            name, slug, description, key_features,
            category_id, sub_category_id, super_sub_category_id,
            image_url, image_url_2, image_url_3, catalogue_pdf_url,
            featured, status
        } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('products')
            .insert([{
                name, slug, description, key_features,
                category_id: category_id || null,
                sub_category_id: sub_category_id || null,
                super_sub_category_id: super_sub_category_id || null,
                image_url, image_url_2, image_url_3, catalogue_pdf_url,
                featured: featured || false,
                status: status || 'active'
            }])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ product: data }, { status: 201 });
    } catch (error) {
        console.error('Admin products POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const {
            id, name, slug, description, key_features,
            category_id, sub_category_id, super_sub_category_id,
            image_url, image_url_2, image_url_3, catalogue_pdf_url,
            featured, status
        } = body;

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('products')
            .update({
                name, slug, description, key_features,
                category_id: category_id || null,
                sub_category_id: sub_category_id || null,
                super_sub_category_id: super_sub_category_id || null,
                image_url, image_url_2, image_url_3, catalogue_pdf_url,
                featured, status
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ product: data });
    } catch (error) {
        console.error('Admin products PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin products DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
