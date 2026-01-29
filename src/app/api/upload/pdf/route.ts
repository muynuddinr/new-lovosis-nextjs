import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/auth';

// POST - Upload PDF - PROTECTED (Admin only)
export const POST = withAdminAuth(async (request: NextRequest) => {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'pdfs';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files allowed' }, { status: 400 });
        }

        // Validate file size (20MB max for PDFs)
        if (file.size > 20 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Maximum 20MB allowed.' }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.pdf`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('images')
            .upload(filename, buffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(data.path);

        return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            path: data.path
        });

    } catch (error) {
        console.error('PDF Upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});

