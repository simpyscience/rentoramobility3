'use client';

import * as React from 'react';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  const [broken, setBroken] = React.useState(false);
  return (
    <Link href="/" className={`flex items-center gap-2.5 shrink-0 ${className || ''}`}>
      {!broken ? (
        <img
          src="/brand/rentora-mobility-logo.png"
          alt="Rentora Mobility"
          onError={() => setBroken(true)}
          className="h-10 w-auto object-contain"
        />
      ) : (
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark shadow-gold">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-[hsl(var(--gold-foreground))]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2.2-3.5-2.2c-1.8 0-3 1.2-3.5 2.2C8.5 9.6 7.5 11 7.5 11H5.5c-.6 0-1 .4-1 1v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">Rentora</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">Mobility</div>
          </div>
        </div>
      )}
    </Link>
  );
}
