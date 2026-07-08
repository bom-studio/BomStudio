-- CRM 확장 컬럼 추가
ALTER TABLE estimate_inquiries
  ADD COLUMN IF NOT EXISTS inquiry_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS estimate_id uuid,
  ADD COLUMN IF NOT EXISTS contract_id uuid,
  ADD COLUMN IF NOT EXISTS project_id uuid,
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS estimate_created_at timestamptz;

CREATE INDEX IF NOT EXISTS estimate_inquiries_inquiry_number_idx
  ON estimate_inquiries (inquiry_number);

CREATE INDEX IF NOT EXISTS estimate_inquiries_estimate_id_idx
  ON estimate_inquiries (estimate_id);

-- 문의번호 자동 생성 (EST-YYYYMMDD-001)
CREATE OR REPLACE FUNCTION public.generate_inquiry_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  date_part text;
  seq_num int;
BEGIN
  IF NEW.inquiry_number IS NOT NULL THEN
    RETURN NEW;
  END IF;

  date_part := to_char(NEW.created_at AT TIME ZONE 'Asia/Seoul', 'YYYYMMDD');

  SELECT count(*) + 1 INTO seq_num
  FROM estimate_inquiries
  WHERE to_char(created_at AT TIME ZONE 'Asia/Seoul', 'YYYYMMDD') = date_part
    AND id IS DISTINCT FROM NEW.id;

  NEW.inquiry_number := 'EST-' || date_part || '-' || lpad(seq_num::text, 3, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_estimate_inquiry_number ON estimate_inquiries;

CREATE TRIGGER set_estimate_inquiry_number
BEFORE INSERT ON estimate_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.generate_inquiry_number();

-- 기존 데이터에 문의번호 백필
WITH numbered AS (
  SELECT
    id,
    'EST-' ||
    to_char(created_at AT TIME ZONE 'Asia/Seoul', 'YYYYMMDD') || '-' ||
    lpad(
      row_number() OVER (
        PARTITION BY to_char(created_at AT TIME ZONE 'Asia/Seoul', 'YYYYMMDD')
        ORDER BY created_at
      )::text,
      3,
      '0'
    ) AS generated_number
  FROM estimate_inquiries
  WHERE inquiry_number IS NULL
)
UPDATE estimate_inquiries ei
SET inquiry_number = numbered.generated_number
FROM numbered
WHERE ei.id = numbered.id;
