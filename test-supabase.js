// test-supabase.js
// A simple script to test Supabase connection independent of Express

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection:');
console.log('---------------------------');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 10 chars):', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined');
console.log('---------------------------');

// If credentials are missing, exit
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials missing in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Test with a simple query
    const { data, error } = await supabase.from('blogs').select('count');
    
    if (error) {
      console.error('Connection failed:', error);
      return;
    }
    
    console.log('Connection successful!');
    console.log('Data received:', data);
    
    // Test table structure
    const { data: tableData, error: tableError } = await supabase
      .from('blogs')
      .select()
      .limit(1);
      
    if (tableError) {
      console.error('Error fetching table data:', tableError);
      console.log('The blogs table might not exist. Try running the SQL from schema.sql');
    } else {
      console.log('Table structure:');
      if (tableData && tableData.length > 0) {
        console.log(Object.keys(tableData[0]));
      } else {
        console.log('Table exists but has no data');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testConnection();
