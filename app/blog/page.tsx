import type { Metadata } from 'next';
import Link from 'next/link';
import { MotionDiv } from '@/components/ui/motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/section-heading';
import { BLOG_POSTS } from '@/lib/data/site';

export const metadata: Metadata = {
  title: 'Blog — Travel Tips & Car Rental Guides | Rentora Mobility',
  description: 'Read our latest articles on road trips, car rental tips, luxury travel and mobility guides for India. Expert advice from Rentora Mobility.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div className="pt-28 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Rentora Blog"
          title="Travel Tips & Car Guides"
          subtitle="Expert advice on road trips, luxury travel, car rentals and everything mobility in India."
        />

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="block mt-12">
          <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="luxury-card group overflow-hidden grid md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
              <img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0">{featured.category}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-gold transition-colors">{featured.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                {new Date(featured.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </MotionDiv>
        </Link>

        {/* Rest of posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {rest.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="luxury-card group overflow-hidden h-full">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <Badge className="absolute top-3 left-3 bg-gold/90 text-[hsl(var(--gold-foreground))] border-0">{post.category}</Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </div>
                  <h3 className="font-display text-lg font-bold leading-tight mb-2 group-hover:text-gold transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  <span className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </MotionDiv>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
