'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { AuthShell, AuthInput } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we’ll help you reset it securely."
      footer={
        <>
          Remembered your password?{' '}
          <Link href="/login" className="font-semibold text-gold hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <AuthInput
          label="Email address"
          id="reset-email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="name@rentora.com"
          autoComplete="email"
          required
          icon={<Mail className="h-4 w-4" />}
        />
        {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        {sent ? <p className="rounded-2xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-600">Password reset instructions were prepared for your email.</p> : null}
        <Button type="submit" className="btn-gold w-full rounded-2xl py-3">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
