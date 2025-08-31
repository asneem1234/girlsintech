// routes/blogs.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * GET /api/blogs
 * Fetch all blog articles, sorted by date (newest first)
 */
router.get('/', async (req, res) => {
  try {
    // Get query parameters for filtering and pagination
    const { category, limit = 10, offset = 0 } = req.query;
    
    // Start building the query
    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
});

/**
 * GET /api/blogs/:id
 * Fetch a single blog article by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
});

/**
 * POST /api/blogs
 * Create a new blog article
 */
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { title, category, excerpt, content, author } = req.body;
    
    if (!title || !category || !excerpt || !content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, category, excerpt, content, author'
      });
    }
    
    // Insert the blog into Supabase
    const { data, error } = await supabase
      .from('blogs')
      .insert([
        { 
          title, 
          category, 
          excerpt, 
          content, 
          author,
          // created_at and updated_at are handled by Supabase default values
        }
      ])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Blog article created successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog article',
      error: error.message
    });
  }
});

/**
 * PUT /api/blogs/:id
 * Update a blog article by ID
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, excerpt, content, author } = req.body;
    
    // Update the blog
    const { data, error } = await supabase
      .from('blogs')
      .update({ 
        title, 
        category, 
        excerpt, 
        content, 
        author,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Blog article updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog article',
      error: error.message
    });
  }
});

/**
 * DELETE /api/blogs/:id
 * Delete a blog article by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      message: 'Blog article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog article',
      error: error.message
    });
  }
});

module.exports = router;
