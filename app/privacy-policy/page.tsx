import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rentora Mobility',
  description: 'Read the Rentora Mobility privacy policy. Learn how we collect, use and protect your personal data.',
  alternates: { canonical: '/privacy-policy' },
};

const CONTENT = [
  { h: 'Information We Collect', p: 'We collect information you provide directly to us, including your name, email address, phone number, driving licence details (for self-drive rentals), and payment information. We also automatically collect certain data such as your IP address, browser type, and usage data through cookies and similar technologies.' },
  { h: 'How We Use Your Information', p: 'We use your information to process bookings, verify your identity, communicate with you about your reservations, provide customer support, send promotional communications (with your consent), improve our services, and comply with legal obligations.' },
  { h: 'Information Sharing', p: 'We do not sell your personal information. We may share your data with our service partners (payment processors, insurance providers, chauffeurs) solely for the purpose of fulfilling your booking. We may also disclose information when required by law.' },
  { h: 'Data Security', p: 'We implement industry-standard security measures including SSL encryption, secure servers, and restricted access to protect your personal information. However, no method of transmission over the internet is 100% secure.' },
  { h: 'Cookies', p: 'We use cookies to enhance your browsing experience, remember your preferences, and analyse site traffic. You can control cookies through your browser settings.' },
  { h: 'Your Rights', p: 'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, contact us at rentoramobility@protonmail.com.' },
  { h: 'Children\'s Privacy', p: 'Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.' },
  { h: 'Changes to This Policy', p: 'We may update this privacy policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised date.' },
  { h: 'Contact Us', p: 'For any questions about this privacy policy, contact us at rentoramobility@protonmail.com or +91 9958021329 / +91 7291973553.' },
];

export default function Page() {
  return <LegalPage title="Privacy Policy" updated="August 2025" sections={CONTENT} />;
}
