// Supabase configuration
const SUPABASE_URL = 'https://kamsmroessqmkferhmsk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wJYHJWpHmmfwyzVKzUo_oA_F5G8Ujtu';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
