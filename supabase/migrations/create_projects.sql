CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid REFERENCES estimate_inquiries(id) ON DELETE SET NULL,
  estimate_id uuid REFERENCES estimates(id) ON DELETE SET NULL,
  contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
  project_number text NOT NULL UNIQUE,
  project_title text,
  customer_name text NOT NULL,
  company text,
  phone text,
  email text,
  start_date date,
  due_date date,
  completed_at timestamptz,
  status text NOT NULL DEFAULT '대기중',
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  memo text,
  domain text NOT NULL DEFAULT '',
  hosting text NOT NULL DEFAULT '',
  github_repo text NOT NULL DEFAULT '',
  figma_url text NOT NULL DEFAULT '',
  deployment_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT projects_contract_id_unique UNIQUE (contract_id),
  CONSTRAINT projects_status_check CHECK (
    status IN (
      '대기중',
      '기획',
      '디자인',
      '개발',
      '검수',
      '배포',
      '완료',
      '보류',
      '취소'
    )
  )
);

CREATE INDEX IF NOT EXISTS projects_inquiry_id_idx ON projects (inquiry_id);
CREATE INDEX IF NOT EXISTS projects_estimate_id_idx ON projects (estimate_id);
CREATE INDEX IF NOT EXISTS projects_contract_id_idx ON projects (contract_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects (status);

DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;

CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read projects" ON projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON projects;
DROP POLICY IF EXISTS "Admins can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;

CREATE POLICY "Admins can read projects"
  ON projects FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
  inquiry_id uuid REFERENCES estimate_inquiries(id) ON DELETE SET NULL,
  estimate_id uuid REFERENCES estimates(id) ON DELETE SET NULL,
  type text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_logs_project_id_idx ON activity_logs (project_id);
CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON activity_logs (created_at DESC);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read activity_logs" ON activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity_logs" ON activity_logs;

CREATE POLICY "Admins can read activity_logs"
  ON activity_logs FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert activity_logs"
  ON activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- 프로젝트 CRM 흐름용 문의 상태 확장
ALTER TABLE estimate_inquiries DROP CONSTRAINT IF EXISTS estimate_inquiries_status_check;

ALTER TABLE estimate_inquiries
  ADD CONSTRAINT estimate_inquiries_status_check CHECK (
    status IN ('접수완료', '상담중', '견적서작성', '계약완료', '작업중', '완료', '보류')
  );
