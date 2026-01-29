# Data Protection & Backup Security Guide

## 🛡️ Data Protection Overview

This guide explains how your data is protected from accidental deletion and provides backup/recovery procedures.

## 📊 Current Data Protection Status

### ✅ Safe Deletion Behavior
**Products Table:**
- Product records deleted → Product references SET TO NULL (safe)
- Images NOT automatically deleted
- Catalogue PDFs NOT automatically deleted
- No cascading deletion of products

**Catalogue Requests:**
- Can reference deleted products (reference becomes NULL)
- Request records preserved indefinitely
- No automatic cleanup

### ⚠️ Cascade Deletion Behavior
**Sub-Categories Table:**
- Deleting a Category → All Sub-Categories deleted
- Sub-Categories have images → Images NOT automatically deleted from storage
- Products linked to sub-category → Product reference becomes NULL

**Super Sub-Categories Table:**
- Deleting a Sub-Category → All Super Sub-Categories deleted
- Super Sub-Categories have images → Images NOT automatically deleted from storage
- Products linked → Product reference becomes NULL

### 📁 Storage (Images & PDFs)
- ✅ Images uploaded to Supabase storage (separate from database)
- ✅ Images NOT automatically deleted when records deleted
- ✅ Orphaned images can accumulate over time
- ✅ Manual cleanup required for unused files

## 🚨 Risks & Mitigation

### Risk 1: Cascading Category Deletions
**Problem:** Deleting a category cascades to sub-categories and super-sub-categories

**Current Protection:**
```
Admin-only delete (requires authentication)
No accidental deletion from public API
```

**Best Practice:**
```sql
-- Before deleting a category, check what will be affected:
SELECT COUNT(*) FROM sub_categories WHERE category_id = 'category-id';
SELECT COUNT(*) FROM products WHERE category_id = 'category-id';
```

**Recommendation:** Implement soft-delete instead
```sql
-- Add status column for soft deletes
ALTER TABLE categories ADD COLUMN deleted_at TIMESTAMP;

-- Query only active categories
SELECT * FROM categories WHERE deleted_at IS NULL;

-- Soft delete instead of hard delete
UPDATE categories SET deleted_at = NOW() WHERE id = 'id';
```

### Risk 2: Orphaned Images in Storage
**Problem:** Deleting records leaves images in storage bucket

**Current Protection:**
- Images are in separate storage bucket
- No automatic cleanup

**Best Practice:**
```javascript
// When deleting a product with images
async function deleteProduct(productId) {
    // 1. Get product to find image URLs
    const product = await supabase
        .from('products')
        .select('image_url, image_url_2, image_url_3')
        .eq('id', productId)
        .single();
    
    // 2. Delete images from storage
    if (product.image_url) {
        await supabase.storage
            .from('product-images')
            .remove([product.image_url]);
    }
    
    // 3. Delete product record
    await supabase
        .from('products')
        .delete()
        .eq('id', productId);
}
```

### Risk 3: Data Loss During Updates
**Problem:** Accidental overwrites or data corruption

**Current Protection:**
- Timestamp tracking (created_at)
- Row-level security prevents unauthorized changes
- Admin authentication required

**Best Practice:**
```sql
-- Add updated_at column for change tracking
ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Add change log table
CREATE TABLE product_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    field_name VARCHAR(255),
    old_value TEXT,
    new_value TEXT,
    changed_by UUID,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Add trigger to log changes
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO product_changes (product_id, field_name, old_value, new_value, changed_by)
    VALUES (NEW.id, 'status', OLD.status, NEW.status, auth.uid());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_status_change
AFTER UPDATE ON products
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_product_changes();
```

## 🔄 Backup Procedures

### Automatic Backups (Supabase)

**Daily Backups:**
- Supabase automatically backs up your database daily
- 7-day backup retention by default
- Location: Supabase Dashboard → Backups

**Restore Backup:**
1. Go to Supabase Dashboard
2. Select your project
3. Navigate to: Backups (in sidebar)
4. Select the backup date you want
5. Click "Restore" and confirm
6. Database restored to that point in time

