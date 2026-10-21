import { Download, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { setLeadStatus } from "@/app/admin/actions/leads";
import { StatusSelect } from "@/components/admin/client-ui";
import { EmptyState, FilterBar, PageHeader, Pagination, TableWrap, td, th } from "@/components/admin/ui";
import { listLeads, PAGE_SIZE } from "@/lib/data/admin";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/types";
import { formatDateTime, titleCase } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const status = typeof sp.status === "string" && sp.status ? sp.status : undefined;
  const source = typeof sp.source === "string" && sp.source ? sp.source : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, count } = await listLeads({ q, status, source, page });

  const exportParams = new URLSearchParams(Object.entries({ q, status, source }).filter(([, v]) => v) as [string, string][]);

  return (
    <>
      <PageHeader
        title="Leads"
        description="Enquiries from the contact form, quote basket and product pages."
        actions={
          <>
            <a href={`/api/admin/leads-export?${exportParams}`} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-900 ring-1 ring-ink-200 hover:bg-ink-50">
              <Download className="size-4" /> Export CSV
            </a>
            <Link href="/admin/leads/new" className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-accent-700">
              <Plus className="size-4" /> Add lead
            </Link>
          </>
        }
      />
      <FilterBar
        q={q}
        placeholder="Search name, phone, email, company…"
        selects={[
          { name: "status", value: status, label: "All statuses", options: LEAD_STATUSES.map((s) => ({ value: s, label: titleCase(s) })) },
          { name: "source", value: source, label: "All sources", options: LEAD_SOURCES.map((s) => ({ value: s, label: titleCase(s) })) },
        ]}
      />
      <TableWrap>
        {rows.length ? (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-ink-50">
              <tr>
                <th className={th}>Contact</th>
                <th className={th}>Requirement</th>
                <th className={th}>Source</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((l) => (
                <tr key={l.id} className={l.status === "new" ? "bg-brand-50/40 hover:bg-brand-50" : "hover:bg-ink-50"}>
                  <td className={td}>
                    <Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink-900 hover:text-accent-700">
                      {l.name}
                    </Link>
                    <p className="text-xs text-ink-500">
                      {l.phone}
                      {l.company ? ` · ${l.company}` : ""}
                    </p>
                  </td>
                  <td className={`${td} max-w-xs`}>
                    <p className="line-clamp-1 text-ink-700">{l.subject || l.message || "—"}</p>
                    {l.items.length > 0 && <p className="text-xs text-ink-500">{l.items.length} product{l.items.length > 1 ? "s" : ""} in quote</p>}
                  </td>
                  <td className={`${td} text-ink-500`}>{titleCase(l.source)}</td>
                  <td className={td}>
                    <StatusSelect value={l.status} options={LEAD_STATUSES} label={`Status for ${l.name}`} action={setLeadStatus.bind(null, l.id)} />
                  </td>
                  <td className={`${td} text-right text-xs whitespace-nowrap text-ink-500`}>{formatDateTime(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No leads found" text={q || status || source ? "Try clearing the filters." : "New enquiries from the website will appear here."} />
        )}
      </TableWrap>
      <Pagination page={page} count={count} pageSize={PAGE_SIZE} params={{ q, status, source }} />
    </>
  );
}
