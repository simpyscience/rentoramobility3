'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminLogin() {
  const router = useRouter();
  const [apiKey, setApiKey] = React.useState('');
  const [showKey, setShowKey] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter your admin access key.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        router.replace('/admin/bookings');
      } else {
        setError(data.error || 'Authentication failed.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md"
        >
          <div className="luxury-card p-8 md:p-10">
            <div className="flex items-center gap-2 text-gold mb-6 justify-center">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Admin Access</span>
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold text-center mb-2">Admin Sign In</h1>
            <p className="text-center text-sm text-muted-foreground mb-8">
              Enter your admin access key to manage bookings.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="apiKey" className="block text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                  <Lock className="h-3.5 w-3.5 text-gold" /> Admin Access Key
                </label>
                <div className="relative">
                  <input
                    id="apiKey"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your access key"
                    className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')}
                    autoComplete="off"
                    autoFocus
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="btn-gold w-full rounded-full h-12">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <a href="/" className="text-gold hover:underline">Back to Rentora Mobility</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
