import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { StructuredData } from '@/components/seo/structured-data';
import { LazyGlobals } from '@/components/layout/lazy-globals';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = 'https://rentoramobility.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rentora Mobility — Premium Car Rental & Mobility Platform in India',
    template: '%s | Rentora Mobility',
  },
  description:
    'Rentora Mobility offers premium car rentals across India — luxury cars, SUVs, corporate rentals, airport transfers, wedding cars & self drive. Book Innova Crysta, Fortuner, BMW, Mercedes and more. Available across India.',
  keywords: [
    'car rental India',
    'luxury car rental',
    'Innova Crysta rental',
    'Fortuner on rent',
    'BMW rent India',
    'Mercedes rental',
    'airport transfer India',
    'corporate car rental',
    'wedding car rental',
    'self drive cars',
    'outstation taxi',
    'Rentora Mobility',
  ],
  authors: [{ name: 'Rentora Mobility' }],
  creator: 'Rentora Mobility',
  publisher: 'Rentora Mobility',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Rentora Mobility',
    title: 'Rentora Mobility — Premium Mobility. Trusted Journeys.',
    description:
      'Premium car rentals across India. Luxury cars, SUVs, corporate rentals, airport transfers, wedding cars & self drive.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rentora Mobility — Premium Car Rental & Mobility Platform in India',
    description:
      'Premium car rentals across India. Luxury cars, SUVs, corporate rentals, airport transfers, wedding cars & self drive.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'travel',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <StructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <LazyGlobals />
        </ThemeProvider>
      </body>
    </html>
  );
}
