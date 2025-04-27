-- Add tracking_id column to utm_links table
ALTER TABLE utm_links
ADD COLUMN IF NOT EXISTS tracking_id TEXT NOT NULL DEFAULT gen_random_uuid()::text;

-- Create index on tracking_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_utm_links_tracking_id ON utm_links(tracking_id); 