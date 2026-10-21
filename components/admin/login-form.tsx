"use client";

import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { useActionState, useState } from "react";
import { signIn } from "@/app/admin/actions/auth";
import type { ActionState } from "@/lib/types";

const initial: ActionState = { ok: false };
const input =
  "w-full rounded-xl border-0 bg-white px-4 py-3 text-ink-900 shadow-soft ring-1 ring-ink-200 placeholder:text-ink-400 focus:ring-2 focus:ring-brand-600 focus:outline-none";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, initial);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink-900">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.values?.email} className={input} placeholder="you@snsafetysignages.in" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink-900">
          Password
        </label>
        <div className="relative">
          <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required className={`${input} pr-12`} />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-ink-400 hover:text-ink-700"
          >
            {show ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
      </div>
      {state.message && (
        <p role="alert" className="rounded-xl bg-accent-50 px-4 py-3 text-sm font-medium text-accent-800 ring-1 ring-accent-100">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-shine flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent-600 px-5 py-3.5 font-semibold text-white shadow-cta transition hover:bg-accent-700 disabled:opacity-70"
      >
        {pending ? <LoaderCircle className="size-5 animate-spin" /> : <LogIn className="size-5" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
