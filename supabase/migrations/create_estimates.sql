CREATE TABLE IF NOT EXISTS estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES estimate_inquiries(id) ON DELETE CASCADE,
  estimate_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  company text,
  phone text,
  email text,
  business_type text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal bigint NOT NULL DEFAULT 0,
  vat bigint NOT NULL DEFAULT 0,
  total bigint NOT NULL DEFAULT 0,
  payment_terms text,
  memo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS estimates_inquiry_id_idx
  ON estimates (inquiry_id);

CREATE INDEX IF NOT EXISTS estimates_created_at_idx
  ON estimates (created_at DESC);

DROP TRIGGER IF EXISTS set_estimates_updated_at ON estimates;

CREATE TRIGGER set_estimates_updated_at
BEFORE UPDATE ON estimates
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read estimates" ON estimates;
DROP POLICY IF EXISTS "Admins can insert estimates" ON estimates;
DROP POLICY IF EXISTS "Admins can update estimates" ON estimates;
DROP POLICY IF EXISTS "Admins can delete estimates" ON estimates;

CREATE POLICY "Admins can read estimates"
  ON estimates
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert estimates"
  ON estimates
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update estimates"
  ON estimates
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete estimates"
  ON estimates
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
