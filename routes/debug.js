// debug.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

/**
 * GET /api/debug/supabase
 * Check Supabase connection and configuration
 */
router.get('/supabase', async (req, res) => {
  try {
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    // Mask the key for security in the response
    const maskedKey = supabaseKey ? 
      `${supabaseKey.substring(0, 10)}...${supabaseKey.substring(supabaseKey.length - 5)}` : 
      'Not provided';
    
    // Check if credentials exist
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: 'Supabase credentials missing in environment variables',
        debug: {
          supabaseUrl: supabaseUrl || 'Not provided',
          supabaseKey: maskedKey,
          envKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
        }
      });
    }
    
    // Try to create a client and make a simple query
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection with a simple query to check access
    const { data, error } = await supabase.from('blogs').select('count').limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Supabase connection failed',
        error: error,
        debug: {
          supabaseUrl,
          supabaseKey: maskedKey
        }
      });
    }
    
    // Try to get table information
    const { data: tableInfo, error: tableError } = await supabase
      .from('blogs')
      .select('*')
      .limit(0);
      
    // Check if blogs table exists
    res.status(200).json({
      success: true,
      message: 'Supabase connection successful',
      tableExists: !tableError,
      tableError: tableError,
      debug: {
        supabaseUrl,
        supabaseKey: maskedKey,
        databaseConnected: !!data,
        tableColumns: tableInfo ? Object.keys(tableInfo.length > 0 ? tableInfo[0] : {}) : []
      }
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in debug endpoint',
      error: error.message
    });
  }
});

module.exports = router;
