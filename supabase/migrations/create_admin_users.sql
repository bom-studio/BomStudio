-- 관리자 사용자 테이블 (Supabase Auth user_id 기준)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_users_user_id_idx ON admin_users (user_id);
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users (lower(email));

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 관리자 여부: admin_users 또는 admin_emails (하위 호환)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users
    WHERE user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM admin_emails
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

DROP POLICY IF EXISTS "Admins can read admin_users" ON admin_users;

CREATE POLICY "Admins can read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 기존 admin_emails 등록자를 admin_users로 이전하려면
-- Supabase Auth에서 해당 사용자의 uuid를 확인한 뒤 아래처럼 등록하세요.
-- INSERT INTO admin_users (user_id, email)
-- VALUES ('<auth-user-uuid>', 'bomstudio22@gmail.com')
-- ON CONFLICT (user_id) DO NOTHING;