### Manual Backup (Export)

**Export Database:**
```bash
# Using Supabase CLI
supabase db pull

# Using pg_dump (PostgreSQL)
pg_dump postgresql://user:password@host:5432/database > backup.sql
```

**Restore from Export:**
```bash
# Using Supabase CLI
supabase db push

# Using psql
psql postgresql://user:password@host:5432/database < backup.sql
```

### Storage Backup (Images & PDFs)

**Backup Storage Files:**
```bash
# Using Supabase CLI
supabase storage download product-images ./local-backup/

# Manual download:
# 1. Go to Supabase Dashboard
# 2. Storage → Select bucket
# 3. Select files → Download
```

**Restore Storage Files:**
```bash
# Upload files back
supabase storage upload product-images ./local-backup/*
```

## 📋 Data Retention Policy

### What Gets Deleted
- ✅ Can delete: Products, Categories, Images
- ✅ Can delete: Individual user inquiries
- ✅ Can delete: Newsletter subscriptions

### What Should NOT Be Deleted
- ❌ Avoid: Active admin accounts
- ❌ Avoid: Categories with active products
- ❌ Avoid: Historical contact/newsletter data (6+ months)

### Recommended Retention Schedule

```
Active Products:         Indefinite (until marked inactive)
Contact Inquiries:       24 months (for legal compliance)
Newsletter Emails:       Compliant with GDPR/Privacy Laws
Admin Accounts:          12 months after deactivation
Backup Copies:           Monthly (30 recent backups)
Storage Files:           6 months minimum (then review)
```

## 🔍 How to Check What Will Be Deleted

### Before Deleting a Category
```javascript
// API endpoint to check dependencies
async function checkCategoryDeletion(categoryId) {
    // Check sub-categories
    const subCats = await supabase
        .from('sub_categories')
        .select('id')
        .eq('category_id', categoryId);
    
    // Check products
    const products = await supabase
        .from('products')
        .select('id')
        .eq('category_id', categoryId);
    
    console.log(`Deleting will affect:
        Sub-categories: ${subCats.length}
        Products: ${products.length}
    `);
}
```

### Before Deleting a Sub-Category
```javascript
async function checkSubCategoryDeletion(subCatId) {
    // Check super sub-categories
    const superSubCats = await supabase
        .from('super_sub_categories')
        .select('id')
        .eq('sub_category_id', subCatId);
    
    // Check products
    const products = await supabase
        .from('products')
        .select('id')
        .eq('sub_category_id', subCatId);
    
    console.log(`Deleting will affect:
        Super Sub-Categories: ${superSubCats.length}
        Products: ${products.length}
    `);
}
```

## 🛠️ Safe Deletion Procedures

### Recommended: Soft Delete (Preferred)

Instead of deleting records, mark them as inactive:

```sql
-- For categories
UPDATE categories SET status = 'inactive' WHERE id = 'id';

-- For sub-categories
UPDATE sub_categories SET status = 'inactive' WHERE id = 'id';

-- For products
UPDATE products SET status = 'inactive' WHERE id = 'id';

-- Query only active records
SELECT * FROM products WHERE status = 'active';
```

**Benefits:**
- ✅ Data preserved
- ✅ Can reactivate if needed
- ✅ Complete audit trail
- ✅ No cascading deletions
- ✅ Images remain accessible

### Not Recommended: Hard Delete

If deletion is absolutely necessary:

**Checklist Before Hard Delete:**
- [ ] Database backup created recently
- [ ] Verified what will be deleted
- [ ] Admin authorization obtained
- [ ] Change log entry created
- [ ] Documented deletion reason

```sql
-- Hard delete (use with caution!)
-- This WILL cascade to sub-categories and super-sub-categories
DELETE FROM categories WHERE id = 'category-id';
```

## 📸 Image Cleanup Procedures

