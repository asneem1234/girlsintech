const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// API Routes
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/blogs', async (req, res) => {
  const { title, category, excerpt, content, author, image, profilePic } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO blogs (title, category, excerpt, content, author, image, profilePic) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, category, excerpt, content, author, image, profilePic]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// IF NOT IN VERCEL: Serve static files for local "npm start" usage
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '../')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Local server is running on http://localhost:${PORT}`);
  });
}

// Export the express app so Vercel can treat it as a serverless function!
module.exports = app;