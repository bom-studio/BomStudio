ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;

ALTER TABLE payments
  ADD CONSTRAINT payments_status_check CHECK (
    status IN ('입금대기', '입금예정', '입금완료', '부분입금', '연체', '취소', '환불')
  );
