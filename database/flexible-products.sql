-- ============================================
-- FLEXIBLE CATEGORY HIERARCHY UPDATE
-- Run this in Supabase SQL Editor
-- ============================================

-- First, drop existing products table and recreate with flexible foreign keys
-- WARNING: This will delete all existing products!

DROP TABLE IF EXISTS products CASCADE;

-- Recreate products table with flexible category assignment
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(100) UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  
  -- Flexible category assignment (only ONE should be set)
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sub_category_id UUID REFERENCES sub_categories(id) ON DELETE SET NULL,
  super_sub_category_id UUID REFERENCES super_sub_categories(id) ON DELETE SET NULL,
  
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON products FOR DELETE USING (true);

-- ============================================
-- HOW IT WORKS:
-- ============================================
-- Category → Products:     set category_id only
-- Category → Sub → Products:     set sub_category_id only
-- Category → Sub → Super → Products:     set super_sub_category_id only
-- ============================================
