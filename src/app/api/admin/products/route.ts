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
            name, slug, sku, description, price, sale_price,
            stock, super_sub_category_id, image_url, featured, status
        } = body;

        if (!name || !slug || !price) {
            return NextResponse.json({ error: 'Name, slug, and price are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('products')
            .insert([{
                name, slug, sku, description,
                price: parseFloat(price),
                sale_price: sale_price ? parseFloat(sale_price) : null,
                stock: stock || 0,
                super_sub_category_id,
                image_url,
                featured: featured || false,
                status: status || 'active'
            }])
            .select(`
        *,
        super_sub_category:super_sub_categories(
          id, name, slug,
          sub_category:sub_categories(
            id, name, slug,
            category:categories(id, name, slug)
          )
        )
      `)
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
            id, name, slug, sku, description, price, sale_price,
            stock, super_sub_category_id, image_url, featured, status
        } = body;

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('products')
            .update({
                name, slug, sku, description,
                price: price ? parseFloat(price) : undefined,
                sale_price: sale_price ? parseFloat(sale_price) : null,
                stock, super_sub_category_id, image_url, featured, status
            })
            .eq('id', id)
            .select(`
        *,
        super_sub_category:super_sub_categories(
          id, name, slug,
          sub_category:sub_categories(
            id, name, slug,
            category:categories(id, name, slug)
          )
        )
      `)
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
