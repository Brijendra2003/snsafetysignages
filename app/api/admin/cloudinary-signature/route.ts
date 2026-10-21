import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { cloudinaryCloudName, isCloudinaryConfigured } from "@/lib/env";

/**
 * Signs a direct browser-to-Cloudinary upload. The API secret never leaves the
 * server, and only signed-in admins can obtain a signature.
 */
export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCloudinaryConfigured) {
    return NextResponse.json({ error: "Cloudinary is not configured. Add your keys to .env.local." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as { folder?: string };
  const base = process.env.CLOUDINARY_UPLOAD_FOLDER || "sn-safety";
  const sub = (body.folder ?? "misc").replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "misc";
  const folder = `${base}/${sub}`;
  const timestamp = Math.round(Date.now() / 1000);

  // Parameters must be sorted alphabetically and joined as key=value&... before appending the secret.
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + process.env.CLOUDINARY_API_SECRET).digest("hex");

  return NextResponse.json({
    cloudName: cloudinaryCloudName,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    timestamp,
    signature,
  });
}
