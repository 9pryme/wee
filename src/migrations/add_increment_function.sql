-- Create increment function for atomic updates
CREATE OR REPLACE FUNCTION increment(column_name text, x integer)
RETURNS integer AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql; 