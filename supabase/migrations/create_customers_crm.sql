-- 고객 CRM 테이블 및 연동

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_number text UNIQUE,
  company text,
  contact_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  website text,
  business_number text,
  memo text,
  status text NOT NULL DEFAULT '신규',
  last_contacted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customers_status_check CHECK (
    status IN ('신규', '상담중', '진행중', '완료', '휴면')
  )
);

CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers (phone);
CREATE INDEX IF NOT EXISTS customers_email_idx ON customers (lower(email));
CREATE INDEX IF NOT EXISTS customers_company_idx ON customers (company);
CREATE INDEX IF NOT EXISTS customers_status_idx ON customers (status);
CREATE INDEX IF NOT EXISTS customers_created_at_idx ON customers (created_at DESC);
CREATE INDEX IF NOT EXISTS customers_last_contacted_at_idx ON customers (last_contacted_at DESC NULLS LAST);

CREATE TABLE IF NOT EXISTS customer_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  consulted_at timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_consultations_type_check CHECK (
    type IN ('전화', '카카오톡', '방문', '이메일', '기타')
  )
);

CREATE INDEX IF NOT EXISTS customer_consultations_customer_id_idx
  ON customer_consultations (customer_id, consulted_at DESC);

CREATE TABLE IF NOT EXISTS customer_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customer_attachments_customer_id_idx
  ON customer_attachments (customer_id, created_at DESC);

-- customer_id FK on CRM tables
ALTER TABLE estimate_inquiries
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE estimates
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'activity_logs'
  ) THEN
    ALTER TABLE activity_logs
      ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS estimate_inquiries_customer_id_idx ON estimate_inquiries (customer_id);
CREATE INDEX IF NOT EXISTS estimates_customer_id_idx ON estimates (customer_id);
CREATE INDEX IF NOT EXISTS contracts_customer_id_idx ON contracts (customer_id);
CREATE INDEX IF NOT EXISTS projects_customer_id_idx ON projects (customer_id);
CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON payments (customer_id);

-- 고객번호 자동 생성
CREATE OR REPLACE FUNCTION public.generate_customer_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  today text;
  seq int;
BEGIN
  today := to_char(now() AT TIME ZONE 'Asia/Seoul', 'YYYYMMDD');
  SELECT count(*) + 1 INTO seq
  FROM customers
  WHERE customer_number LIKE 'CUS-' || today || '-%';
  RETURN 'CUS-' || today || '-' || lpad(seq::text, 3, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_customer_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.customer_number IS NULL OR NEW.customer_number = '' THEN
    NEW.customer_number := public.generate_customer_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_customers_number ON customers;
CREATE TRIGGER set_customers_number
BEFORE INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION public.set_customer_number();

DROP TRIGGER IF EXISTS set_customers_updated_at ON customers;
CREATE TRIGGER set_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage customers" ON customers;
CREATE POLICY "Admins manage customers"
  ON customers FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage customer_consultations" ON customer_consultations;
CREATE POLICY "Admins manage customer_consultations"
  ON customer_consultations FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage customer_attachments" ON customer_attachments;
CREATE POLICY "Admins manage customer_attachments"
  ON customer_attachments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Storage bucket (customer attachments)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-attachments',
  'customer-attachments',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins upload customer attachments" ON storage.objects;
CREATE POLICY "Admins upload customer attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'customer-attachments' AND public.is_admin());

DROP POLICY IF EXISTS "Admins read customer attachments" ON storage.objects;
CREATE POLICY "Admins read customer attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'customer-attachments' AND public.is_admin());

DROP POLICY IF EXISTS "Admins delete customer attachments" ON storage.objects;
CREATE POLICY "Admins delete customer attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'customer-attachments' AND public.is_admin());

-- 기존 문의 데이터로 고객 백필 (전화번호 기준, 이메일 보조)
INSERT INTO customers (company, contact_name, phone, email, status, last_contacted_at, created_at)
SELECT DISTINCT ON (regexp_replace(phone, '[^0-9]', '', 'g'))
  company,
  name,
  phone,
  email,
  CASE
    WHEN status IN ('상담중') THEN '상담중'
    WHEN status IN ('작업중', '견적서작성', '계약완료') THEN '진행중'
    WHEN status = '완료' THEN '완료'
    ELSE '신규'
  END,
  COALESCE(last_contacted_at, created_at),
  created_at
FROM estimate_inquiries
WHERE phone IS NOT NULL AND trim(phone) <> ''
ORDER BY regexp_replace(phone, '[^0-9]', '', 'g'), created_at ASC;

-- 백필된 고객과 문의 연결 (전화번호 정규화 매칭)
UPDATE estimate_inquiries ei
SET customer_id = c.id
FROM customers c
WHERE ei.customer_id IS NULL
  AND regexp_replace(ei.phone, '[^0-9]', '', 'g') = regexp_replace(c.phone, '[^0-9]', '', 'g');

UPDATE estimates e
SET customer_id = ei.customer_id
FROM estimate_inquiries ei
WHERE e.inquiry_id = ei.id AND e.customer_id IS NULL AND ei.customer_id IS NOT NULL;

UPDATE contracts c
SET customer_id = COALESCE(
  (SELECT customer_id FROM estimate_inquiries WHERE id = c.inquiry_id),
  (SELECT customer_id FROM estimates WHERE id = c.estimate_id)
)
WHERE c.customer_id IS NULL;

UPDATE projects p
SET customer_id = COALESCE(
  (SELECT customer_id FROM estimate_inquiries WHERE id = p.inquiry_id),
  (SELECT customer_id FROM contracts WHERE id = p.contract_id)
)
WHERE p.customer_id IS NULL;

UPDATE payments pay
SET customer_id = COALESCE(
  (SELECT customer_id FROM contracts WHERE id = pay.contract_id),
  (SELECT customer_id FROM projects WHERE id = pay.project_id),
  (SELECT customer_id FROM estimate_inquiries WHERE id = pay.inquiry_id)
)
WHERE pay.customer_id IS NULL;
