-- ============================================
-- LOVOSIS COMPLETE DATABASE SCHEMA
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- This file contains ALL tables, policies, and storage setup
-- ============================================

-- ============================================
-- CLEANUP - Drop existing tables (in correct order)
-- ============================================
DROP TABLE IF EXISTS catalogue_requests CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS super_sub_categories CASCADE;
DROP TABLE IF EXISTS sub_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS contact_enquiries CASCADE;
DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert demo admin (password: admin123)
INSERT INTO admin_users (username, password_hash, name) VALUES (
  'admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Moin'
);

-- ============================================
-- 2. CONTACT ENQUIRIES TABLE
-- ============================================
CREATE TABLE contact_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  business VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. NEWSLETTER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. SUB CATEGORIES TABLE
-- ============================================
CREATE TABLE sub_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. SUPER SUB CATEGORIES TABLE
-- ============================================
CREATE TABLE super_sub_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sub_category_id UUID REFERENCES sub_categories(id) ON DELETE CASCADE,
  description TEXT,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. PRODUCTS TABLE (Flexible Category + Catalogue System)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  
  -- Flexible category assignment (only ONE should be set)
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sub_category_id UUID REFERENCES sub_categories(id) ON DELETE SET NULL,
  super_sub_category_id UUID REFERENCES super_sub_categories(id) ON DELETE SET NULL,
  
  -- Product images
  image_url TEXT,
  image_url_2 TEXT,
  image_url_3 TEXT,
  
  -- Catalogue system
  key_features TEXT,
  catalogue_pdf_url TEXT,
  
  featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. CATALOGUE REQUESTS TABLE
-- ============================================
CREATE TABLE catalogue_requests (
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

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogue_requests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - ADMIN USERS
-- ============================================
CREATE POLICY "Allow public read" ON admin_users FOR SELECT USING (true);

-- ============================================
-- RLS POLICIES - CONTACT ENQUIRIES
-- ============================================
CREATE POLICY "Allow public insert contact" ON contact_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read contact" ON contact_enquiries FOR SELECT USING (true);
CREATE POLICY "Allow admin update contact" ON contact_enquiries FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete contact" ON contact_enquiries FOR DELETE USING (true);

-- ============================================
-- RLS POLICIES - NEWSLETTER SUBSCRIPTIONS
-- ============================================
CREATE POLICY "Allow public insert newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read newsletter" ON newsletter_subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow admin update newsletter" ON newsletter_subscriptions FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete newsletter" ON newsletter_subscriptions FOR DELETE USING (true);

-- ============================================
-- RLS POLICIES - CATEGORIES
-- ============================================
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON categories FOR DELETE USING (true);

-- ============================================
-- RLS POLICIES - SUB CATEGORIES
-- ============================================
CREATE POLICY "Allow public read" ON sub_categories FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON sub_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON sub_categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON sub_categories FOR DELETE USING (true);

-- ============================================
-- RLS POLICIES - SUPER SUB CATEGORIES
-- ============================================
CREATE POLICY "Allow public read" ON super_sub_categories FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON super_sub_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON super_sub_categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON super_sub_categories FOR DELETE USING (true);

-- ============================================
-- RLS POLICIES - PRODUCTS
-- ============================================
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON products FOR DELETE USING (true);

-- ============================================
-- RLS POLICIES - CATALOGUE REQUESTS
-- ============================================
CREATE POLICY "Allow public insert" ON catalogue_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read" ON catalogue_requests FOR SELECT USING (true);
CREATE POLICY "Allow admin update" ON catalogue_requests FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete" ON catalogue_requests FOR DELETE USING (true);

-- ============================================
-- STORAGE BUCKET SETUP - IMAGES (Single bucket for all files)
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'images', 
  'images', 
  true,
  20971520, -- 20MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for the images bucket
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;

CREATE POLICY "Public read access for images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Anyone can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can update images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'images');

CREATE POLICY "Anyone can delete images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'images');

-- ============================================
-- SCHEMA COMPLETE!
-- ============================================
-- Tables created:
--   1. admin_users (with demo admin)
--   2. contact_enquiries
--   3. newsletter_subscriptions
--   4. categories
--   5. sub_categories (with image_url)
--   6. super_sub_categories (with image_url)
--   7. products (flexible categories + catalogue system)
--   8. catalogue_requests
--
-- Storage bucket:
--   - images (20MB, images + PDFs)
--
-- Admin URLs:
--   - /admin/dashboard/category
--   - /admin/dashboard/sub-category
--   - /admin/dashboard/super-sub-category
--   - /admin/dashboard/products
--   - /admin/dashboard/contact-enquiry
--   - /admin/dashboard/newsletter-enquiry
--   - /admin/dashboard/catalogue-requests
-- ============================================
