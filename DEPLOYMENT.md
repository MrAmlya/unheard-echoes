# 🚀 Deployment Guide - Unheard Echoes

This guide will help you deploy your "Unheard Echoes" platform to production.

## 📋 Pre-Deployment Checklist

✅ Build successful (npm run build)  
✅ All features tested locally  
✅ Social media links updated  
✅ Admin account created  
✅ Environment variables ready  

---

## 🌐 Deploy to Vercel (Recommended)

Vercel is the easiest and best platform for Next.js applications.

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Unheard Echoes"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/unheard-echoes.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your `unheard-echoes` repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-random-secret-key-here
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Or use: https://generate-secret.vercel.app/32

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live! 🎉

### Step 3: Get Your Domain

After deployment:
- Vercel gives you: `your-project.vercel.app`
- You can add a custom domain in Vercel settings

---

## 🔐 Important: Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Your production URL | `https://unheard-echoes.vercel.app` |
| `NEXTAUTH_SECRET` | Secret key for JWT | Generate with `openssl rand -base64 32` |

### Update After Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Update `NEXTAUTH_URL` with your actual domain
4. Redeploy if needed

---

## 📂 Data Persistence

### Current Setup (File-based)

Your app uses JSON files for storage:
- `data/writings.json` - All writings
- `data/users.json` - User accounts

**⚠️ Important Notes:**
- Vercel's filesystem is read-only in production
- Data will reset on each deployment
- **For production, migrate to a database**

### Recommended: Migrate to Database

For a production-ready app, consider:

**Option 1: Vercel Postgres**
```bash
npm install @vercel/postgres
```

**Option 2: MongoDB Atlas** (Free tier available)
```bash
npm install mongodb
```

**Option 3: Supabase** (PostgreSQL + Auth)
```bash
npm install @supabase/supabase-js
```

---

## 🔄 Redeployment

### Automatic (Recommended)

Every push to `main` branch auto-deploys:
```bash
git add .
git commit -m "Update: description of changes"
git push
```

### Manual

1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click "..." → "Redeploy"

---

## 🎯 Post-Deployment Tasks

### 1. Test Everything

- [ ] Homepage loads correctly
- [ ] Login/Signup works
- [ ] Create a writing
- [ ] Like and comment system
- [ ] Admin approval workflow
- [ ] Mobile responsiveness

### 2. Create Admin Account

Visit your live site and:
1. Go to `/signup`
2. Create your admin account (first user = admin)
3. Verify admin access at `/admin/review`

### 3. Update Social Links

Your footer links:
- Instagram: [@mr_amlya](https://instagram.com/mr_amlya)
- GitHub: [mramlya](https://github.com/mramlya)
- Twitter: [@mr_amlya](https://twitter.com/mr_amlya)
- LinkedIn: [mramlya](https://linkedin.com/in/mramlya)
- Email: asbhadane21@gmail.com

### 4. SEO & Analytics (Optional)

Add to your site:
- Google Analytics
- Google Search Console
- Meta tags for social sharing
- Favicon (already done ✓)

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Test locally first
npm run build

# Check for TypeScript errors
npm run lint
```

### Environment Variables Not Working

1. Verify variables are added in Vercel
2. Redeploy after adding variables
3. Check variable names (case-sensitive)

### Authentication Issues

1. Verify `NEXTAUTH_URL` matches your domain
2. Regenerate `NEXTAUTH_SECRET`
3. Clear cookies and try again

### Data Not Persisting

- File-based storage doesn't work in Vercel production
- Migrate to database (see Database section above)
- Data resets on each deployment

---

## 📊 Performance Optimization

Your build is already optimized:
- ✅ Static page generation
- ✅ Code splitting
- ✅ Image optimization ready
- ✅ CSS optimization

### Further Optimizations

1. **Enable Caching**
   ```typescript
   // In API routes
   res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
   ```

2. **Add Analytics**
   ```bash
   npm install @vercel/analytics
   ```

3. **Monitor Performance**
   - Use Vercel Speed Insights
   - Check Lighthouse scores

---

## 🔒 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] Protected API routes
- [x] CSRF protection (NextAuth)
- [x] Environment variables secure
- [x] Admin-only routes protected
- [ ] Rate limiting (add if needed)
- [ ] CORS configuration (add if needed)

---

## 📱 Domain Setup (Custom Domain)

### Add Custom Domain to Vercel

1. **Buy a domain** (Namecheap, GoDaddy, etc.)

2. **Add to Vercel:**
   - Project Settings → Domains
   - Enter your domain: `unheardechoes.com`
   - Follow DNS configuration steps

3. **Update Environment:**
   ```
   NEXTAUTH_URL=https://unheardechoes.com
   ```

4. **Redeploy**

---

## 🎉 You're Live!

Your "Unheard Echoes" platform is now live and accessible worldwide!

### Share Your Site

```
🎭 Unheard Echoes
Where unspoken words find their voice

Visit: https://your-domain.vercel.app
Built by @mr_amlya
```

### Next Steps

1. Share on social media
2. Add content
3. Engage with visitors
4. Monitor analytics
5. Keep improving!

---

## 📞 Support

If you need help:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- NextAuth Docs: https://next-auth.js.org

---

**Congratulations on your deployment! 🚀✨**

