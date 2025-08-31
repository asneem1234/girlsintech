// server.js
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request body
app.use(express.static(__dirname)); // Serve static files from root directory

// Routes
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/debug', require('./routes/debug'));

// Set landingpage.html as the default page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/landingpage.html');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware for server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Handle 404 errors - must be after all other routes
app.use((req, res) => {
  // For API requests, return a 404 JSON response
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested API endpoint does not exist'
    });
  }
  
  // For non-API requests, redirect to landing page
  res.redirect('/landingpage.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`
🚀 Server is running!

🏠 Main Page:
   - http://localhost:${PORT}/  (redirects to landingpage.html)

✅ API Endpoints:
   - http://localhost:${PORT}/api/blogs
   - http://localhost:${PORT}/api/debug/supabase  (debug Supabase connection)

📄 HTML Pages:
   - Landing Page: http://localhost:${PORT}/landingpage.html
   - Blog Page: http://localhost:${PORT}/blog.html
   - Author Page: http://localhost:${PORT}/author.html

💡 Health Check: http://localhost:${PORT}/health
  `);
});

module.exports = app; // For testing purposes
