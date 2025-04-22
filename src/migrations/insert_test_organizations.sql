-- Insert test organizations
INSERT INTO organizations (code, name, email, created_at, updated_at)
VALUES 
  ('ACCESS', 'Access Bank', 'contact@accessbank.com', NOW(), NOW()),
  ('ZENITH', 'Zenith Bank', 'contact@zenithbank.com', NOW(), NOW()),
  ('UBA', 'United Bank for Africa', 'contact@ubagroup.com', NOW(), NOW()),
  ('GTB', 'Guaranty Trust Bank', 'contact@gtbank.com', NOW(), NOW()),
  ('FCMB', 'First City Monument Bank', 'contact@fcmb.com', NOW(), NOW())
ON CONFLICT (code) DO UPDATE 
SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  updated_at = NOW(); 