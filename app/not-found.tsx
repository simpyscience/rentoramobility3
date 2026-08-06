import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-20">
      <div className="text-center max-w-md">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-gold/10 text-gold mb-6">
          <Car className="h-10 w-10" />
        </div>
        <h1 className="font-display text-6xl font-bold text-gradient-gold mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">The page you&apos;re looking for has driven off. Let&apos;s get you back on track.</p>
        <Link href="/">
          <Button className="btn-gold rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
