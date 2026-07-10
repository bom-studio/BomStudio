-- 계약 입금 시각 컬럼
ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS down_payment_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS balance_payment_paid_at timestamptz;

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid REFERENCES estimate_inquiries(id) ON DELETE SET NULL,
  estimate_id uuid REFERENCES estimates(id) ON DELETE SET NULL,
  contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  payment_number text NOT NULL UNIQUE,
  payment_type text NOT NULL,
  amount bigint NOT NULL DEFAULT 0,
  due_date date,
  paid_at timestamptz,
  payment_method text,
  depositor_name text,
  status text NOT NULL DEFAULT '입금대기',
  memo text,
  customer_name text NOT NULL,
  company text,
  phone text,
  email text,
  contract_number text,
  project_title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_type_check CHECK (
    payment_type IN ('계약금', '잔금', '유지보수', '기타')
  ),
  CONSTRAINT payments_status_check CHECK (
    status IN ('입금대기', '입금예정', '입금완료', '부분입금', '연체', '취소', '환불')
  )
);

CREATE INDEX IF NOT EXISTS payments_contract_id_idx ON payments (contract_id);
CREATE INDEX IF NOT EXISTS payments_project_id_idx ON payments (project_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments (status);
CREATE INDEX IF NOT EXISTS payments_payment_type_idx ON payments (payment_type);
CREATE INDEX IF NOT EXISTS payments_paid_at_idx ON payments (paid_at DESC);
CREATE INDEX IF NOT EXISTS payments_due_date_idx ON payments (due_date);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON payments (created_at DESC);

DROP TRIGGER IF EXISTS set_payments_updated_at ON payments;

CREATE TRIGGER set_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read payments" ON payments;
DROP POLICY IF EXISTS "Admins can insert payments" ON payments;
DROP POLICY IF EXISTS "Admins can update payments" ON payments;
DROP POLICY IF EXISTS "Admins can delete payments" ON payments;

CREATE POLICY "Admins can read payments"
  ON payments FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert payments"
  ON payments FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete payments"
  ON payments FOR DELETE TO authenticated
  USING (public.is_admin());

ALTER TABLE activity_logs
  ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES payments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS activity_logs_payment_id_idx ON activity_logs (payment_id);

-- 기존 계약서에서 계약금/잔금 결제 레코드 생성
INSERT INTO payments (
  payment_number,
  contract_id,
  inquiry_id,
  estimate_id,
  customer_name,
  company,
  phone,
  email,
  contract_number,
  project_title,
  payment_type,
  amount,
  status,
  paid_at,
  due_date
)
SELECT
  'PAY-' || to_char(c.created_at, 'YYYYMMDD') || '-D' || upper(substr(replace(c.id::text, '-', ''), 1, 4)),
  c.id,
  c.inquiry_id,
  c.estimate_id,
  c.customer_name,
  c.company,
  c.phone,
  c.email,
  c.contract_number,
  c.project_title,
  '계약금',
  c.down_payment_amount,
  CASE
    WHEN c.down_payment_paid = true OR c.down_payment_status = '입금완료' THEN '입금완료'
    ELSE '입금대기'
  END,
  CASE
    WHEN c.down_payment_paid = true OR c.down_payment_status = '입금완료'
      THEN COALESCE(c.down_payment_paid_at, c.updated_at)
    ELSE NULL
  END,
  c.start_date
FROM contracts c
WHERE c.down_payment_amount > 0
  AND NOT EXISTS (
    SELECT 1 FROM payments p
    WHERE p.contract_id = c.id AND p.payment_type = '계약금'
  );

INSERT INTO payments (
  payment_number,
  contract_id,
  inquiry_id,
  estimate_id,
  customer_name,
  company,
  phone,
  email,
  contract_number,
  project_title,
  payment_type,
  amount,
  status,
  paid_at,
  due_date
)
SELECT
  'PAY-' || to_char(c.created_at, 'YYYYMMDD') || '-B' || upper(substr(replace(c.id::text, '-', ''), 1, 4)),
  c.id,
  c.inquiry_id,
  c.estimate_id,
  c.customer_name,
  c.company,
  c.phone,
  c.email,
  c.contract_number,
  c.project_title,
  '잔금',
  c.balance_payment_amount,
  CASE
    WHEN c.balance_payment_paid = true OR c.balance_payment_status = '입금완료' THEN '입금완료'
    ELSE '입금대기'
  END,
  CASE
    WHEN c.balance_payment_paid = true OR c.balance_payment_status = '입금완료'
      THEN COALESCE(c.balance_payment_paid_at, c.updated_at)
    ELSE NULL
  END,
  c.end_date
FROM contracts c
WHERE c.balance_payment_amount > 0
  AND NOT EXISTS (
    SELECT 1 FROM payments p
    WHERE p.contract_id = c.id AND p.payment_type = '잔금'
  );
