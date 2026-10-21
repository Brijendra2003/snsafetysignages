import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string; name: string };

/**
 * Data Access Layer entry point for the admin area. Returns the signed-in
 * admin, or null when the visitor is signed out or not listed in admin_users.
 * Memoised per request so layouts, pages and actions can all call it.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  // Always evaluate per request, never at build time (even before Supabase is configured).
  await connection();
  if (!isSupabaseConfigured) return null;

  const supabase = await createSessionClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims?.sub) return null;

  const { data: row } = await supabase
    .from("admin_users")
    .select("user_id, full_name")
    .eq("user_id", claims.sub)
    .maybeSingle();
  if (!row) return null;

  const email = typeof claims.email === "string" ? claims.email : "";
  return { id: claims.sub, email, name: row.full_name || email.split("@")[0] || "Admin" };
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Session client plus the verified admin, for admin-only queries and mutations. */
export async function adminDb() {
  const admin = await requireAdmin();
  const supabase = await createSessionClient();
  return { admin, supabase };
}
