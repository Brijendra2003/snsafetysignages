import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { SignArt } from "@/components/ui/sign-art";
import { getAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-950 p-12 text-brand-100 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="hazard-stripes absolute inset-x-0 top-0 h-2" />
        <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full bg-accent-600/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -left-10 size-96 rounded-full bg-brand-600/30 blur-3xl" />
        <Link href="/" className="relative">
          <Image src="/brand/logo-light.png" alt="SN Safety & Signages" width={640} height={414} priority className="h-20 w-auto" />
        </Link>
        <div className="relative">
          <div className="anim-float mb-10 w-56" style={{ ["--rot" as string]: "-4deg", ["--spin" as string]: "4deg" }}>
            <SignArt kind="exit" />
          </div>
          <h1 className="text-4xl leading-tight font-extrabold text-white!">
            Leads, orders &amp; catalogue, <span className="text-safety-400">in one place.</span>
          </h1>
          <p className="mt-4 max-w-md text-brand-200/90">
            Manage enquiries from the website, convert them into orders, and keep your product catalogue up to date.
          </p>
        </div>
        <p className="relative text-xs text-brand-300/70">Authorised staff only. Activity may be logged.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden">
            <Image src="/brand/logo.png" alt="SN Safety & Signages" width={640} height={414} priority className="mx-auto h-16 w-auto" />
          </Link>
          <span className="mt-8 grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 lg:mt-0">
            <ShieldCheck className="size-6" />
          </span>
          <h2 className="mt-5 text-3xl font-extrabold">Admin sign in</h2>
          <p className="mt-1 text-ink-500">Use the email and password set up in Supabase.</p>
          <div className="mt-8">
            {isSupabaseConfigured ? (
              <Suspense fallback={<div className="skeleton h-64" />}>
                <LoginGate searchParams={searchParams} />
              </Suspense>
            ) : (
              <SetupNotice />
            )}
          </div>
          <Link href="/" className="mt-8 block text-center text-sm font-medium text-ink-500 hover:text-ink-900">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

async function LoginGate({ searchParams }: Pick<PageProps<"/admin/login">, "searchParams">) {
  const [{ next }, admin] = await Promise.all([searchParams, getAdmin()]);
  const target = typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  if (admin) redirect(target);
  return <LoginForm next={target} />;
}

function SetupNotice() {
  return (
    <div className="rounded-2xl bg-safety-300/20 p-5 text-sm text-ink-700 ring-1 ring-safety-400/50">
      <p className="font-bold text-ink-900">Supabase is not connected yet</p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5">
        <li>Create a project at supabase.com</li>
        <li>
          Run <code className="rounded bg-white px-1">supabase/schema.sql</code> in the SQL editor
        </li>
        <li>
          Copy <code className="rounded bg-white px-1">.env.example</code> to <code className="rounded bg-white px-1">.env.local</code> and add your keys
        </li>
        <li>Create your admin user and add it to admin_users (see README)</li>
        <li>Restart the dev server</li>
      </ol>
    </div>
  );
}
