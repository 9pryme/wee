-- Add tracking_url column to utm_links table
ALTER TABLE utm_links
ADD COLUMN tracking_url TEXT NOT NULL;

-- Create index for faster lookups
CREATE INDEX idx_utm_links_tracking_url ON utm_links(tracking_url); 