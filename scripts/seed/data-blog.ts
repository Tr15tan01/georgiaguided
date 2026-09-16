import type { SeedImageKey } from "./types";
import { POSTS_1 } from "./data-blog-1";
import { POSTS_2 } from "./data-blog-2";

export interface SeedPost {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  cover: SeedImageKey;
  daysAgo: number;
  excerpt: string;
  content: string;
  destinations: string[];
  tours: string[];
  related: string[];
}

export const POSTS: SeedPost[] = [...POSTS_1, ...POSTS_2];
