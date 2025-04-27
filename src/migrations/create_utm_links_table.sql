-- Create utm_links table
CREATE TABLE IF NOT EXISTS utm_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    volunteer_name TEXT NOT NULL,
    base_url TEXT DEFAULT 'https://weewantmore.ng/petition',
    utm_source TEXT NOT NULL,
    utm_medium TEXT NOT NULL,
    utm_campaign TEXT NOT NULL DEFAULT 'WEE',
    full_url TEXT NOT NULL,
    tracking_url TEXT NOT NULL,
    tracking_id TEXT NOT NULL UNIQUE,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on full_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_utm_links_full_url ON utm_links(full_url);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_utm_links_created_at ON utm_links(created_at);

-- Create index on tracking_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_utm_links_tracking_id ON utm_links(tracking_id);

-- Create index on utm_campaign for filtering
CREATE INDEX IF NOT EXISTS idx_utm_links_campaign ON utm_links(utm_campaign);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_utm_links_volunteer_name ON utm_links(volunteer_name);

-- Add RLS policies
ALTER TABLE utm_links ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all UTM links
CREATE POLICY "Allow authenticated users to read all UTM links"
  ON utm_links
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to insert UTM links
CREATE POLICY "Allow authenticated users to insert UTM links"
  ON utm_links
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update their own UTM links
CREATE POLICY "Allow authenticated users to update their own UTM links"
  ON utm_links
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete their own UTM links
CREATE POLICY "Allow authenticated users to delete their own UTM links"
  ON utm_links
  FOR DELETE
  TO authenticated
  USING (true); 