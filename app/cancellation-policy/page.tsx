import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Rentora Mobility',
  description:
    'Rentora Mobility cancellation charges by timing — from 0% when cancelled well in advance to 100% for late cancellations and no-shows.',
  alternates: { canonical: '/cancellation-policy' },
};

const SECTIONS = [
  {
    id: 'overview',
    h: 'Cancellation Overview',
    p: 'This policy explains the cancellation charges that apply to a booking and how they are calculated. The deduction depends on how much time remains before your scheduled pickup. The closer the cancellation is to the pickup time, the higher the deduction.',
  },
  {
    id: 'cancellation-charges',
    h: 'Cancellation Charges',
    p: 'The deduction from the total rental amount is determined by the table below, based on the time remaining before the scheduled pickup time.',
    table: {
      caption: 'Cancellation deduction by time remaining before scheduled pickup',
      columns: ['S. No.', 'Cancellation timing', 'Deduction from Total Rental Amount'],
      rows: [
        ['1', 'Prior to 48 hours from pick-up time', '0%'],
        ['2', 'Within 24–48 hours from pick-up time', '3%'],
        ['3', 'Within 4–24 hours from pick-up time', '50%'],
        ['4', 'Within 0–4 hours from pick-up time', '100%'],
        ['5', 'No-show', '100%'],
      ],
    },
  },
  {
    id: 'cancellation-timing',
    h: 'How the Timing Band Is Determined',
    p: 'The applicable band is worked out from the time remaining between when you request the cancellation and your scheduled pickup time:',
    list: [
      'More than 48 hours before pickup — no deduction (0%).',
      'Between 24 and 48 hours before pickup — 3% deduction.',
      'Between 4 and 24 hours before pickup — 50% deduction.',
      'Within 4 hours of pickup (including at or after the pickup time) — 100% deduction.',
    ],
  },
  {
    id: 'no-show',
    h: 'No-Show',
    p: 'If you do not arrive to use the booking, or do not use the vehicle according to the applicable booking terms, the booking may be treated as a no-show and is subject to the stated 100% deduction. We encourage you to contact us as early as possible if your plans change.',
  },
  {
    id: 'cancellation-requests',
    h: 'How to Request a Cancellation',
    p: 'To cancel a booking, please contact us using the same channels you used to book, or reach our team directly. Include your booking reference so we can locate and process the cancellation quickly.',
    list: [
      'WhatsApp: +91 99580 21329 or +91 72919 73553',
      'Call: +91 99580 21329 or +91 72919 73553',
      'Email: rentoramobility@protonmail.com',
    ],
  },
  {
    id: 'refund-calculation',
    h: 'Refund Calculation',
    p: 'When a cancellation is approved, the amount refunded is the total rental amount minus the applicable cancellation deduction. No additional charges are applied beyond the deduction shown above.',
    list: ['Refundable amount = Total Rental Amount − Applicable Cancellation Deduction'],
  },
  {
    id: 'cancellation-by-rentora',
    h: 'Cancellation by Rentora Mobility',
    p: 'In the rare event that we are unable to provide a confirmed vehicle due to unforeseen operational circumstances, you will be offered a suitable alternative or a full refund of the amount paid for that booking, at your choice.',
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Cancellation Policy"
      category="Legal · Cancellations"
      intro="Our cancellation charges are clear and time-based — the earlier you cancel, the smaller the deduction."
      heroImage="/images/policies/cancellation-policy.jfif"
      heroAlt="Rentora Mobility team coordinating a booking cancellation for a customer"
      lastUpdated="August 2025"
      sections={SECTIONS}
    />
  );
}
