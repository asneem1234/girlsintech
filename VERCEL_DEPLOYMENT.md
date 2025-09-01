# Deploying to Vercel

This guide will help you deploy the Girlsin.tech project to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) (optional, for advanced usage)
3. Your Supabase credentials

## Deployment Steps

### Option 1: Automatic Deployment from GitHub

1. Push your code to GitHub if you haven't already
   ```
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. Visit the [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project" and select the GitHub repository

4. Configure the project:
   - Framework Preset: Choose "Other"
   - Root Directory: Leave as `.`
   - Build Command: Leave default
   - Output Directory: Leave default

5. Add Environment Variables:
   - Click "Environment Variables" and add the following:
     - `SUPABASE_URL` = (your Supabase URL)
     - `SUPABASE_ANON_KEY` = (your Supabase anon key)
     - `NODE_ENV` = production
     - `PORT` = 8080 (Vercel will override this, but it's good to set)

6. Click "Deploy" and wait for the deployment to complete

### Option 2: Manual Deployment with Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy your project:
   ```
   vercel
   ```

4. Follow the interactive prompts to configure your project

5. Set up environment variables:
   ```
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   ```

## After Deployment

1. Visit your deployed site at the URL provided by Vercel

2. Update the API_URL in your frontend code:
   - Open `js/blog.js` and `js/author.js`
   - Update the API_URL to your Vercel deployment URL:
   ```javascript
   const API_URL = 'https://your-vercel-url.vercel.app/api/blogs';
   ```

3. Redeploy if necessary:
   ```
   git add .
   git commit -m "Update API URL"
   git push origin main
   ```

## Troubleshooting

- Check the Vercel deployment logs if you encounter any issues
- Ensure your environment variables are set correctly
- Verify CORS settings in your server.js file
- Make sure your Supabase database is accessible from Vercel
