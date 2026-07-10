"use server";

import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { getAdminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

function sanitizeRedirect(path?: string | null): string {
  if (!path || !path.startsWith("/admin") || path.startsWith("/admin/login")) {
    return "/admin";
  }
  return path;
}

async function verifyAdminAccount(userId: string, email: string): Promise<boolean> {
  const supabase = await createClient();
  const normalizedEmail = email.toLowerCase();

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminUser) return true;

  const adminEmail = getAdminEmail();
  if (adminEmail && normalizedEmail === adminEmail.toLowerCase()) {
    return true;
  }

  const { data: adminRow } = await supabase
    .from("admin_emails")
    .select("email")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  return Boolean(adminRow);
}

export async function loginAdmin(
  email: string,
  password: string,
  redirectTo?: string | null
): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user?.email) {
    return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const isAdmin = await verifyAdminAccount(data.user.id, data.user.email);
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { success: false, error: "관리자 권한이 없는 계정입니다." };
  }

  redirect(sanitizeRedirect(redirectTo));
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getAdminSessionStatus(): Promise<{
  isAdmin: boolean;
  email?: string;
}> {
  const user = await getAdminUser();
  if (!user) {
    return { isAdmin: false };
  }
  return { isAdmin: true, email: user.email ?? undefined };
}
