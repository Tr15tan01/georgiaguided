"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/types";
import { PostCard } from "./cards";
import { cn } from "@/lib/utils";

export function BlogIndex({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [cat, setCat] = useState("");
  const shown = cat ? posts.filter((p) => p.category === cat) : posts;
  return (
    <>
      {categories.length > 1 && (
        <div role="group" aria-label="Filter by topic" className="mb-10 flex flex-wrap gap-2">
          {["", ...categories].map((c) => (
            <button
              key={c || "all"}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn("min-h-11 rounded-full border px-4 transition-colors", cat === c ? "border-accent bg-accent text-accent-ink" : "border-line hover:border-ink/40")}
            >
              {c || "All topics"}
            </button>
          ))}
        </div>
      )}
      <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (<li key={p._id}><PostCard post={p} /></li>))}
      </ul>
    </>
  );
}
