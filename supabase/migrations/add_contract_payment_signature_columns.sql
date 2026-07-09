ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS down_payment_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS balance_payment_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS customer_signed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS studio_signed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS signed_at timestamptz;

-- 기존 status 컬럼 값을 boolean 컬럼으로 백필
UPDATE contracts
SET
  down_payment_paid = down_payment_status = '입금완료',
  balance_payment_paid = balance_payment_status = '입금완료',
  customer_signed = signature_status = '서명완료';
