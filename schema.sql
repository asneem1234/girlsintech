-- Create blogs table in Supabase
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  image TEXT,
  profilePic VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster sorting by date
CREATE INDEX blogs_created_at_idx ON blogs(created_at DESC);

-- Add RLS (Row Level Security) policies if needed for authenticated users
-- ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read
-- CREATE POLICY "Allow public read access" ON blogs FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert
-- CREATE POLICY "Allow authenticated insert" ON blogs FOR INSERT TO authenticated USING (true);

-- Create policy to allow users to update their own posts (if you add user_id later)
-- CREATE POLICY "Allow owners to update" ON blogs FOR UPDATE TO authenticated USING (auth.uid() = user_id);
