/**
 * Rentora Mobility — Blog data (server-only)
 *
 * Re-exports the pure, client-safe content from ./blog-content and adds
 * filesystem-based image discovery + resolution so a supplied image that is
 * missing falls back to another real image of the same category (no broken
 * images). Importing this module pulls in Node's `fs`, so it must only be used
 * from server components (blog pages, sitemap) — never from client components.
 */

import fs from 'fs';
import path from 'path';
import {
  BLOG_CATEGORY_FOLDERS,
  getBlogPostsRaw,
  getBlogPostRaw,
  getFeaturedPostRaw,
  type BlogPost,
  type BlogCategory,
} from './blog-content';

export * from './blog-content';

const BLOG_DIR = path.join(process.cwd(), 'public', 'images', 'blog');

/** List the real supplied image files for a category (used for discovery + fallback). */
export function getBlogCategoryImages(category: BlogCategory): string[] {
  if (typeof window !== 'undefined') return [];
  const folder = BLOG_CATEGORY_FOLDERS[category];
  const dir = path.join(BLOG_DIR, folder);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|jfif)$/i.test(f))
      .map((f) => `/images/blog/${folder}/${f}`);
  } catch {
    return [];
  }
}

function blogImageExists(publicPath: string): boolean {
  if (typeof window !== 'undefined') return true;
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', publicPath));
  } catch {
    return false;
  }
}

/** Resolve an article's hero image, falling back to a discovered image of the
 *  same category when the assigned file is missing (guarantees no broken image). */
function resolveHeroImage(post: BlogPost): string {
  if (blogImageExists(post.heroImage)) return post.heroImage;
  const fallback = getBlogCategoryImages(post.category)[0];
  return fallback || post.heroImage;
}

export function getBlogPosts(): BlogPost[] {
  return getBlogPostsRaw().map((p) => ({ ...p, heroImage: resolveHeroImage(p) }));
}

export function getBlogPost(slug: string): BlogPost | null {
  const post = getBlogPostRaw(slug);
  if (!post) return null;
  return { ...post, heroImage: resolveHeroImage(post) };
}

export function getFeaturedPost(): BlogPost | null {
  const post = getFeaturedPostRaw();
  if (!post) return null;
  return { ...post, heroImage: resolveHeroImage(post) };
}
