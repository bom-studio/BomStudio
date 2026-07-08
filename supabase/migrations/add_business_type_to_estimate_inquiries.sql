ALTER TABLE estimate_inquiries
  ADD COLUMN IF NOT EXISTS business_type text;
