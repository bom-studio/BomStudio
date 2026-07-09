-- 관리자 이메일 허용 목록
CREATE TABLE IF NOT EXISTS admin_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 견적문의
CREATE TABLE IF NOT EXISTS estimate_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  name text NOT NULL,
  phone text NOT NULL,
  email text,
  company text,
  business_type text,
  budget text,
  schedule text,
  pages text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  reference text,
  message text,

  admin_note text,
  status text NOT NULL DEFAULT '접수완료',

  CONSTRAINT estimate_inquiries_status_check CHECK (
    status IN ('접수완료', '상담중', '견적서작성', '계약완료', '보류')
  )
);

CREATE INDEX IF NOT EXISTS estimate_inquiries_created_at_idx
  ON estimate_inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS estimate_inquiries_status_idx
  ON estimate_inquiries (status);

CREATE INDEX IF NOT EXISTS estimate_inquiries_phone_idx
  ON estimate_inquiries (phone);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_estimate_inquiries_updated_at ON estimate_inquiries;

CREATE TRIGGER set_estimate_inquiries_updated_at
BEFORE UPDATE ON estimate_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_inquiries ENABLE ROW LEVEL SECURITY;

-- 관리자 여부 확인 함수
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_emails
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 기존 정책 중복 방지
DROP POLICY IF EXISTS "Admins can read admin_emails" ON admin_emails;
DROP POLICY IF EXISTS "Anyone can insert estimate inquiries" ON estimate_inquiries;
DROP POLICY IF EXISTS "Admins can read estimate inquiries" ON estimate_inquiries;
DROP POLICY IF EXISTS "Admins can update estimate inquiries" ON estimate_inquiries;
DROP POLICY IF EXISTS "Admins can delete estimate inquiries" ON estimate_inquiries;

-- admin_emails: 관리자만 조회
CREATE POLICY "Admins can read admin_emails"
  ON admin_emails
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- estimate_inquiries: 누구나 insert
CREATE POLICY "Anyone can insert estimate inquiries"
  ON estimate_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- estimate_inquiries: 관리자만 select/update/delete
CREATE POLICY "Admins can read estimate inquiries"
  ON estimate_inquiries
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update estimate inquiries"
  ON estimate_inquiries
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete estimate inquiries"
  ON estimate_inquiries
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 관리자 이메일 등록
INSERT INTO admin_emails (email)
VALUES ('bomstudio22@gmail.com')
ON CONFLICT (email) DO NOTHING;