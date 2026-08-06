import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { VoiceAssistant } from '@/components/voice-assistant/voice-assistant';
import { FloatingActions } from '@/components/layout/floating-actions';
import { StructuredData } from '@/components/seo/structured-data';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
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
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rentora Mobility — Premium Car Rental & Mobility Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rentora Mobility — Premium Car Rental & Mobility Platform in India',
    description:
      'Premium car rentals across India. Luxury cars, SUVs, corporate rentals, airport transfers, wedding cars & self drive.',
    images: ['/og-image.jpg'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Rentora Mobility',
              url: SITE_URL,
              email: 'rentoramobility@gmail.com',
              telephone: '+91 9958021329',
              areaServed: 'India',
              slogan: 'Premium Mobility. Trusted Journeys.',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
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
          <FloatingActions />
          <VoiceAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
