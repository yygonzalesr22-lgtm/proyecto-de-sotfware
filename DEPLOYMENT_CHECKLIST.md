# 🚀 Café Bar API - Post-Hardening Deployment Checklist

## ✅ Security Hardening Complete
**Commit**: `c21769c` - All 6 critical vulnerabilities addressed

### What Changed
1. ✅ Removed all hardcoded secrets from `.env` files
2. ✅ Fixed database name inconsistencies (standardized to `cafe-bar-bd`)
3. ✅ Removed JWT_SECRET from console logs  
4. ✅ Fixed bcrypt dependency conflict (removed bcryptjs)
5. ✅ Enhanced `.gitignore` (77 rules)
6. ✅ Removed node_modules from git tracking

### New Security Tools Included
- `scripts/generate-secrets.js` - Generate cryptographic JWT_SECRET
- `.git/hooks/pre-commit` - Prevents accidental secret commits (Bash)
- `.git/hooks/pre-commit.ps1` - Windows version (PowerShell)
- `.env.example` templates - Safe configuration references

---

## 📋 Team Deployment Steps

### Step 1: Generate New Secrets (FIRST)
```bash
cd cafe-bar-backend
node scripts/generate-secrets.js
```
This will output a new JWT_SECRET. **DO NOT share this in chat/email.**

### Step 2: Configure Environment Variables
1. Open `cafe-bar-backend/.env` (NOT tracked in git)
2. Fill in the values:
   - `JWT_SECRET=` → Paste the value from Step 1
   - `DB_PASSWORD=` → Your MySQL root password
   - `STRIPE_SECRET_KEY=` → Get from https://dashboard.stripe.com/apikeys
   - `STRIPE_PUBLIC_KEY=` → Get from https://dashboard.stripe.com/apikeys

### Step 3: Install Dependencies
```bash
npm install
# Expected: 51 packages installed, 0 vulnerabilities
```

### Step 4: Verify Database Connection
```bash
node check-db.js
# Should return: ✅ Connected to cafe-bar-bd successfully
```

### Step 5: Start Backend
```bash
npm start
# Expected: Server running on port 3000
```

### Step 6: Start Frontend (separate terminal)
```bash
cd ../cafe-bar-frontend
npm install
npm run dev
# Expected: Frontend on http://localhost:5173
```

---

## 🚨 Important Notes

### Pre-commit Hook Active
The repository now has active security hooks. **You cannot commit `.env` files with real secrets** - this is intentional and prevents accidental exposure.

### Database Name Standardized
- All scripts now use `cafe-bar-bd` (with dashes)
- MySQL connection string should match: `cafe_bar_bd` (database will be created with underscores)
- The code handles both automatically

### Deprecated: bcryptjs Removed
- If you see errors about `bcryptjs`, it's been removed
- All password hashing now uses `bcrypt` v5.1.0
- Update any imports: `bcryptjs` → `bcrypt`

### `.env.example` for Reference
- Safe to commit and share with team
- Shows required variables without sensitive values
- Keep in sync when adding new environment variables

---

## ✅ Validation Checklist

Before going to production:
- [ ] `npm install` completes with 0 vulnerabilities
- [ ] `node check-db.js` returns success
- [ ] Backend starts without errors on port 3000
- [ ] Frontend loads on http://localhost:5173
- [ ] Can login with test credentials
- [ ] No `.env` files appear in `git log` (security)
- [ ] `pre-commit` hook blocks `.env` commits (run `git commit` to test)

---

## 📖 Documentation

- **SECURITY_HARDENING_REPORT.md** - Full technical details of all fixes
- **SETUP_GUIDE.md** - Detailed setup instructions
- **README.md** - General project information

---

## 🆘 Troubleshooting

**"Cannot find module 'bcryptjs'"**
→ Run `npm install` again (bcryptjs removed, now using bcrypt)

**"Error: Access denied for user 'root'@'localhost'**
→ Check `DB_PASSWORD` in `.env` file

**"Cannot find database 'cafe_bar_db'"**
→ Database uses `cafe-bar-bd` in .env, but MySQL creates it as `cafe_bar_db` (normal)

**"JWT_SECRET is not set"**
→ Run `node scripts/generate-secrets.js` and update `.env`

---

**Last Updated**: After commit c21769c
**Status**: ✅ Ready for Deployment
