-- projects.status CHECK 제약을 앱 상태값과 일치시킨다.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

ALTER TABLE projects
  ALTER COLUMN status SET DEFAULT '대기중';

ALTER TABLE projects
  ADD CONSTRAINT projects_status_check CHECK (
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
  );
