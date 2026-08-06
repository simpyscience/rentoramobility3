'use client';

import * as React from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { AuthShell, AuthInput, PasswordStrength } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';

export function ResetPasswordForm() {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill both password fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setSuccess(true);
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Choose a strong new password for your Rentora account."
      footer={
        <>
          <Link href="/login" className="font-semibold text-gold hover:underline">
            Return to login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <AuthInput
          label="New password"
          id="new-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
          placeholder="Enter a new password"
          autoComplete="new-password"
          required
          icon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <AuthInput
          label="Confirm password"
          id="confirm-password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
          required
          icon={<Lock className="h-4 w-4" />}
        />
        <PasswordStrength password={password} />
        {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="rounded-2xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-600">Your password has been updated successfully.</p> : null}
        <Button type="submit" className="btn-gold w-full rounded-2xl py-3">
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
