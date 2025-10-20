# Coolify Deployment Guide

## Quick Start

Your Next.js app is now configured for static export and ready to deploy on Coolify.

## Deployment Options

### Option 1: Docker Deployment (Recommended)

**What's included:**
- `Dockerfile` - Multi-stage build (Node.js builder + Nginx server)
- `nginx.conf` - Optimized Nginx configuration with gzip and caching
- `.dockerignore` - Excludes unnecessary files from Docker build

**Steps:**

1. Push code to Git repository (GitHub/GitLab/Gitea)

2. In Coolify:
   - **New Resource** → **Application**
   - Select your repository
   - Coolify auto-detects Dockerfile
   - Add environment variable (optional):
     ```
     NEXT_PUBLIC_API_BASE_URL=http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io
     ```
   - Click **Deploy**

**That's it!** Coolify builds the Docker image and serves on port 80.

---

### Option 2: Static Site Deployment

**Steps:**

1. Build locally:
   ```bash
   npm run build
   ```

2. In Coolify:
   - **New Resource** → **Static Site**
   - Connect repository OR upload `out/` folder
   - Set:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `out`
   - Deploy

---

## Configuration Files

### `next.config.mjs`
```js
output: 'export'           // Enable static HTML export
images: { unoptimized: true }  // Disable image optimization for static export
```

### Static Export
- Generates standalone HTML/CSS/JS in `out/` directory
- No Node.js server required
- Works with any static hosting (Nginx, Apache, S3, etc.)

---

## Environment Variables

**Client-side API URL** (optional, falls back to default):
```env
NEXT_PUBLIC_API_BASE_URL=http://your-api-url.com
```

Set in Coolify → Application Settings → Environment Variables

---

## Verification

**Test static build locally:**
```bash
npm run build
ls out/  # Should show index.html, analytics.html, etc.
```

**Test with local server:**
```bash
npx serve out
```

**Test Docker build locally:**
```bash
docker build -t moodmarket-test .
docker run -p 8080:80 moodmarket-test
# Visit http://localhost:8080
```

---

## Performance Features

✅ Static HTML generation (fast page loads)  
✅ Nginx with gzip compression  
✅ Aggressive asset caching (1 year for static files)  
✅ CSR data fetching via React Query (client-side API calls)  
✅ Responsive design (mobile-first)  
✅ Dark mode support  

---

## Troubleshooting

**Build fails on Coolify:**
- Check build logs for errors
- Verify Node.js version (requires 18+)
- Check environment variables are set correctly

**API calls fail:**
- Verify `NEXT_PUBLIC_API_BASE_URL` is set
- Check CORS settings on API server
- Verify API is accessible from Coolify server

**Pages show 404:**
- Ensure Nginx config is copied correctly in Dockerfile
- Check `try_files` directive in nginx.conf

---

## Support

For Coolify-specific issues, see [Coolify Docs](https://coolify.io/docs)
