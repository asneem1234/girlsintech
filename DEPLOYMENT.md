# Deployment Guide for Girlsin.tech Blog

This guide outlines how to deploy your blog project with a Node.js Express backend and Supabase database.

## Prerequisites

- GitHub account
- Supabase account
- Render or Heroku account for backend deployment
- Netlify or Vercel account for frontend deployment

## Step 1: Set Up Supabase Database

1. Log in to your Supabase dashboard (https://app.supabase.io)
2. Create a new project and note your project URL and API key
3. Open the SQL Editor and run the SQL commands from `schema.sql`
4. Verify that the `blogs` table was created successfully

## Step 2: Deploy Backend (Node.js Express)

### Option 1: Deploy to Render

1. Push your code to GitHub
2. Log in to Render and create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Name: `girlsin-tech-api` (or your preferred name)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add the following environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `PORT` (Render will use its own PORT, but you can set this as a fallback)
   - `NODE_ENV=production`
6. Deploy the service

### Option 2: Deploy to Heroku

1. Install Heroku CLI and log in
2. Initialize a git repository if not already done
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Create a Heroku app
   ```
   heroku create girlsin-tech-api
   ```
4. Set environment variables
   ```
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_ANON_KEY=your_supabase_anon_key
   heroku config:set NODE_ENV=production
   ```
5. Deploy your app
   ```
   git push heroku main
   ```

## Step 3: Deploy Frontend (Static HTML/CSS/JS)

### Option 1: Deploy to Netlify

1. Push your code to GitHub
2. Log in to Netlify and create a new site from Git
3. Connect your GitHub repository
4. Configure build settings:
   - Base directory: (leave blank)
   - Build command: (leave blank)
   - Publish directory: `.` (current directory)
5. Deploy the site

### Option 2: Deploy to Vercel

1. Push your code to GitHub
2. Log in to Vercel and create a new project
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Other
   - Root Directory: ./
5. Deploy the project

## Step 4: Update API URL in Frontend

After deploying both the backend and frontend, update the API_URL in your JavaScript files:

1. Open `js/author.js` and `js/blog.js`
2. Update the `API_URL` constant with your backend URL:
   ```javascript
   const API_URL = 'https://your-backend-url.onrender.com/api/blogs';
   ```

## Step 5: Handle CORS Issues

If you encounter CORS issues (frontend cannot connect to backend):

1. Verify your backend CORS configuration in `server.js`
2. You may need to update the CORS settings to specifically allow your frontend domain:

```javascript
// In server.js
app.use(cors({
  origin: ['https://your-frontend-domain.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

## Step 6: Verify Deployment

1. Open your deployed frontend application
2. Try creating a blog post in the author panel
3. Navigate to the blog page to confirm that your post appears
4. Test all functionality: creating, viewing, and deleting posts

## Troubleshooting

### Backend Issues
- Check Render/Heroku logs for any errors
- Verify environment variables are correctly set
- Ensure your Supabase credentials are valid

### Frontend Issues
- Check browser console for any JavaScript errors
- Verify the API URL is correct
- Test API endpoints using a tool like Postman

### Database Issues
- Check Supabase logs for errors
- Verify table structure matches expected schema
- Test queries directly in the Supabase SQL Editor

## Ongoing Maintenance

- Monitor your application performance
- Set up logging and error tracking
- Consider adding authentication if needed
- Back up your database regularly
