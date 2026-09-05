# Browtiful Strokes — Frontend Deployment Guide

## 1. Production Build
To create an optimized production build:
```bash
npm run build
```
This generates standard static assets inside the `frontend/dist/` directory, with gzip-optimized chunks for vendor scripts, icons, and stylesheets.

## 2. Environment Variables for Deployment
Configure the following in your hosting provider (Vercel, Netlify, Render, or Cloudflare Pages):
```env
VITE_API_URL=https://your-backend-api.onrender.com/api/v1
VITE_MEDIA_URL=https://your-backend-api.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_actual_key
VITE_DEMO_MODE=false
```

## 3. Single Page Application (SPA) Rewrite Rules
Since the frontend uses client-side routing with `react-router-dom`, ensure all URL requests rewrite to `index.html`.

### Vercel (`vercel.json`)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify (`_redirects` in `public/`)
```
/*    /index.html   200
```
