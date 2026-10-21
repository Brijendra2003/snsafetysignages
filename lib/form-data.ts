/** Small helpers for reading FormData in server actions. */

export function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export function bool(fd: FormData, key: string) {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

export function json<T>(fd: FormData, key: string, fallback: T): T {
  try {
    const raw = fd.get(key);
    return typeof raw === "string" && raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Turn a FormData into a plain object of its string fields (for echoing values back). */
export function values(fd: FormData) {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string" && !k.startsWith("$ACTION")) out[k] = v;
  return out;
}
