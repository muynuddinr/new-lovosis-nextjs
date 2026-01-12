-- ============================================
-- CLEANUP & RLS POLICIES
-- Run this in Supabase SQL Editor
-- ============================================

-- Delete all existing data (in order due to foreign keys)
DELETE FROM products;
DELETE FROM super_sub_categories;
DELETE FROM sub_categories;
DELETE FROM categories;

-- ============================================
-- ADD RLS POLICIES FOR ADMIN OPERATIONS
-- ============================================

-- Categories policies
CREATE POLICY "Allow insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON categories FOR DELETE USING (true);

-- Sub Categories policies
CREATE POLICY "Allow insert" ON sub_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON sub_categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON sub_categories FOR DELETE USING (true);

-- Super Sub Categories policies
CREATE POLICY "Allow insert" ON super_sub_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON super_sub_categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON super_sub_categories FOR DELETE USING (true);

-- Products policies
CREATE POLICY "Allow insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON products FOR DELETE USING (true);

-- ============================================
-- After running this, you can add data from:
-- http://localhost:3001/admin/dashboard/category
-- http://localhost:3001/admin/dashboard/sub-category
-- http://localhost:3001/admin/dashboard/super-sub-category
-- http://localhost:3001/admin/dashboard/products
-- ============================================
