import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    console.log('Fetching storage info...');

    // List files from images bucket root
    const { data: files, error: listError } = await supabase
      .storage
      .from('images')
      .list('', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      console.error('Storage list error:', listError);
      return NextResponse.json(
        { error: `Failed to list files: ${listError.message}` },
        { status: 500 }
      );
    }

    // Separate folders and files from root
    const rootItems = files || [];
    const folders = rootItems.filter(f => !f.metadata); // Folders have no metadata
    const rootFiles = rootItems.filter(f => f.metadata); // Files have metadata

    console.log(`Found ${folders.length} folders and ${rootFiles.length} root files`);

    // Recursively search inside all folders for files
    let allFiles: any[] = [];

    // Add root files first
    allFiles.push(...rootFiles);

    // Search inside each folder
    for (const folder of folders) {
      console.log(`Searching folder: ${folder.name}`);
      const { data: folderFiles, error: folderError } = await supabase
        .storage
        .from('images')
        .list(folder.name, {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (folderError) {
        console.error(`Error listing folder ${folder.name}:`, folderError);
      } else if (folderFiles) {
        console.log(`  Found ${folderFiles.length} items in ${folder.name}`);
        // Add folder path to file names
        const filesInFolder = folderFiles
          .filter(f => f.metadata) // Only actual files, not subfolders
          .map(f => ({
            ...f,
            name: `${folder.name}/${f.name}`,
            fullPath: `${folder.name}/${f.name}`
          }));
        allFiles.push(...filesInFolder);
      }
    }

    // Calculate total size
    let totalSize = 0;
    const formattedFiles = allFiles.map(f => {
      const size = f.metadata?.size || 0;
      totalSize += size;
      return {
        name: f.name,
        size,
        created_at: f.created_at,
        id: f.id,
        metadata: f.metadata
      };
    });

    console.log(`Total: ${formattedFiles.length} files, ${totalSize} bytes`);

    return NextResponse.json({
      success: true,
      bucket: 'images',
      files: formattedFiles,
      totalFiles: formattedFiles.length,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
    });
  } catch (err) {
    console.error('Storage API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
