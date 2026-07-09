CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid REFERENCES estimate_inquiries(id) ON DELETE SET NULL,
  estimate_id uuid REFERENCES estimates(id) ON DELETE SET NULL,
  contract_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  company text,
  phone text,
  email text,
  project_title text,
  contract_amount bigint NOT NULL DEFAULT 0,
  down_payment_amount bigint NOT NULL DEFAULT 0,
  balance_payment_amount bigint NOT NULL DEFAULT 0,
  contract_type text NOT NULL DEFAULT '신규제작',
  billing_cycle text NOT NULL DEFAULT '없음',
  start_date date,
  end_date date,
  contract_terms text,
  special_terms text,
  status text NOT NULL DEFAULT '작성중',
  memo text,
  down_payment_status text NOT NULL DEFAULT '미납',
  balance_payment_status text NOT NULL DEFAULT '미납',
  signature_status text NOT NULL DEFAULT '미서명',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contracts_inquiry_id_idx ON contracts (inquiry_id);
CREATE INDEX IF NOT EXISTS contracts_estimate_id_idx ON contracts (estimate_id);
CREATE INDEX IF NOT EXISTS contracts_created_at_idx ON contracts (created_at DESC);
CREATE INDEX IF NOT EXISTS contracts_status_idx ON contracts (status);

DROP TRIGGER IF EXISTS set_contracts_updated_at ON contracts;

CREATE TRIGGER set_contracts_updated_at
BEFORE UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read contracts" ON contracts;
DROP POLICY IF EXISTS "Admins can insert contracts" ON contracts;
DROP POLICY IF EXISTS "Admins can update contracts" ON contracts;
DROP POLICY IF EXISTS "Admins can delete contracts" ON contracts;

CREATE POLICY "Admins can read contracts"
  ON contracts FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert contracts"
  ON contracts FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update contracts"
  ON contracts FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete contracts"
  ON contracts FOR DELETE TO authenticated
  USING (public.is_admin());
