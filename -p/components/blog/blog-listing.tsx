'use client';

import * as React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { blogImageSrc, BLOG_CATEGORIES, type BlogPost, type BlogCategory } from '@/lib/data/blog-content';
import { BlogCard } from '@/components/blog/blog-card';

type Filter = 'All' | BlogCategory;

export function BlogListing({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = React.useState<Filter>('All');

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const filters: Filter[] = ['All', ...BLOG_CATEGORIES];

  const gridPosts =
    filter === 'All'
      ? posts.filter((p) => p.slug !== featured?.slug)
      : posts.filter((p) => p.category === filter);

  return (
    <div className="pb-20">
      {/* Editorial hero */}
      <section className="relative overflow-hidden">
        <div className="container-lux px-4 sm:px-6 lg:px-8 pt-32 pb-14 md:pt-36 md:pb-16">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">
              Rentora Mobility Journal
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
              Travel insights, mobility guides & practical advice
            </h1>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
              Calm, useful reading to help you plan better journeys — from choosing the right rental
              car to organising comfortable road trips and reliable employee transport.
            </p>
          </div>
        </div>
      </section>

      <div className="container-lux px-4 sm:px-6 lg:px-8">
        {/* Category navigation */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                  active
                    ? 'bg-gold text-[hsl(var(--gold-foreground))]'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Featured article */}
        {filter === 'All' && featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-10 block overflow-hidden rounded-3xl luxury-card"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[340px] overflow-hidden">
                <img
                  src={blogImageSrc(featured.heroImage)}
                  alt={featured.heroAlt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-gold/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--gold-foreground))]">
                  Featured · {featured.category}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold leading-tight mb-3 group-hover:text-gold transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {featured.readingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />{' '}
                    {new Date(featured.publishedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Article grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {gridPosts.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}
