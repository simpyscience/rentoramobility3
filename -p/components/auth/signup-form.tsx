'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AtSign, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { AuthShell, AuthInput, PasswordStrength, SocialButton } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuthSession } from '@/lib/auth/auth-store';

export function SignupForm() {
  const router = useRouter();
  const { signIn } = useAuthSession();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreed, setAgreed] = React.useState(true);
  const [error, setError] = React.useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email || !password) {
      setError('Please complete all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!agreed) {
      setError('Please confirm you agree to the terms.');
      return;
    }
    setError('');
    signIn({ id: 'demo-user', email, name, role: 'user' });
    router.replace('/dashboard');
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Rentora for faster bookings and a tailored travel experience."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-gold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <AuthInput
          label="Full name"
          id="name"
          value={name}
          onChange={setName}
          placeholder="Aarav Sharma"
          autoComplete="name"
          required
          icon={<User className="h-4 w-4" />}
        />
        <AuthInput
          label="Email address"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="name@rentora.com"
          autoComplete="email"
          required
          icon={<Mail className="h-4 w-4" />}
        />
        <AuthInput
          label="Create password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
          icon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <PasswordStrength password={password} />
        <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/30 px-3 py-3">
          <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(Boolean(checked))} />
          <Label htmlFor="terms" className="text-sm text-muted-foreground">
            I agree to the terms and privacy policy.
          </Label>
        </div>
        {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="btn-gold w-full rounded-2xl py-3">
          Create account
        </Button>
        <SocialButton label="Continue with Google" onClick={() => router.push('/dashboard')} />
      </form>
    </AuthShell>
  );
}