### Find Orphaned Images
```javascript
// Images referenced in database
const activeImages = await supabase
    .from('products')
    .select('image_url, image_url_2, image_url_3')
    .eq('status', 'active');

// Images in storage
const storageFiles = await supabase
    .storage
    .from('product-images')
    .list();

// Find orphaned (in storage but not in DB)
const orphaned = storageFiles.filter(file => 
    !activeImages.some(img => 
        img.image_url?.includes(file.name) ||
        img.image_url_2?.includes(file.name) ||
        img.image_url_3?.includes(file.name)
    )
);
```

### Delete Orphaned Images
```javascript
// Delete specific orphaned images
async function deleteOrphanedImages(imageNames) {
    const { error } = await supabase
        .storage
        .from('product-images')
        .remove(imageNames);
    
    if (error) console.error('Deletion failed:', error);
    else console.log('Deleted:', imageNames);
}
```

### Archive Before Deletion
```javascript
// Archive to separate bucket before deleting
async function archiveImage(imageName) {
    // Copy to archive bucket
    const { data: copied } = await supabase
        .storage
        .from('product-images')
        .copy(imageName, `archive/${imageName}`);
    
    // Delete from active
    if (copied) {
        await supabase.storage
            .from('product-images')
            .remove([imageName]);
    }
}
```

## 🚨 Emergency Recovery

### If Data Was Accidentally Deleted

**Immediate Steps (within 24 hours):**
1. Stop further operations on the database
2. Contact Supabase support
3. Request point-in-time recovery
4. Verify backup availability

**Recovery from Backup:**
```bash
# 1. List available backups
supabase db list-backups

# 2. Restore from specific backup
supabase db restore --backup-id BACKUP_ID

# 3. Verify restoration
SELECT COUNT(*) FROM products;
```

**Alternative: SQL Backup Restoration**
```bash
# If you have a SQL export file
pg_restore -d database_name backup.sql
```

## 📝 Data Audit Trail

### Log All Admin Actions
```sql
-- Create audit log table
CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(255),
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Log deletions
INSERT INTO admin_audit_log (admin_id, action, table_name, record_id)
VALUES (auth.uid(), 'DELETE', 'products', 'product-id');
```

### View Deletion History
```sql
-- See what was deleted and when
SELECT * FROM admin_audit_log 
WHERE action = 'DELETE' 
ORDER BY timestamp DESC;
```

## ✅ Protection Checklist

### Daily
- [ ] Review failed operations in logs
- [ ] Monitor storage usage
- [ ] Check for unexpected deletions

### Weekly
- [ ] Verify automatic backups running
- [ ] Review audit logs
- [ ] Test backup restoration (manually once/month)

### Monthly
- [ ] Create manual database export
- [ ] Archive old storage files
- [ ] Review data retention policy
- [ ] Update documentation

### Quarterly
- [ ] Full disaster recovery test
- [ ] Review and optimize backups
- [ ] Audit data access patterns
- [ ] Plan for growth

### Annually
- [ ] Full security audit
- [ ] Review backup strategy
- [ ] Update retention policies
- [ ] Plan infrastructure upgrades

## 🔐 Access Control for Deletions

### Restrict Who Can Delete

**Database RLS Policy:**
```sql
-- Only super admins can delete categories
CREATE POLICY "Only super admins can delete categories"
  ON categories
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'super-admin'
  );
```

**API Endpoint Authorization:**
```typescript
// In your delete endpoint
export const DELETE = withAdminAuth(async (request) => {
    const token = request.cookies.get('admin_token');
    const user = await verifyToken(token);
    
    // Check if user is super admin
    if (user.role !== 'super-admin') {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    // Proceed with deletion
});
```

## 📞 Support & Help

### If You Need to Recover Data
1. Check Supabase backups first
2. Don't make more changes to database
3. Contact Supabase support immediately
4. Provide information about deletion time

### Backup Location
- Supabase Dashboard → Project → Backups
- Automatic: 7-day rolling window
- Manual: As needed, unlimited storage

### Database Status Check
```bash
# Check database health
curl http://localhost:3000/api/admin/status
```

---

**Important:** Always test your backup restoration procedures regularly. A backup that cannot be restored is not a backup!

**Last Updated:** 2024
**Status:** Active
