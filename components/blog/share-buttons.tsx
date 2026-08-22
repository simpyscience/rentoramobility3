'use client';

import * as React from 'react';
import { MessageCircle, Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = React.useState(false);

  const links = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: MessageCircle,
      className: 'bg-[#25D366] text-white hover:opacity-90',
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: Facebook,
      className: 'bg-[#1877F2] text-white hover:opacity-90',
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      icon: Twitter,
      className: 'bg-foreground text-background hover:opacity-90',
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: Linkedin,
      className: 'bg-[#0A66C2] text-white hover:opacity-90',
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable; ignore */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Share
      </span>
      {links.map((l) => {
        const Icon = l.icon;
        return (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${l.label}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${l.className}`}
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        {copied ? <Check className="h-4 w-4 text-gold" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
