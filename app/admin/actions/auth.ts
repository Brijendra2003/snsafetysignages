"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

function safeNext(next: string) {
  return next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Supabase is not configured yet. Add your keys to .env.local first." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/admin"));

  if (!email || !password) {
    return { ok: false, message: "Enter your email and password.", values: { email } };
  }

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    console.error("[admin sign-in]", error?.code, error?.status, error?.message);
    const message =
      error?.code === "email_not_confirmed"
        ? "This email is not confirmed yet. In Supabase → Authentication → Users, confirm the user (or recreate it with Auto confirm ticked)."
        : error?.code === "invalid_credentials" || !error
          ? "Incorrect email or password."
          : `Sign-in failed: ${error.message}`;
    return { ok: false, message, values: { email } };
  }

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account does not have admin access.", values: { email } };
  }

  redirect(next);
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
