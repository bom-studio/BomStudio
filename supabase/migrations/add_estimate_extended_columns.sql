-- estimates 테이블 확장 컬럼
ALTER TABLE estimates
  ADD COLUMN IF NOT EXISTS vat_type text DEFAULT '별도',
  ADD COLUMN IF NOT EXISTS delivery_period text,
  ADD COLUMN IF NOT EXISTS valid_until date,
  ADD COLUMN IF NOT EXISTS request_summary text,
  ADD COLUMN IF NOT EXISTS reference_urls text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT '작성중',
  ADD COLUMN IF NOT EXISTS form_snapshot jsonb;

-- 문의당 견적서 1건
CREATE UNIQUE INDEX IF NOT EXISTS estimates_inquiry_id_unique
  ON estimates (inquiry_id);
