import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MotionDiv } from '@/components/ui/motion';
import { Calendar, Clock, ArrowRight, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BLOG_POSTS } from '@/lib/data/site';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | Rentora Mobility Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: 'article',
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="container-lux relative px-4 sm:px-6 lg:px-8 pb-12">
          <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
              <Link href="/" className="hover:text-gold">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog" className="hover:text-gold">Blog</Link>
            </div>
            <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0 mb-3">{post.category}</Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight max-w-3xl">{post.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime}</span>
              <span>By {post.author}</span>
            </div>
          </MotionDiv>
        </div>
      </div>

      {/* Content */}
      <article className="container-lux px-4 sm:px-6 lg:px-8 max-w-3xl mt-12">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-6 font-light">{post.excerpt}</p>
          <div className="text-base leading-relaxed space-y-4 text-foreground/90">
            {post.content.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </MotionDiv>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 p-6 text-center">
          <h3 className="font-display text-xl font-bold mb-2">Ready to Book Your Journey?</h3>
          <p className="text-sm text-muted-foreground mb-4">Explore our premium fleet or talk to us directly.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/fleet"><Button className="btn-gold rounded-full">View Fleet <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            <a href={whatsappLink('Hello, I read your blog and would like to book a car.')} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="rounded-full"><MessageCircle className="h-4 w-4 mr-2" /> WhatsApp</Button></a>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <div className="container-lux px-4 sm:px-6 lg:px-8 mt-16">
          <h3 className="font-display text-2xl font-bold mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <div className="luxury-card group overflow-hidden h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-sm leading-tight group-hover:text-gold transition-colors">{p.title}</h4>
                    <span className="text-xs text-muted-foreground mt-2 block">{p.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
