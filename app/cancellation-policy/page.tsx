import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Rentora Mobility',
  description: 'Read the Rentora Mobility cancellation policy. Understand cancellation charges, timing and refund process.',
  alternates: { canonical: '/cancellation-policy' },
};

const CONTENT = [
  { h: 'Free Cancellation Window', p: 'You can cancel your booking free of charge up to 24 hours before your scheduled pickup time. The full advance amount will be refunded (minus payment gateway charges, if any).' },
  { h: 'Cancellation Within 24 Hours', p: 'Cancellations made within 24 hours of the pickup time incur a 25% cancellation fee. The remaining amount will be refunded within 5-7 business days.' },
  { h: 'No-Show Policy', p: 'If you fail to show up at the designated pickup time without prior notice, 50% of the booking amount will be charged as a no-show fee. The remaining balance may be refunded at our discretion.' },
  { h: 'How to Cancel', p: 'You can cancel your booking by contacting us via WhatsApp at +91 99580 21329 or +91 72919 73553, calling +91 99580 21329 or +91 72919 73553, or emailing rentoramobility@protonmail.com with your booking reference number.' },
  { h: 'Cancellation by Rentora', p: 'In the rare event that we must cancel your booking due to unforeseen circumstances (vehicle breakdown, natural disaster, force majeure), you will receive a full refund or an equivalent replacement vehicle at no extra cost.' },
  { h: 'Rescheduling', p: 'You can reschedule your booking once free of charge up to 12 hours before pickup, subject to availability. Additional rescheduling or changes within 12 hours may incur a fee.' },
  { h: 'Refund Timeline', p: 'All approved refunds are processed within 5-7 business days to the original payment method. The exact credit time depends on your bank or payment provider.' },
];

export default function Page() {
  return <LegalPage title="Cancellation Policy" updated="August 2025" sections={CONTENT} />;
}
