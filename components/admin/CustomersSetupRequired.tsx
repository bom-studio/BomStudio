import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomersSetupRequired() {
  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="text-lg">고객 CRM 데이터베이스 설정이 필요합니다</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Supabase에 <code className="rounded bg-muted px-1.5 py-0.5">customers</code> 테이블이 아직
          생성되지 않았습니다. 아래 방법 중 하나로 마이그레이션을 실행해 주세요.
        </p>

        <div className="space-y-2">
          <p className="font-medium text-foreground">방법 1 — Supabase SQL Editor (권장)</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Supabase 대시보드 → SQL Editor 열기</li>
            <li>
              프로젝트의{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">
                supabase/migrations/create_customers_crm.sql
              </code>{" "}
              파일 내용 전체 복사
            </li>
            <li>붙여넣기 후 Run 실행</li>
            <li>이 페이지 새로고침</li>
          </ol>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-foreground">방법 2 — 로컬 스크립트</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code>에{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">SUPABASE_DB_URL</code> 추가 (Database
              Connection string)
            </li>
            <li>
              터미널에서{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">npm run db:migrate:customers</code>{" "}
              실행
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
