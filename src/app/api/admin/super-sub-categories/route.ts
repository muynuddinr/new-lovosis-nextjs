import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all super sub categories (admin)
export async function GET() {
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
}

// POST - Create new super sub category
export async function POST(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { name, slug, sub_category_id, description, status } = body;

        if (!name || !slug || !sub_category_id) {
            return NextResponse.json({ error: 'Name, slug, and sub_category_id are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('super_sub_categories')
            .insert([{ name, slug, sub_category_id, description, status: status || 'active' }])
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
}

// PUT - Update super sub category
export async function PUT(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { id, name, slug, sub_category_id, description, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Super Sub Category ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('super_sub_categories')
            .update({ name, slug, sub_category_id, description, status })
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
}

// DELETE - Delete super sub category
export async function DELETE(request: NextRequest) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Super Sub Category ID is required' }, { status: 400 });
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
}
