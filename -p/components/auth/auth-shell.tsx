'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.14),_transparent_32%),linear-gradient(135deg,_rgba(12,14,18,0.98),_rgba(17,18,24,0.96))] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-background/90 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur"
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-gold/15 via-background to-background p-8 xl:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                  <Sparkles className="h-3.5 w-3.5" /> Rentora Auth
                </div>
                <h2 className="mt-6 font-display text-3xl font-semibold leading-tight">Premium access for every journey.</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  Sign in to manage bookings, save preferences, and access your future Rentora dashboard in a secure, polished experience.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Why Rentora members love it</div>
                <ul className="mt-3 space-y-2">
                  <li>• Faster repeat bookings</li>
                  <li>• Saved travel preferences</li>
                  <li>• Secure, modular account flow</li>
                </ul>
              </div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to home
              </Link>
              <div className="mt-6">
                <h1 className="font-display text-3xl font-semibold">{title}</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>
              </div>
              {children}
              <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function AuthInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  icon,
  rightIcon,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="relative">
        {icon ? <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div> : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={cn(
            'w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-gold focus:ring-1 focus:ring-gold',
            icon ? 'pl-10' : 'pl-3'
          )}
        />
        {rightIcon ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div> : null}
      </div>
    </label>
  );
}

export function PasswordStrength({ password }: { password: string }) {
  const score = React.useMemo(() => {
    let points = 0;
    if (password.length >= 8) points += 1;
    if (/[A-Z]/.test(password)) points += 1;
    if (/[0-9]/.test(password)) points += 1;
    if (/[^A-Za-z0-9]/.test(password)) points += 1;
    return points;
  }, [password]);

  const labels = ['Very weak', 'Weak', 'Fair', 'Strong'];
  const bar = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="mt-2">
      <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>Password strength</span>
        <span>{labels[Math.min(score, 3)]}</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((step) => (
          <div key={step} className={cn('h-1.5 flex-1 rounded-full', step < score ? bar[Math.max(score - 1, 0)] : 'bg-muted')} />
        ))}
      </div>
    </div>
  );
}

export function SocialButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="flex w-full items-center justify-center gap-2 rounded-2xl border-border bg-background/80 py-3">
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="#4285F4" d="M21.6 12.23c0-.79-.07-1.54-.2-2.27H12v4.3h5.39a4.61 4.61 0 0 1-2 3.03v2.52h3.24c1.9-1.75 2.97-4.33 2.97-7.58Z" />
        <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" />
        <path fill="#FBBC05" d="M6.41 13.89A6.01 6.01 0 0 1 6.41 10.1V7.5H3.07a10 10 0 0 0 0 12.78l3.34-2.39Z" />
        <path fill="#EA4335" d="M12 6.04c1.47 0 2.8.5 3.84 1.49l2.88-2.88A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.93 5.5l3.34 2.59C7.2 7.8 9.4 6.04 12 6.04Z" />
      </svg>
      {label}
    </Button>
  );
}
