import type { Metadata } from "next";
import { CmsPage, cmsMetadata } from "@/lib/cms-page";
import { getPosts } from "@/data/public";
import { PostCard } from "@/components/public/cards";
import { BlogIndex } from "@/components/public/blog-index";

export const revalidate = 300;

export function generateMetadata(): Promise<Metadata> {
  return cmsMetadata("blog", "Georgia travel journal");
}

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p._id !== featured?._id);
  const categories = [...new Set(rest.map((p) => p.category))];
  return (
    <CmsPage
      slug="blog"
      fallbackTitle="Journal"
      listing={
        posts.length ? (
          <>
            {featured && (
              <div className="mb-16 grid gap-8 border-b border-line pb-16 lg:grid-cols-12">
                <div className="lg:col-span-12"><PostCard post={featured} priority /></div>
              </div>
            )}
            <BlogIndex posts={rest} categories={categories} />
          </>
        ) : (
          <p className="py-16 text-center text-lg text-ink-soft">New articles are on their way.</p>
        )
      }
    />
  );
}
