-- Sample Data for Testing Hierarchical Category System
-- Run this in Supabase SQL Editor after creating the schema

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, status) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', 'active'),
('Fashion', 'fashion', 'Clothing, accessories, and footwear', 'active'),
('Home & Living', 'home-living', 'Furniture and home decor', 'active'),
('Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', 'active');

-- ============================================
-- SUB CATEGORIES
-- ============================================
-- Electronics sub categories
INSERT INTO sub_categories (name, slug, category_id, description, status) 
SELECT 'Smartphones', 'smartphones', id, 'Mobile phones and accessories', 'active' 
FROM categories WHERE slug = 'electronics';

INSERT INTO sub_categories (name, slug, category_id, description, status) 
SELECT 'Laptops', 'laptops', id, 'Notebooks and laptops', 'active' 
FROM categories WHERE slug = 'electronics';

-- Fashion sub categories
INSERT INTO sub_categories (name, slug, category_id, description, status) 
SELECT 'Men''s Clothing', 'mens-clothing', id, 'Clothing for men', 'active' 
FROM categories WHERE slug = 'fashion';

INSERT INTO sub_categories (name, slug, category_id, description, status) 
SELECT 'Women''s Clothing', 'womens-clothing', id, 'Clothing for women', 'active' 
FROM categories WHERE slug = 'fashion';

-- Home & Living sub categories
INSERT INTO sub_categories (name, slug, category_id, description, status) 
SELECT 'Furniture', 'furniture', id, 'Home furniture', 'active' 
FROM categories WHERE slug = 'home-living';

-- ============================================
-- SUPER SUB CATEGORIES
-- ============================================
-- Smartphones super sub categories
INSERT INTO super_sub_categories (name, slug, sub_category_id, description, status) 
SELECT 'Android Phones', 'android-phones', id, 'Android smartphones', 'active' 
FROM sub_categories WHERE slug = 'smartphones';

INSERT INTO super_sub_categories (name, slug, sub_category_id, description, status) 
SELECT 'iPhones', 'iphones', id, 'Apple iPhones', 'active' 
FROM sub_categories WHERE slug = 'smartphones';

-- Laptops super sub categories
INSERT INTO super_sub_categories (name, slug, sub_category_id, description, status) 
SELECT 'Gaming Laptops', 'gaming-laptops', id, 'High-performance gaming laptops', 'active' 
FROM sub_categories WHERE slug = 'laptops';

INSERT INTO super_sub_categories (name, slug, sub_category_id, description, status) 
SELECT 'Business Laptops', 'business-laptops', id, 'Professional laptops', 'active' 
FROM sub_categories WHERE slug = 'laptops';

-- Men's Clothing super sub categories
INSERT INTO super_sub_categories (name, slug, sub_category_id, description, status) 
SELECT 'T-Shirts', 't-shirts', id, 'Men''s t-shirts', 'active' 
FROM sub_categories WHERE slug = 'mens-clothing';

INSERT INTO super_sub_categories (name, slug, sub_category_id, description, status) 
SELECT 'Jeans', 'jeans', id, 'Men''s jeans', 'active' 
FROM sub_categories WHERE slug = 'mens-clothing';

-- Women's Clothing super sub categories
INSERT INTO super_sub_categories (name, slug, sub_category_id, description, status) 
SELECT 'Dresses', 'dresses', id, 'Women''s dresses', 'active' 
FROM sub_categories WHERE slug = 'womens-clothing';

-- Furniture super sub categories
INSERT INTO super_sub_categories (name, slug, sub_category_id, description, status) 
SELECT 'Sofas', 'sofas', id, 'Living room sofas', 'active' 
FROM sub_categories WHERE slug = 'furniture';

-- ============================================
-- PRODUCTS
-- ============================================
-- Android Phones products
INSERT INTO products (name, slug, sku, description, price, sale_price, stock, super_sub_category_id, featured, status)
SELECT 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'SAM-S24U-256', 'Flagship Samsung phone with AI features', 1299.00, 1199.00, 50, id, true, 'active'
FROM super_sub_categories WHERE slug = 'android-phones';

INSERT INTO products (name, slug, sku, description, price, sale_price, stock, super_sub_category_id, featured, status)
SELECT 'Google Pixel 8 Pro', 'google-pixel-8-pro', 'GOO-P8P-128', 'Best Android camera phone', 999.00, NULL, 35, id, false, 'active'
FROM super_sub_categories WHERE slug = 'android-phones';

-- iPhones products
INSERT INTO products (name, slug, sku, description, price, sale_price, stock, super_sub_category_id, featured, status)
SELECT 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'APP-I15PM-256', 'Apple flagship with titanium design', 1199.00, NULL, 45, id, true, 'active'
FROM super_sub_categories WHERE slug = 'iphones';

INSERT INTO products (name, slug, sku, description, price, sale_price, stock, super_sub_category_id, featured, status)
SELECT 'iPhone 15', 'iphone-15', 'APP-I15-128', 'Dynamic Island for everyone', 799.00, 749.00, 60, id, false, 'active'
FROM super_sub_categories WHERE slug = 'iphones';

-- Gaming Laptops products
INSERT INTO products (name, slug, sku, description, price, sale_price, stock, super_sub_category_id, featured, status)
SELECT 'ASUS ROG Strix G16', 'asus-rog-strix-g16', 'ASUS-ROG-G16', 'High-performance gaming laptop', 1799.00, 1599.00, 20, id, true, 'active'
FROM super_sub_categories WHERE slug = 'gaming-laptops';

-- T-Shirts products
INSERT INTO products (name, slug, sku, description, price, sale_price, stock, super_sub_category_id, featured, status)
SELECT 'Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'FSH-TS-001', 'Comfortable 100% cotton t-shirt', 29.99, 24.99, 200, id, false, 'active'
FROM super_sub_categories WHERE slug = 't-shirts';

-- Sofas products
INSERT INTO products (name, slug, sku, description, price, sale_price, stock, super_sub_category_id, featured, status)
SELECT 'Modern L-Shaped Sofa', 'modern-l-shaped-sofa', 'HML-SF-001', 'Elegant L-shaped living room sofa', 899.00, 749.00, 8, id, true, 'active'
FROM super_sub_categories WHERE slug = 'sofas';
