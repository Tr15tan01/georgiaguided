import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Inbox, Map, Plus, Sparkles } from "lucide-react";
import { connectDB, serialize } from "@/lib/db";
import { Activity, BlogPost, Destination, Inquiry, Service, Tour } from "@/models";
import { PageHeader } from "@/components/admin/page-header";
import { InquiryStatusBadge } from "@/components/admin/inquiry-status";
import { formatDate } from "@/lib/utils";
import type { Inquiry as TInquiry } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard" };

const ENTITY_HREF: Record<string, string> = { tours: "/admin/tours", destinations: "/admin/destinations", services: "/admin/services", blog: "/admin/blog", testimonials: "/admin/testimonials", faqs: "/admin/faqs", pages: "/admin/pages", inquiry: "/admin/inquiries" };

export default async function Dashboard() {
  await connectDB();
  const weekAgo = new Date(Date.now() - 7 * 864e5);
  const [tours, publishedTours, destinations, services, posts, publishedPosts, newInq, totalInq, weekInq, recent, activity] = await Promise.all([
    Tour.countDocuments(),
    Tour.countDocuments({ status: "published" }),
    Destination.countDocuments(),
    Service.countDocuments(),
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: "published" }),
    Inquiry.countDocuments({ status: "NEW" }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ createdAt: { $gte: weekAgo } }),
    Inquiry.find().sort({ createdAt: -1 }).limit(6).select("name country email status createdAt type travelers arrivalDate").lean(),
    Activity.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);
  const recentInq = serialize<TInquiry[]>(recent);
  const acts = serialize<{ _id: string; action: string; entity?: string; entityId?: string; label?: string; actor?: string; createdAt: string }[]>(activity);

  const stats = [
    { label: "New inquiries", value: newInq, sub: `${weekInq} this week · ${totalInq} total`, href: "/admin/inquiries?status=NEW", icon: Inbox, accent: true },
    { label: "Tours", value: tours, sub: `${publishedTours} published · ${tours - publishedTours} drafts`, href: "/admin/tours", icon: Compass },
    { label: "Destinations", value: destinations, sub: "Regions and cities", href: "/admin/destinations", icon: Map },
    { label: "Services", value: services, sub: "Transfers, guides and more", href: "/admin/services", icon: Sparkles },
    { label: "Journal articles", value: posts, sub: `${publishedPosts} published`, href: "/admin/blog", icon: BookOpen },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your content and incoming travel requests."
        actions={<>
          <Link href="/admin/tours/new" className="adm-btn"><Plus className="size-4" />New tour</Link>
          <Link href="/admin/blog/new" className="adm-btn"><Plus className="size-4" />New article</Link>
        </>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, sub, href, icon: Icon, accent }) => (
          <Link key={label} href={href} className={`adm-card group p-5 transition-colors hover:border-accent ${accent && value > 0 ? "border-accent" : ""}`}>
            <div className="flex items-center justify-between text-ink-soft"><span className="text-sm">{label}</span><Icon className="size-4" /></div>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
            <p className="mt-1 text-xs text-ink-soft">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="adm-card overflow-hidden" aria-labelledby="recent-inq">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 id="recent-inq" className="font-semibold">Recent inquiries</h2>
            <Link href="/admin/inquiries" className="flex items-center gap-1 text-sm text-accent">All inquiries <ArrowRight className="size-3.5" /></Link>
          </div>
          {recentInq.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-soft">No inquiries yet. They&apos;ll appear here as soon as visitors use the forms.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentInq.map((q) => (
                <li key={q._id}>
                  <Link href={`/admin/inquiries/${q._id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-ink/[0.03]">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{q.name}</p>
                      <p className="truncate text-xs text-ink-soft">
                        {q.type === "contact" ? "General message" : `${q.travelers ?? "?"} traveler${q.travelers === 1 ? "" : "s"}${q.arrivalDate ? ` · arriving ${formatDate(q.arrivalDate)}` : ""}`}
                        {q.country ? ` · ${q.country}` : ""}
                      </p>
                    </div>
                    <InquiryStatusBadge status={q.status} />
                    <time className="hidden text-xs text-ink-soft sm:block" dateTime={q.createdAt}>{formatDate(q.createdAt, { day: "numeric", month: "short" })}</time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card" aria-labelledby="activity">
          <h2 id="activity" className="border-b border-line px-5 py-4 font-semibold">Recent activity</h2>
          {acts.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-soft">Nothing yet.</p>
          ) : (
            <ol className="space-y-3 p-5">
              {acts.map((a) => {
                const href = a.entity && ENTITY_HREF[a.entity] && a.entityId && a.action !== "deleted" && !a.action.endsWith("deleted") ? `${ENTITY_HREF[a.entity]}/${a.entityId}` : null;
                return (
                  <li key={a._id} className="flex gap-3 text-sm">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brass" />
                    <div className="min-w-0">
                      <p className="truncate">
                        <span className="capitalize">{a.action.replace(/^\w+\./, "").replace(/_/g, " ")}</span>{" "}
                        {href ? <Link href={href} className="font-medium hover:text-accent">{a.label}</Link> : <span className="font-medium">{a.label}</span>}
                      </p>
                      <p className="text-xs text-ink-soft">{a.entity} · {a.actor} · {formatDate(a.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
