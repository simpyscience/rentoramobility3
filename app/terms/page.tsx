import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Terms of Service | Rentora Mobility',
  description: 'Read the terms of service for Rentora Mobility. Understand the terms and conditions for using our car rental platform.',
  alternates: { canonical: '/terms' },
};

const CONTENT = [
  { h: 'Acceptance of Terms', p: 'By accessing and using Rentora Mobility\'s website and services, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.' },
  { h: 'Eligibility', p: 'You must be at least 21 years old to rent a vehicle (25 for luxury cars) and hold a valid driving licence for self-drive rentals. For chauffeur-driven rentals, you must be at least 18 years old with a valid government-issued ID.' },
  { h: 'Bookings and Payment', p: 'All bookings are subject to vehicle availability. A partial advance payment confirms your reservation, with the balance due at pickup. We accept UPI, credit/debit cards, net banking and wallets. Prices include GST unless stated otherwise.' },
  { h: 'Cancellations', p: 'Free cancellation up to 24 hours before pickup. Cancellations within 24 hours incur a 25% fee. No-shows are charged at 50% of the booking amount. See our cancellation policy for full details.' },
  { h: 'Vehicle Use', p: 'The rented vehicle must be used in accordance with all applicable laws. You are responsible for any traffic violations, tolls, parking charges, and damage to the vehicle during the rental period. Subletting or commercial use of the vehicle is prohibited.' },
  { h: 'Insurance', p: 'All our vehicles are covered by comprehensive insurance. However, you are responsible for deductibles in case of damage caused by negligent driving. Additional damage waiver options are available at the time of booking.' },
  { h: 'Chauffeur-Driven Rentals', p: 'For chauffeur-driven rentals, the chauffeur\'s working hours are limited to 12 hours per day. Additional hours are chargeable. Night halt charges may apply for late-night usage.' },
  { h: 'Liability', p: 'Rentora Mobility is not liable for indirect or consequential damages arising from the use of our services. Our liability is limited to the booking amount paid.' },
  { h: 'Changes to Terms', p: 'We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.' },
  { h: 'Contact', p: 'For questions about these terms, contact us at rentoramobility@gmail.com or +91 9958021329.' },
];

export default function Page() {
  return <LegalPage title="Terms of Service" updated="August 2025" sections={CONTENT} />;
}
