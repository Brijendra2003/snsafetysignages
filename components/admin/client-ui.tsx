"use client";

import { CircleAlert, CircleCheck, LoaderCircle, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SubmitButton({ children, className, pendingLabel = "Saving…" }: { children: ReactNode; className?: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-cta transition hover:bg-accent-700 disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {pending && <LoaderCircle className="size-4 animate-spin" />}
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Inline success / error banner for an ActionState. */
export function FormMessage({ state }: { state: ActionState }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    if (state.ok) {
      const t = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [state]);
  if (!state.message || !visible) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={cn(
        "anim-fade-in flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium ring-1",
        state.ok ? "bg-success-50 text-success-600 ring-success-600/20" : "bg-accent-50 text-accent-800 ring-accent-200",
      )}
    >
      {state.ok ? <CircleCheck className="size-4 shrink-0" /> : <CircleAlert className="size-4 shrink-0" />}
      {state.message}
    </p>
  );
}

/** Button that runs a server action after a confirm() prompt (deletes etc.). */
export function ConfirmAction({
  action,
  confirm: message,
  children,
  className,
}: {
  action: () => Promise<void>;
  confirm: string;
  children: ReactNode;
  className?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(message)) start(() => action());
      }}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-accent-700 ring-1 ring-accent-200 transition hover:bg-accent-50 disabled:opacity-60",
        className,
      )}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

/** Small switch that calls a server action immediately (optimistic). */
export function ToggleAction({ checked, action, label }: { checked: boolean; action: (value: boolean) => Promise<void>; label: string }) {
  const [value, setValue] = useState(checked);
  const [pending, start] = useTransition();
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setValue(checked), [checked]);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      disabled={pending}
      onClick={() => {
        const next = !value;
        setValue(next);
        start(() => action(next));
      }}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition disabled:opacity-60",
        value ? "bg-success-600" : "bg-ink-300",
      )}
    >
      <span className={cn("inline-block size-5 rounded-full bg-white shadow transition", value ? "translate-x-5.5" : "translate-x-0.5")} />
    </button>
  );
}

/** Status select that saves on change. */
export function StatusSelect<T extends string>({
  value,
  options,
  action,
  label,
}: {
  value: T;
  options: readonly T[];
  action: (value: T) => Promise<void>;
  label: string;
}) {
  const [current, setCurrent] = useState(value);
  const [pending, start] = useTransition();
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setCurrent(value), [value]);
  return (
    <select
      aria-label={label}
      value={current}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as T;
        setCurrent(next);
        start(() => action(next));
      }}
      className="cursor-pointer rounded-lg border-0 bg-white py-1.5 pr-8 pl-2.5 text-xs font-semibold text-ink-700 ring-1 ring-ink-200 focus:ring-2 focus:ring-brand-600 focus:outline-none disabled:opacity-60"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </option>
      ))}
    </select>
  );
}

/** Accessible modal built on <dialog>. */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  // Close if the page is hidden by Activity during navigation.
  useLayoutEffect(() => () => ref.current?.close(), []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-2xl bg-white p-0 shadow-lift backdrop:bg-ink-900/50 backdrop:backdrop-blur-sm open:anim-modal-in",
        wide ? "max-w-2xl" : "max-w-lg",
      )}
    >
      {open && (
        <div>
          <header className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-display text-lg font-bold">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-500 hover:bg-ink-100">
              <X className="size-4" />
            </button>
          </header>
          <div className="max-h-[75dvh] overflow-y-auto p-5">{children}</div>
        </div>
      )}
    </dialog>
  );
}
