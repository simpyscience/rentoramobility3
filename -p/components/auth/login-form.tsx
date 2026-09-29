'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AtSign, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { AuthShell, AuthInput, PasswordStrength, SocialButton } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuthSession } from '@/lib/auth/auth-store';

export function LoginForm() {
  const router = useRouter();
  const { signIn, user } = useAuthSession();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [router, user]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    signIn({ id: 'demo-user', email, name: email.split('@')[0], role: 'user' });
    router.replace('/dashboard');
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your premium travel experience."
      footer={
        <>
          New to Rentora?{' '}
          <Link href="/signup" className="font-semibold text-gold hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          icon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(Boolean(checked))} />
            <Label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me
            </Label>
          </div>
          <Link href="/forgot-password" className="text-sm text-gold hover:underline">
            Forgot password?
          </Link>
        </div>
        {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="btn-gold w-full rounded-2xl py-3">
          Sign in
        </Button>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <SocialButton label="Continue with Google" onClick={() => router.push('/dashboard')} />
      </form>
    </AuthShell>
  );
}
