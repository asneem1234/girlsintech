// Supabase configuration
const SUPABASE_URL = 'https://zadwoqgagqnpuvabqmff.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZHdvcWdhZ3FucHV2YWJxbWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MzkxNjgsImV4cCI6MjA4MzExNTE2OH0.8aHtSY2sQanutbSIRYQ5dBBYzqBjd64rQ5uPkc3dbxI';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
