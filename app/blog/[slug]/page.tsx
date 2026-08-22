import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BLOG_POSTS,
  getBlogPost,
  getRelatedPosts,
  BLOG_CATEGORIES,
  blogImageSrc,
  type BlogCategory,
} from '@/lib/data/blog';
import { ArticleContent } from '@/components/blog/article-content';
import { BlogCard } from '@/components/blog/blog-card';
import { ShareButtons } from '@/components/blog/share-buttons';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';

const SITE_URL = 'https://rentoramobility.in';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return { title: 'Article Not Found | Rentora Mobility' };

  const image = `${SITE_URL}${blogImageSrc(post.heroImage)}`;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | Rentora Mobility Journal`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'Rentora Mobility',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const absoluteUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageAbsolute = `${SITE_URL}${blogImageSrc(post.heroImage)}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [imageAbsolute],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Organization', name: 'Rentora Mobility' },
    publisher: {
      '@type': 'Organization',
      name: 'Rentora Mobility',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand/rentora-mobility-logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl },
  };

  return (
    <div className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      <div className="container-lux px-4 sm:px-6 lg:px-8 pt-28">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/blog" className="hover:text-gold">Blog</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/blog" className="hover:text-gold">{post.category}</Link>
        </nav>
      </div>

      {/* Article header */}
      <header className="container-lux px-4 sm:px-6 lg:px-8 mt-4">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-gold/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--gold-foreground))]">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight leading-[1.12] text-foreground">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />{' '}
              {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingTime}
            </span>
            {post.updatedAt && (
              <span>Updated {new Date(post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            )}
            <span>By {post.author}</span>
          </div>
        </div>
      </header>

      {/* Hero image */}
      <div className="container-lux px-4 sm:px-6 lg:px-8 mt-8">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl">
          <img
            src={blogImageSrc(post.heroImage)}
            alt={post.heroAlt}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Body + sidebar */}
      <div className="container-lux px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="mx-auto w-full max-w-3xl">
            <ArticleContent blocks={post.content} />

            <div className="mt-8 border-t border-border pt-6">
              <ShareButtons url={absoluteUrl} title={post.title} />
            </div>

            {/* In-article CTA */}
            <div className="mt-10 rounded-2xl border border-gold/20 bg-gold/5 p-6 text-center">
              <h3 className="font-display text-xl font-semibold mb-2">Ready to plan your journey?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explore our premium fleet or talk to our team — we are happy to help you choose the right vehicle.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/fleet">
                  <Button className="btn-gold rounded-full">View Fleet <ArrowRight className="h-4 w-4 ml-2" /></Button>
                </Link>
                <a href={whatsappLink('Hello, I read your blog and would like to book a car.')} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-full">
                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </article>

          {/* Sidebar (stacks below the article on mobile) */}
          <aside className="mt-12 lg:mt-0 lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold mb-3">Book a Ride</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Premium cars with verified chauffeurs, available across India.
                </p>
                <Link href="/fleet" className="block">
                  <Button className="btn-gold w-full rounded-full">View Fleet</Button>
                </Link>
                <a href={telLink()} className="mt-3 flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:border-gold/50 hover:text-gold transition-colors">
                  <Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold mb-3">Categories</h3>
                <ul className="space-y-1.5">
                  {BLOG_CATEGORIES.map((cat: BlogCategory) => (
                    <li key={cat}>
                      <Link
                        href="/blog"
                        className="text-sm text-muted-foreground transition-colors hover:text-gold"
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related articles */}
      <section className="container-lux px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
