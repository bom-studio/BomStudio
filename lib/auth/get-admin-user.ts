import type { User } from "@supabase/supabase-js";
import { getAdminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export interface AdminUserInfo {
  id: string;
  email: string;
  role: string;
}

async function isAdminUser(user: User): Promise<AdminUserInfo | null> {
  const supabase = await createClient();
  const email = user.email?.toLowerCase() ?? "";

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminUser) {
    return {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role ?? "admin",
    };
  }

  const adminEmail = getAdminEmail();
  if (adminEmail && email === adminEmail.toLowerCase()) {
    return {
      id: user.id,
      email: user.email ?? email,
      role: "admin",
    };
  }

  const { data: adminRow } = await supabase
    .from("admin_emails")
    .select("email")
    .ilike("email", email)
    .maybeSingle();

  if (adminRow) {
    return {
      id: user.id,
      email: adminRow.email,
      role: "admin",
    };
  }

  return null;
}

export async function getAdminUser(): Promise<(User & { admin: AdminUserInfo }) | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return null;
  }

  const admin = await isAdminUser(user);
  if (!admin) {
    return null;
  }

  return { ...user, admin };
}
