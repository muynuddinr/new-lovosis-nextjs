-- ============================================
-- PRODUCT CATALOGUE SYSTEM UPDATE
-- Run this in Supabase SQL Editor
-- ============================================

-- Modify products table - Remove price/stock fields, add new fields
ALTER TABLE products 
DROP COLUMN IF EXISTS price,
DROP COLUMN IF EXISTS sale_price,
DROP COLUMN IF EXISTS stock,
DROP COLUMN IF EXISTS sku;

-- Add new columns for catalogue system
ALTER TABLE products ADD COLUMN IF NOT EXISTS key_features TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url_2 TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url_3 TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS catalogue_pdf_url TEXT;

-- Create catalogue requests table
CREATE TABLE IF NOT EXISTS catalogue_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  catalogue_pdf_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE catalogue_requests ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public insert" ON catalogue_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read" ON catalogue_requests FOR SELECT USING (true);
CREATE POLICY "Allow admin update" ON catalogue_requests FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete" ON catalogue_requests FOR DELETE USING (true);
