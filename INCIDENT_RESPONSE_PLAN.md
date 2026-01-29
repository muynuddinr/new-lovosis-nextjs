# Security Incident Response Plan

## 🚨 Incident Response Procedures

This document outlines the procedures to follow in case of security incidents related to the Lovosis admin panel.

## Types of Incidents

### 1. Suspected Account Compromise
**Indicators:**
- Unusual login activity from unknown IP addresses
- Changes to products/categories by unknown admin
- Unauthorized file uploads
- Multiple failed login attempts followed by success

**Response Steps:**
1. **Immediate (0-5 minutes)**
   - Isolate the affected admin account
   - Force logout all sessions
   - Change admin password immediately
   - Review recent login logs

2. **Short-term (5-60 minutes)**
   - Review all changes made since compromise
   - Audit product modifications and uploads
   - Check storage buckets for suspicious files
   - Review database access logs

3. **Follow-up (1-24 hours)**
   - Rotate JWT_SECRET
   - Create new admin user
   - Update password policies
   - Implement monitoring

### 2. Excessive Failed Login Attempts
**Indicators:**
- Rate limiting activated (429 responses)
- Multiple login attempts from different IPs
- Attack patterns detected

**Response Steps:**
1. **Immediate** - Monitor rate limiting metrics
2. **Short-term** - Review firewall rules
3. **Long-term** - Improve monitoring

### 3. Unauthorized Data Access
**Indicators:**
- Admin endpoints accessed without token
- Database queries from unauthorized sources

**Response Steps:**
1. **Immediate** - Revoke all tokens
2. **Short-term** - Create new admin account
3. **Follow-up** - Strengthen access controls

### 4. Accidental Data Deletion
**Indicators:**
- Large number of records deleted
- Images missing from storage
- Products/categories suddenly unavailable

**Response Steps:**
1. **Immediate (0-5 minutes)**
   - Stop all operations
   - Document what was deleted
   - Note exact time of deletion

2. **Short-term (5-30 minutes)**
   - Notify team immediately
   - Contact Supabase support
   - Request point-in-time recovery

3. **Recovery (30 minutes - 2 hours)**
   - Go to Supabase Dashboard → Backups
   - Select backup before deletion
   - Restore database to that point
   - Verify all data restored

4. **Follow-up (same day)**
   - Investigate how deletion happened
   - Add safeguards (soft deletes)
   - Update documentation
   - Train team on procedures

**Prevention:**
- Use soft deletes (mark as inactive)
- Require confirmation for deletions
- Implement deletion logging
- Regular backup testing

### 5. Database Breach
**Indicators:**
- Unusual database activity
- Missing or modified data
- RLS policies disabled

**Response Steps:**
1. **Immediate** - Create backup, isolate systems
2. **Short-term** - Restore from backup
3. **Follow-up** - Root cause analysis

## 🆘 Emergency Procedures

### Force Logout All Users
```bash
# Update JWT_SECRET in .env.local
JWT_SECRET=new-secure-random-string

# Restart application
npm run dev
```

### Disable Specific Admin Account
```sql
UPDATE admin_users SET is_active = false WHERE username = 'username';
```

### Restore Database from Backup
1. Supabase Dashboard → Backups
2. Select desired backup date
3. Click "Restore" and confirm
4. Wait for restoration to complete
5. Verify data integrity

### Revoke All Tokens
- Change JWT_SECRET in environment
- All users must login again
- Complete logout of all sessions

## 📊 Monitoring & Detection

### What to Monitor
- Failed login attempts (401 responses)
- Rate limiting hits (429 responses)
- Unauthorized access attempts (403 responses)
- Unusual database changes
- Storage uploads from unexpected sources
- Changes outside business hours
- Database size anomalies

### Alert Thresholds
- **5+ failed logins/15 min** from single IP → Alert
- **Any 401/403** on admin endpoints → Log
- **Unusual data modifications** → Alert
- **Storage increased 50%** in one day → Alert

## 📝 Incident Report Template

```
# Incident Report [Date]

## Incident Details
- Type: [Account Compromise/Data Deletion/Breach/etc]
- Severity: [Critical/High/Medium/Low]
- Discovery Time: [Date/Time]
- Resolution Time: [Date/Time]

## Timeline
- [HH:MM] - Incident detected
- [HH:MM] - Initial response
- [HH:MM] - Issue resolved

## Root Cause
[Description]

## Impact
- Records affected: [Number]
- Duration: [Time period]
- Users impacted: [List]

## Actions Taken
1. [Immediate action]
2. [Recovery action]
3. [Prevention action]

## Follow-up
- [ ] Root cause analysis
- [ ] Process improvements
- [ ] Team training
```

## 📞 Contact Information

### In Case of Emergency
- **Supabase Support:** support@supabase.io
- **Project Lead:** [Contact info]
- **Security Officer:** [Contact info]

### Regular Check Schedule
- **Daily:** Monitor failed logins
- **Weekly:** Review access logs
- **Monthly:** Security audit
- **Quarterly:** Full security review

---

**Version:** 1.0
**Last Updated:** 2024
