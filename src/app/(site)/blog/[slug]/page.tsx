import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getDestinationsByIds, getLatestPosts, getPost, getPostsByIds, getToursByIds } from "@/data/public";
import { buildMetadata } from "@/lib/seo";
import { articleLd } from "@/lib/jsonld";
import { extractHeadings } from "@/lib/markdown";
import { formatDate, readingTime } from "@/lib/utils";
import { SmartImage } from "@/components/public/smart-image";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { Prose } from "@/components/public/prose";
import { JsonLd } from "@/components/public/json-ld";
import { PostCard, TourCard } from "@/components/public/cards";

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return { title: "Page not found", robots: { index: false } };
  return buildMetadata({
    title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, seo: p.seo, image: p.coverImage,
    type: "article", publishedTime: p.publishedAt, modifiedTime: p.updatedAt, noindex: p.status !== "published",
  });
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const preview = (await draftMode()).isEnabled;
  const [tours, destinations, relatedPicked, latest] = await Promise.all([
    getToursByIds(post.relatedTours),
    getDestinationsByIds(post.relatedDestinations),
    getPostsByIds(post.relatedPosts),
    getLatestPosts(4),
  ]);
  const related = (relatedPicked.length ? relatedPicked : latest.filter((p) => p._id !== post._id)).slice(0, 3);
  const toc = extractHeadings(post.content);

  return (
    <article>
      {preview && (
        <div className="bg-brass px-4 py-2 text-center text-sm text-white">
          Preview mode{post.status !== "published" ? " — this article is a draft" : ""}. <a className="underline" href="/api/preview/disable">Exit preview</a>
        </div>
      )}
      <header className="container-x pt-10">
        <Breadcrumbs items={[{ name: "Journal", href: "/blog" }, { name: post.title, href: `/blog/${post.slug}` }]} />
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <p className="flex justify-center gap-4 text-ink-soft">
            <span className="text-moss">{post.category}</span>
            {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
            <span>{readingTime(post.content)} min read</span>
          </p>
          <h1 className="hero-rise mt-5 text-5xl sm:text-7xl">{post.title}</h1>
          {post.excerpt && <p className="mx-auto mt-6 max-w-2xl text-xl text-ink-soft">{post.excerpt}</p>}
        </div>
        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-sm bg-line sm:aspect-[21/9]">
          <SmartImage image={post.coverImage} sizes="(min-width: 1344px) 1248px, 100vw" priority quality={85} imgClassName="img-reveal" />
        </div>
      </header>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          {toc.length > 2 && (
            <nav aria-label="In this article" className="lg:sticky lg:top-28">
              <p className="text-sm font-medium">In this article</p>
              <ul className="mt-3 space-y-2 border-l border-line text-[0.95rem]">
                {toc.map((h) => (<li key={h.id}><a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-ink-soft hover:border-accent hover:text-ink">{h.text}</a></li>))}
              </ul>
            </nav>
          )}
        </aside>
        <div className="lg:col-span-7">
          <Prose markdown={post.content} />
          <p className="mt-10 text-sm text-ink-soft">
            By {post.author}{post.updatedAt && post.publishedAt && new Date(post.updatedAt) > new Date(post.publishedAt) ? `. Updated ${formatDate(post.updatedAt)}` : ""}.
          </p>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((t) => (<li key={t} className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft">{t}</li>))}
            </ul>
          )}
          {destinations.length > 0 && (
            <section className="mt-12 border-t border-line pt-8">
              <h2 className="text-2xl">Destinations in this article</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {destinations.map((d) => (<li key={d._id}><Link href={`/destinations/${d.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:border-accent hover:text-accent">{d.name}</Link></li>))}
              </ul>
            </section>
          )}
          <aside className="mt-12 rounded-sm bg-accent p-8 text-accent-ink sm:p-10">
            <h2 className="text-3xl sm:text-4xl">Planning a trip to Georgia?</h2>
            <p className="mt-3 opacity-90">Tell us your dates and interests. We will reply with a personal itinerary, with no obligation.</p>
            <Link href="/plan-your-trip" className="btn btn-light mt-6">Plan your trip</Link>
          </aside>
        </div>
      </div>

      {tours.length > 0 && (
        <section className="bg-raised">
          <div className="container-x section-y">
            <h2 className="mb-10 text-4xl sm:text-5xl">Tours related to this article</h2>
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{tours.slice(0, 3).map((t) => (<li key={t._id}><TourCard tour={t} /></li>))}</ul>
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="container-x section-y">
          <h2 className="mb-10 text-4xl">Keep reading</h2>
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-3">{related.map((p) => (<li key={p._id}><PostCard post={p} /></li>))}</ul>
        </section>
      )}
      <JsonLd data={articleLd(post)} />
    </article>
  );
}
