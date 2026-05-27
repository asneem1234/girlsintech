import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

# Remove the default RLS block from schema.sql - let's drop them if they exist and recreate
cur.execute('''
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON blogs;
DROP POLICY IF EXISTS "Allow public insert" ON blogs;

CREATE POLICY "Allow public read access" ON blogs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON blogs FOR INSERT WITH CHECK (true);
''')
conn.commit()
print("RLS Policies updated!")
