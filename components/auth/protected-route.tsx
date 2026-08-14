'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/lib/auth/auth-store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, hydrated } = useAuthSession();

  React.useEffect(() => {
    if (hydrated && !user) {
      router.replace('/login');
    }
  }, [hydrated, router, user]);

  if (!hydrated) return null;
  if (!user) return null;

  return <>{children}</>;
}
