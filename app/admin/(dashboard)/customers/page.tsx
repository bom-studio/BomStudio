import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata = {
  title: "고객 관리",
};

export default function AdminCustomersPage() {
  return (
    <AdminPlaceholder
      title="고객 관리"
      description="고객 관리 기능을 준비 중입니다. 현재는 프로젝트 관리 메뉴에서 고객 프로젝트를 확인할 수 있습니다."
    />
  );
}
