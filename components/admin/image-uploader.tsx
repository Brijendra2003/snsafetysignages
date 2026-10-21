"use client";

import { ArrowLeft, ArrowRight, ImagePlus, Link2, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { cldUrl, cn } from "@/lib/utils";

type Signature = { cloudName: string; apiKey: string; folder: string; timestamp: number; signature: string };

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const res = await fetch("/api/admin/cloudinary-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  const sig = (await res.json().catch(() => ({}))) as Partial<Signature> & { error?: string };
  if (!res.ok || !sig.signature) throw new Error(sig.error ?? "Could not start upload. Are you still signed in?");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey!);
  body.append("timestamp", String(sig.timestamp));
  body.append("signature", sig.signature);
  body.append("folder", sig.folder!);

  const upload = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body });
  const data = (await upload.json()) as { secure_url?: string; error?: { message: string } };
  if (!upload.ok || !data.secure_url) throw new Error(data.error?.message ?? "Upload failed");
  return data.secure_url;
}

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Uploads images straight from the browser to Cloudinary (signed by our API),
 * and stores the resulting URLs in a hidden input as JSON (or a plain string
 * when `multiple` is false).
 */
export function ImageUploader({
  name,
  defaultValue = [],
  multiple = true,
  folder,
  max = 12,
  label = "Images",
}: {
  name: string;
  defaultValue?: string[];
  multiple?: boolean;
  folder: string;
  max?: number;
  label?: string;
}) {
  const [images, setImages] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const limit = multiple ? max : 1;

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = Array.from(files).slice(0, limit - (multiple ? images.length : 0));
    const tooBig = list.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is larger than 8 MB.`);
      return;
    }
    setBusy(list.length);
    for (const file of list) {
      try {
        const url = await uploadToCloudinary(file, folder);
        setImages((prev) => (multiple ? [...prev, url].slice(0, limit) : [url]));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setBusy((b) => b - 1);
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!/^https?:\/\//.test(url)) {
      setError("Paste a full image URL starting with https://");
      return;
    }
    setImages((prev) => (multiple ? [...prev, url].slice(0, limit) : [url]));
    setUrlInput("");
    setError(null);
  }

  const move = (i: number, dir: -1 | 1) =>
    setImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });

  return (
    <div>
      <input type="hidden" name={name} value={multiple ? JSON.stringify(images) : (images[0] ?? "")} />
      <p className="mb-1.5 text-sm font-semibold text-ink-900">{label}</p>

      <div className={cn("grid gap-3", multiple ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3")}>
        {images.map((src, i) => (
          <div key={src + i} className="group relative aspect-square overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldUrl(src, 400)} alt="" className="size-full object-contain p-2" />
            {multiple && i === 0 && (
              <span className="absolute top-2 left-2 rounded-md bg-ink-900/80 px-1.5 py-0.5 text-[0.65rem] font-bold text-white">Cover</span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-ink-900/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
              <div className="flex gap-1">
                {multiple && i > 0 && (
                  <button type="button" onClick={() => move(i, -1)} aria-label="Move left" className="grid size-7 cursor-pointer place-items-center rounded-md bg-white/90 text-ink-900">
                    <ArrowLeft className="size-3.5" />
                  </button>
                )}
                {multiple && i < images.length - 1 && (
                  <button type="button" onClick={() => move(i, 1)} aria-label="Move right" className="grid size-7 cursor-pointer place-items-center rounded-md bg-white/90 text-ink-900">
                    <ArrowRight className="size-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                aria-label="Remove image"
                className="grid size-7 cursor-pointer place-items-center rounded-md bg-white/90 text-accent-700"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}

        {Array.from({ length: busy }, (_, i) => (
          <div key={`busy-${i}`} className="grid aspect-square place-items-center rounded-xl bg-ink-50 ring-1 ring-ink-200">
            <LoaderCircle className="size-6 animate-spin text-ink-400" />
          </div>
        ))}

        {images.length + busy < limit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300 text-ink-500 transition hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700"
          >
            <ImagePlus className="size-6" />
            <span className="text-xs font-semibold">{multiple ? "Upload / drop" : "Upload"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="mt-3 flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Image URL</span>
          <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="…or paste an image URL"
            className="w-full rounded-lg border-0 bg-white py-2 pr-3 pl-9 text-sm ring-1 ring-ink-200 focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </label>
        <button type="button" onClick={addUrl} className="cursor-pointer rounded-lg px-3 text-sm font-semibold text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50">
          Add
        </button>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-accent-700">{error}</p>}
      <p className="mt-1.5 text-xs text-ink-500">PNG, JPG, WebP up to 8 MB. Images are stored on Cloudinary.</p>
    </div>
  );
}
