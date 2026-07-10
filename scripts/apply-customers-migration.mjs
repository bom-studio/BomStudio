import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(resolve(root, ".env.local"));
loadEnvFile(resolve(root, ".env"));

const dbUrl =
  process.env.SUPABASE_DB_URL ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL;

if (!dbUrl) {
  console.error(`
[오류] 데이터베이스 연결 URL이 없습니다.

.env.local 에 아래 중 하나를 추가한 뒤 다시 실행하세요.

SUPABASE_DB_URL=postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres

Supabase 대시보드 → Project Settings → Database → Connection string (URI) 에서 복사할 수 있습니다.

또는 Supabase SQL Editor 에서 다음 파일 내용을 직접 실행하세요.
  supabase/migrations/create_customers_crm.sql
`);
  process.exit(1);
}

const sqlPath = resolve(root, "supabase/migrations/create_customers_crm.sql");
const sql = readFileSync(sqlPath, "utf8");

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("고객 CRM 마이그레이션 실행 중...");
  await client.query(sql);
  console.log("완료: customers 테이블 및 연동 컬럼이 생성되었습니다.");
} catch (error) {
  console.error("[오류] 마이그레이션 실패:", error.message);
  process.exit(1);
} finally {
  await client.end();
}
