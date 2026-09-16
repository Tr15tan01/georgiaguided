import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { connectDB, serialize } from "@/lib/db";
import { Inquiry } from "@/models";
import type { Inquiry as TInquiry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { InquiryStatusBadge } from "@/components/admin/inquiry-status";
import { InquiryActions, InquiryNotes } from "@/components/admin/inquiry-actions";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  await connectDB();
  const doc = await Inquiry.findById(id).lean();
  return doc ? serialize<TInquiry>(doc) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = await load((await params).id);
  return { title: q ? `Inquiry from ${q.name}` : "Not found" };
}

const long = (d?: string) => (d ? formatDate(d, { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "—");

export default async function InquiryDetail({ params }: Props) {
  const { id } = await params;
  const q = await load(id);
  if (!q) notFound();
  const nights = q.arrivalDate && q.departureDate ? Math.round((+new Date(q.departureDate) - +new Date(q.arrivalDate)) / 864e5) : null;
  const wa = q.phone ? q.phone.replace(/[^\d]/g, "") : "";

  const facts: [string, React.ReactNode][] = q.type === "trip"
    ? [
        ["Country", q.country || "—"],
        ["Travelers", q.travelers ?? "—"],
        ["Arrival", long(q.arrivalDate)],
        ["Departure", long(q.departureDate)],
        ["Length", nights != null ? `${nights} night${nights === 1 ? "" : "s"}` : "—"],
        ["Accommodation", q.accommodationNeeded ? "Needed" : "Not requested"],
        ["Airport transfer", q.airportTransferNeeded ? "Needed" : "Not requested"],
      ]
    : [["Subject", q.subject || "—"]];

  const chips = (label: string, list: string[]) =>
    list.length > 0 && (
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</h3>
        <ul className="flex flex-wrap gap-1.5">{list.map((x) => <li key={x} className="adm-badge border-line bg-paper">{x}</li>)}</ul>
      </div>
    );

  return (
    <>
      <PageHeader
        title={q.name}
        description={`${q.type === "trip" ? "Trip request" : "Contact message"} · received ${formatDate(q.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`}
        crumbs={[{ href: "/admin/inquiries", label: "Inquiries" }, { href: `/admin/inquiries/${id}`, label: q.name }]}
        actions={<InquiryStatusBadge status={q.status} />}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className="adm-card p-5 sm:p-6" aria-labelledby="req">
            <h2 id="req" className="sr-only">Request details</h2>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {facts.map(([k, v]) => (
                <div key={k}><dt className="text-xs text-ink-soft">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-6 space-y-4">
              {chips("Destinations", q.destinations)}
              {chips("Experiences", [...q.experiences, ...q.interests.filter((i) => !q.experiences.includes(i))])}
            </div>
            <div className="mt-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">Message</h3>
              <p className="whitespace-pre-wrap rounded-lg bg-paper p-4 leading-relaxed">{q.message}</p>
            </div>
            {q.sourcePath && <p className="mt-4 text-xs text-ink-soft">Sent from <span className="font-mono">{q.sourcePath}</span></p>}
          </section>
          <InquiryNotes id={id} notes={q.notes ?? []} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <section className="adm-card space-y-2 p-5" aria-labelledby="contact-h">
            <h2 id="contact-h" className="mb-2 font-semibold">Contact</h2>
            <a href={`mailto:${q.email}?subject=${encodeURIComponent("Your Georgia trip")}`} className="adm-btn w-full justify-start"><Mail className="size-4" /><span className="truncate">{q.email}</span></a>
            {q.phone && <a href={`tel:${q.phone}`} className="adm-btn w-full justify-start"><Phone className="size-4" />{q.phone}</a>}
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="adm-btn w-full justify-start"><MessageCircle className="size-4" />WhatsApp</a>}
            {q.contactedAt && <p className="pt-1 text-xs text-ink-soft">First marked contacted {formatDate(q.contactedAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>}
          </section>
          <InquiryActions id={id} status={q.status} />
        </aside>
      </div>
    </>
  );
}
