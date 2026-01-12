-- ============================================
-- ADD IMAGE_URL TO CATEGORIES TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- Add image_url column to sub_categories if not exists
ALTER TABLE sub_categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to super_sub_categories if not exists  
ALTER TABLE super_sub_categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Note: categories table already has image_url from original schema
