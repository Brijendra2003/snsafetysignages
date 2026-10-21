import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

function csvCell(value: unknown) {
  const s = value === null || value === undefined ? "" : String(value);
  // Prevent spreadsheet formula injection and escape quotes.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** CSV export of leads using the same filters as the leads table. */
export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = request.nextUrl.searchParams;
  const supabase = await createSessionClient();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5000);
  const status = sp.get("status");
  const source = sp.get("source");
  const q = sp.get("q")?.replace(/[%_,()]/g, " ").trim();
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const header = ["Received", "Name", "Phone", "Email", "Company", "City", "Subject", "Message", "Products", "Source", "Status", "Notes"];
  const lines = (data ?? []).map((l) =>
    [
      new Date(l.created_at).toISOString(),
      l.name,
      l.phone,
      l.email,
      l.company,
      l.city,
      l.subject,
      l.message,
      (l.items as { name: string; quantity: number }[]).map((i) => `${i.name} x${i.quantity}`).join("; "),
      l.source,
      l.status,
      l.notes,
    ]
      .map(csvCell)
      .join(","),
  );
  const csv = "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sn-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
