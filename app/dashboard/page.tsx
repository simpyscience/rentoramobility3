import { ProtectedRoute } from '@/components/auth/protected-route';

export const metadata = {
  title: 'Dashboard',
  description: 'Your Rentora dashboard placeholder.',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-luxury">
          <div className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
            Dashboard placeholder
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold">Welcome to your Rentora dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            This protected area is ready for your future bookings, saved preferences, and account management screens. It is currently a placeholder so the authentication layer can be integrated cleanly with Supabase or Firebase later.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
