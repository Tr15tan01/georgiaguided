import type { Metadata } from "next";
import Link from "next/link";
import { connectDB, serialize } from "@/lib/db";
import { Inquiry } from "@/models";
import { INQUIRY_STATUSES, type Inquiry as TInquiry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { ListToolbar, Pagination } from "@/components/admin/list-controls";
import { InquiryStatusBadge } from "@/components/admin/inquiry-status";

export const metadata: Metadata = { title: "Inquiries" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const PER_PAGE = 25;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const short = (d?: string) => (d ? formatDate(d, { day: "numeric", month: "short" }) : "");

export default async function InquiriesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = one(sp.q).trim().slice(0, 100);
  const status = one(sp.status);
  const page = Math.max(1, Number.parseInt(one(sp.page) || "1", 10) || 1);

  const filter: Record<string, unknown> = {};
  if ((INQUIRY_STATUSES as readonly string[]).includes(status)) filter.status = status;
  else filter.status = { $ne: "ARCHIVED" };
  if (status === "all") delete filter.status;
  if (q) filter.$or = ["name", "email", "country", "message"].map((f) => ({ [f]: { $regex: escapeRegex(q), $options: "i" } }));

  await connectDB();
  const [rows, total, counts] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PER_PAGE).limit(PER_PAGE)
      .select("type name email country arrivalDate departureDate travelers status createdAt").lean(),
    Inquiry.countDocuments(filter),
    Inquiry.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);
  const items = serialize<TInquiry[]>(rows);
  const countBy = Object.fromEntries(counts.map((c) => [c._id, c.n]));
  const all = counts.reduce((a, c) => a + c.n, 0);

  return (
    <>
      <PageHeader title="Inquiries" description="Travel requests and messages from the website." crumbs={[{ href: "/admin/inquiries", label: "Inquiries" }]} />
      <ListToolbar
        basePath="/admin/inquiries"
        q={q}
        active={status}
        filterParam="status"
        filters={[
          { value: "", label: "Open", count: all - (countBy.ARCHIVED ?? 0) },
          ...INQUIRY_STATUSES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase(), count: countBy[s] ?? 0 })),
          { value: "all", label: "All", count: all },
        ]}
      />
      {items.length === 0 ? (
        <div className="adm-card p-12 text-center text-ink-soft">{q || status ? "No inquiries match these filters." : "No inquiries yet. Submissions from the Plan your trip and Contact forms appear here."}</div>
      ) : (
        <div className="adm-card overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col" className="hidden md:table-cell">Country</th>
                <th scope="col" className="hidden lg:table-cell">Email</th>
                <th scope="col" className="hidden sm:table-cell">Dates</th>
                <th scope="col" className="hidden sm:table-cell">Travelers</th>
                <th scope="col">Status</th>
                <th scope="col" className="hidden md:table-cell">Received</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r._id} className={r.status === "NEW" ? "font-medium" : undefined}>
                  <td>
                    <Link href={`/admin/inquiries/${r._id}`} className="hover:text-accent">{r.name}</Link>
                    <p className="text-xs font-normal text-ink-soft">{r.type === "contact" ? "Contact message" : "Trip request"}</p>
                  </td>
                  <td className="hidden md:table-cell">{r.country || "—"}</td>
                  <td className="hidden lg:table-cell"><a href={`mailto:${r.email}`} className="hover:text-accent">{r.email}</a></td>
                  <td className="hidden whitespace-nowrap sm:table-cell">{r.arrivalDate ? `${short(r.arrivalDate)}${r.departureDate ? ` – ${short(r.departureDate)}` : ""}` : "—"}</td>
                  <td className="hidden tabular-nums sm:table-cell">{r.travelers ?? "—"}</td>
                  <td><InquiryStatusBadge status={r.status} /></td>
                  <td className="hidden whitespace-nowrap text-ink-soft md:table-cell">{formatDate(r.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination basePath="/admin/inquiries" page={page} pages={Math.max(1, Math.ceil(total / PER_PAGE))} total={total} params={{ q, status }} />
    </>
  );
}
