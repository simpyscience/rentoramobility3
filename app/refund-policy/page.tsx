import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Refund Policy | Rentora Mobility',
  description:
    'How refunds work for Rentora Mobility rentals — eligibility, how cancellations affect refunds, processing and contacting our team.',
  alternates: { canonical: '/refund-policy' },
};

const SECTIONS = [
  {
    id: 'overview',
    h: 'Refund Overview',
    p: 'This policy explains when a refund may apply, how a cancellation affects the refundable amount, and how approved refunds are processed. It works together with our Cancellation Policy, which defines the deduction applied based on when a cancellation is requested.',
  },
  {
    id: 'refund-eligibility',
    h: 'When a Refund May Apply',
    p: 'A refund may apply when a booking is cancelled, when Rentora Mobility is unable to fulfil a confirmed booking, or in other circumstances agreed with our team. The amount refunded depends on the cancellation timing described in our Cancellation Policy.',
    list: [
      'Cancelling well in advance attracts little or no deduction.',
      'Cancelling closer to the pickup time attracts a higher deduction, as set out in the Cancellation Policy.',
      'A no-show is treated as a cancellation at the pickup time and is subject to the applicable deduction.',
    ],
  },
  {
    id: 'how-cancellation-affects-refunds',
    h: 'How Cancellation Affects Your Refund',
    p: 'The deduction applied to a cancellation is determined by the time remaining before your scheduled pickup. The later the cancellation, the larger the deduction — so the refundable amount is reduced accordingly. The full schedule is published in our Cancellation Policy.',
  },
  {
    id: 'refund-calculation',
    h: 'Refund Calculation',
    p: 'The amount refunded is calculated as the total rental amount minus the applicable cancellation deduction. The formula is:',
    list: [
      'Refundable amount = Total Rental Amount − Applicable Cancellation Deduction',
      'For example, if the total rental amount is ₹10,000 and the applicable deduction is 50%, the refundable amount is ₹5,000.',
    ],
  },
  {
    id: 'processing-refunds',
    h: 'How Approved Refunds Are Processed',
    p: 'Once a cancellation or refund is approved, we initiate the refund to the original payment method used for the booking. The time it takes for the refund to appear depends on your bank, card issuer or payment provider, and is outside our direct control. We will confirm the refund initiation with you where possible.',
  },
  {
    id: 'non-refundable-charges',
    h: 'Charges Outside the Refundable Amount',
    p: 'Certain pass-through charges are billed at actuals and are not part of the refundable rental amount. These may include tolls, parking, state taxes and similar expenses incurred during the trip. Add-on or ancillary services that have already been availed may not be refundable.',
  },
  {
    id: 'cancellation-by-rentora',
    h: 'If We Cannot Fulfil a Booking',
    p: 'In the rare event that Rentora Mobility is unable to provide a confirmed vehicle (for example, due to an unforeseen operational issue), you will be offered a suitable alternative or a full refund of the amount paid for that booking, at your choice.',
  },
  {
    id: 'contact-support',
    h: 'Refund Support & Contact',
    p: 'If you have a question about a refund, or believe a refund is due, please reach out with your booking reference. Our team will review the booking against the Cancellation and Refund Policies and respond with the next steps. We aim to keep refund communication clear and timely.',
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Refund Policy"
      category="Legal · Refunds"
      intro="How refunds work for Rentora Mobility rentals — when they apply, how cancellations affect them, and how they are processed."
      heroImage="/images/policies/refund-policy.jfif"
      heroAlt="Rentora Mobility customer receiving a clear refund explanation from the support team"
      lastUpdated="August 2025"
      sections={SECTIONS}
    />
  );
}
