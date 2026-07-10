import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/get-admin-user";

export { getAdminUser } from "@/lib/auth/get-admin-user";
export type { AdminUserInfo } from "@/lib/auth/get-admin-user";

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
