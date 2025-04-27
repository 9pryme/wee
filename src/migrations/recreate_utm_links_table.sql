-- Drop existing table and policies
DROP TABLE IF EXISTS utm_links CASCADE;

-- Create the table with all columns
CREATE TABLE utm_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    volunteer_name TEXT NOT NULL,
    utm_source TEXT NOT NULL,
    utm_medium TEXT NOT NULL,
    utm_campaign TEXT NOT NULL,
    full_url TEXT NOT NULL,
    tracking_url TEXT NOT NULL,
    tracking_id TEXT NOT NULL UNIQUE,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on tracking_id for faster lookups
CREATE INDEX idx_utm_links_tracking_id ON utm_links(tracking_id);

-- Enable RLS
ALTER TABLE utm_links ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public to insert utm_links"
ON utm_links
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public to select utm_links"
ON utm_links
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public to update utm_links"
ON utm_links
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public to delete utm_links"
ON utm_links
FOR DELETE
TO public
USING (true);

-- Grant permissions to public
GRANT ALL ON utm_links TO public;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_utm_links_updated_at
    BEFORE UPDATE ON utm_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 