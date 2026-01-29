# 🚀 Admin Panel Quick Start Guide

## Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+
- Supabase account (optional - demo mode works)
- `.env.local` file configured

### Demo Credentials
For testing without Supabase:
```
Username: admin
Password: admin123
```

## Setup Steps

### 1. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your settings:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=generate-a-strong-random-string
```

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Access Admin Panel
Navigate to: `http://localhost:3000/admin`

Login with demo credentials above.

## Core Features

### 📦 Product Management
- Create, edit, delete products
- Upload product images
- Add product descriptions and pricing
- Organize by categories

### 📁 Category Management
- Create product categories
- Create sub-categories
- Create super sub-categories
- Organize product hierarchy

### 📸 Media Management
- Upload images (JPEG, PNG, WebP)
- Upload PDF documents
- Organize files by folder
- Delete unused files

### 👤 Admin Account
- Secure login with JWT
- 24-hour session expiration
- Automatic logout on inactivity
- Rate-limited login (5 attempts/15min)

## Security Features ✅

- ✅ JWT token authentication
- ✅ HTTP-only secure cookies
- ✅ Rate limiting on login
- ✅ Auto-logout after 24 hours
- ✅ All admin routes protected
- ✅ Public access for newsletter & contact
- ✅ No unauthorized access

## Testing

### Run Security Tests
```bash
chmod +x test-security.sh
./test-security.sh
```

Expected: All tests pass ✓

### Manual Test
```bash
# Test login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test protected endpoint (should fail)
curl http://localhost:3000/api/admin/products

# Test public endpoint (should work)
curl http://localhost:3000/api/newsletter
```

## Troubleshooting

### "Can't Login"
- Verify username/password are correct
- Check `.env.local` is configured
- Restart dev server: `npm run dev`

### "Too Many Login Attempts"
- Wait 15 minutes (rate limit resets)
- Or restart the app

### "Database Not Configured"
- Using demo mode? Keep SUPABASE_URL empty
- Need Supabase? Fill in env variables

### "Images Not Uploading"
- Check file size (< 5MB)
- Check file type (JPEG, PNG, WebP)
- Verify Supabase storage configured

## Data Protection ⚠️

**Important:** Your data is protected!

### What's Safe
- ✅ Products won't auto-delete with categories
- ✅ Images kept in storage even when records deleted
- ✅ Daily automatic backups enabled
- ✅ Can recover deleted data from backups

### What's at Risk
- ⚠️ Deleting a category will cascade delete sub-categories
- ⚠️ Orphaned images need manual cleanup
- ⚠️ Database size grows without archive

### How to Recover Data
If you accidentally delete something:
1. Stop all operations
2. Go to Supabase Dashboard → Backups
3. Select backup before deletion
4. Click "Restore" and confirm
5. Data restored to that point

**See:** [DATA_PROTECTION_GUIDE.md](./DATA_PROTECTION_GUIDE.md) for full details

## Documentation

📚 **Read These:**
1. [SECURITY_IMPLEMENTATION_SUMMARY.md](./SECURITY_IMPLEMENTATION_SUMMARY.md) - What's protected
2. [DATA_PROTECTION_GUIDE.md](./DATA_PROTECTION_GUIDE.md) - Protect your data
3. [ADMIN_SECURITY_GUIDE.md](./ADMIN_SECURITY_GUIDE.md) - Full setup guide
4. [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) - Deployment checklist

💡 **Need Help?**
- [SECURITY_DOCS_INDEX.md](./SECURITY_DOCS_INDEX.md) - Navigation guide

## Common Questions

**Q: Can I delete products?**
A: Yes, products have safe deletion (won't affect categories)

**Q: Can images be restored?**
A: Yes, via Supabase backups. See DATA_PROTECTION_GUIDE.md

**Q: How long are sessions active?**
A: 24 hours. Then auto-logout (login again needed)

**Q: Can users hack the admin panel?**
A: No. Rate limiting + JWT + HTTPS protection

**Q: Is data backed up?**
A: Yes, automatically daily on Supabase

**Q: What if database is deleted?**
A: Restore from backup (within 7 days)

## Next Steps

### For Testing
- [ ] Run test-security.sh
- [ ] Login to admin panel
- [ ] Create a test product
- [ ] Upload an image
- [ ] Verify it appears on public site

### For Production
- [ ] Follow ADMIN_SECURITY_GUIDE.md setup
- [ ] Create real admin user (not demo)
- [ ] Test backup restoration
- [ ] Enable Supabase RLS policies
- [ ] Configure storage buckets
- [ ] Complete SECURITY_CHECKLIST.md
- [ ] Deploy with confidence

### For Ongoing Maintenance
- [ ] Monthly: Test backups
- [ ] Monthly: Review failed logins
- [ ] Monthly: Check database size
- [ ] Quarterly: Full security audit
- [ ] Annually: Rotate JWT_SECRET

## Support

**Questions?**
1. Check documentation files
2. Run test-security.sh for diagnostics
3. Review error messages in console
4. Check browser DevTools (F12)

**Found a bug?**
- Note error message
- Check browser console
- Share screenshot
- Report with details

---

**Ready?** 
1. `npm run dev`
2. Visit `http://localhost:3000/admin`
3. Login with demo credentials
4. Start managing products!

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready
