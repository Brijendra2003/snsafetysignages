import { ArrowRight, Building2, Mail, MapPin, Phone, ShoppingCart, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteLead } from "@/app/admin/actions/leads";
import { ConfirmAction } from "@/components/admin/client-ui";
import { LeadUpdateForm } from "@/components/admin/lead-forms";
import { Card, PageHeader, StatusBadge } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { getLead } from "@/lib/data/admin";
import { telLink, whatsappLink } from "@/lib/site";
import { formatDateTime, formatINR, titleCase } from "@/lib/utils";

export const metadata: Metadata = { title: "Lead" };

export default async function LeadDetailPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const result = await getLead(id);
  if (!result) notFound();
  const { lead, orders } = result;

  const waText = `Hi ${lead.name}, this is SN Safety & Signages regarding your enquiry${lead.subject ? ` for "${lead.subject}"` : ""}.`;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/leads", label: "Leads" }}
        title={lead.name}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge kind="lead" value={lead.status} />
            <span>
              {titleCase(lead.source)} enquiry · received {formatDateTime(lead.created_at)}
            </span>
          </span>
        }
        actions={
          <>
            <ConfirmAction action={deleteLead.bind(null, lead.id)} confirm="Delete this lead permanently?">
              <Trash2 className="size-4" /> Delete
            </ConfirmAction>
            <Link
              href={`/admin/orders/new?lead=${lead.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-accent-700"
            >
              <ShoppingCart className="size-4" /> Convert to order
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <a href={telLink(lead.phone)} className="flex items-center gap-3 rounded-xl p-3 ring-1 ring-ink-100 hover:bg-ink-50">
                <Phone className="size-5 text-brand-600" />
                <span>
                  <span className="block text-xs text-ink-500">Phone</span>
                  <span className="font-semibold text-ink-900">{lead.phone}</span>
                </span>
              </a>
              <a href={whatsappLink(lead.phone, waText)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-3 ring-1 ring-ink-100 hover:bg-ink-50">
                <WhatsAppIcon className="size-5 text-whatsapp-dark" />
                <span>
                  <span className="block text-xs text-ink-500">WhatsApp</span>
                  <span className="font-semibold text-ink-900">Send message</span>
                </span>
              </a>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-3 rounded-xl p-3 ring-1 ring-ink-100 hover:bg-ink-50">
                  <Mail className="size-5 text-accent-600" />
                  <span className="min-w-0">
                    <span className="block text-xs text-ink-500">Email</span>
                    <span className="block truncate font-semibold text-ink-900">{lead.email}</span>
                  </span>
                </a>
              )}
              {(lead.company || lead.city) && (
                <div className="flex items-center gap-3 rounded-xl p-3 ring-1 ring-ink-100">
                  {lead.company ? <Building2 className="size-5 text-ink-500" /> : <MapPin className="size-5 text-ink-500" />}
                  <span>
                    <span className="block text-xs text-ink-500">{lead.company ? "Company" : "City"}</span>
                    <span className="font-semibold text-ink-900">{[lead.company, lead.city].filter(Boolean).join(", ")}</span>
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card title="Requirement">
            {lead.subject && <p className="font-display text-lg font-bold text-ink-900">{lead.subject}</p>}
            <p className="mt-2 leading-relaxed whitespace-pre-line text-ink-700">{lead.message || <span className="text-ink-400">No message.</span>}</p>
          </Card>

          {lead.items.length > 0 && (
            <Card title={`Products in quote (${lead.items.length})`} bodyClassName="p-0">
              <ul className="divide-y divide-ink-100">
                {lead.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                    {item.slug ? (
                      <Link href={`/products/${item.slug}`} target="_blank" className="font-semibold text-ink-900 hover:text-accent-700">
                        {item.name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-ink-900">{item.name}</span>
                    )}
                    <span className="rounded-md bg-ink-100 px-2 py-0.5 font-semibold text-ink-700 tabular-nums">× {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {orders.length > 0 && (
            <Card title="Orders from this lead" bodyClassName="p-0">
              <ul className="divide-y divide-ink-100">
                {orders.map((o) => (
                  <li key={o.id}>
                    <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-ink-50">
                      <span className="font-semibold text-ink-900">{o.order_number}</span>
                      <span className="flex items-center gap-3">
                        <StatusBadge kind="order" value={o.status} />
                        <span className="font-semibold tabular-nums">{formatINR(o.total)}</span>
                        <ArrowRight className="size-4 text-ink-400" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card title="Follow-up">
            <LeadUpdateForm lead={lead} />
          </Card>
        </div>
      </div>
    </>
  );
}
