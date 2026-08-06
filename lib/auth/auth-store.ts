'use client';

import * as React from 'react';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
};

const STORAGE_KEY = 'rentora-auth-user';

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function useAuthSession() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setUser(getStoredUser());
    setHydrated(true);
  }, []);

  const signIn = React.useCallback((nextUser: AuthUser) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    }
    setUser(nextUser);
  }, []);

  const signOut = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setUser(null);
  }, []);

  return { user, hydrated, signIn, signOut };
}
