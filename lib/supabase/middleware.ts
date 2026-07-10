import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminEmail, getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

async function isAdminAccount(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  email: string
): Promise<boolean> {
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminUser) return true;

  const normalizedEmail = email.toLowerCase();
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

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    if (!user?.email) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const isAdmin = await isAdminAccount(supabase, user.id, user.email);
    if (!isAdmin) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  if (isLoginPage && user?.email) {
    const isAdmin = await isAdminAccount(supabase, user.id, user.email);
    if (isAdmin) {
      const redirectTo = request.nextUrl.searchParams.get("redirect");
      const url = request.nextUrl.clone();
      url.pathname =
        redirectTo && redirectTo.startsWith("/admin") && redirectTo !== "/admin/login"
          ? redirectTo
          : "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
