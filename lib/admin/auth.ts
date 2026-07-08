import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return null;
  }

  const adminEmail = getAdminEmail();
  const userEmail = user.email.toLowerCase();

  if (adminEmail && userEmail === adminEmail) {
    return user;
  }

  const { data: adminRow } = await supabase
    .from("admin_emails")
    .select("email")
    .ilike("email", userEmail)
    .maybeSingle();

  if (adminRow) {
    return user;
  }

  return null;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
