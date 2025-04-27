-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to insert utm_links" ON utm_links;
DROP POLICY IF EXISTS "Allow authenticated users to select utm_links" ON utm_links;
DROP POLICY IF EXISTS "Allow authenticated users to update utm_links" ON utm_links;
DROP POLICY IF EXISTS "Allow authenticated users to delete utm_links" ON utm_links;

-- Enable RLS on utm_links table
ALTER TABLE utm_links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert utm_links"
ON utm_links
FOR INSERT
TO authenticated
WITH CHECK (
  auth.role() = 'authenticated' AND
  tracking_id IS NOT NULL AND
  tracking_url IS NOT NULL AND
  full_url IS NOT NULL
);

-- Create policy to allow authenticated users to select
CREATE POLICY "Allow authenticated users to select utm_links"
ON utm_links
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update utm_links"
ON utm_links
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete utm_links"
ON utm_links
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON utm_links TO authenticated; 