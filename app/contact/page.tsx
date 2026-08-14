import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact/contact-page';

export const metadata: Metadata = {
  title: 'Contact Us — Rentora Mobility | Premium Car Rental India',
  description: 'Get in touch with Rentora Mobility. Call +91 9958021329 or +91 7291973553, WhatsApp, or email rentoramobility@protonmail.com. Available 24/7 across India.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <ContactPage />;
}
