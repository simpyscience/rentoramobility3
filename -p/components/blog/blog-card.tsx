import Link from 'next/link';
import { Clock, Calendar } from 'lucide-react';
import { blogImageSrc, type BlogPost } from '@/lib/data/blog-content';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="luxury-card overflow-hidden h-full flex flex-col transition-shadow hover:shadow-luxury">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={blogImageSrc(post.heroImage)}
            alt={post.heroAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-full bg-gold/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--gold-foreground))]">
            {post.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readingTime}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />{' '}
              {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug mb-2 group-hover:text-gold transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
          <span className="mt-auto pt-4 text-sm font-semibold text-gold">Read Article →</span>
        </div>
      </article>
    </Link>
  );
}
