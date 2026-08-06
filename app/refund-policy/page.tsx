import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Refund Policy | Rentora Mobility',
  description: 'Read the Rentora Mobility refund policy. Learn about refund eligibility, processing times and conditions.',
  alternates: { canonical: '/refund-policy' },
};

const CONTENT = [
  { h: 'Refund Eligibility', p: 'Refunds are applicable for cancellations made more than 24 hours before the pickup time (full refund minus payment gateway charges). For cancellations within 24 hours, a 25% cancellation fee is deducted. No-shows are charged at 50% of the booking amount.' },
  { h: 'Processing Time', p: 'Approved refunds are processed within 5-7 business days to the original payment method. Bank transfer refunds may take up to 10 business days depending on your bank.' },
  { h: 'Partial Refunds', p: 'If you return the vehicle early, a partial refund may be considered on a case-by-case basis, subject to our minimum rental period policy. Early returns do not automatically qualify for pro-rated refunds.' },
  { h: 'Non-Refundable Items', p: 'Add-on services such as decoration, driver allowance, and toll/parking charges are non-refundable once availed. Booking changes requested within 12 hours of pickup may incur rescheduling fees.' },
  { h: 'Damage Charges', p: 'If the vehicle is returned with damage beyond normal wear and tear, the repair cost will be deducted from any applicable refund. An itemised damage report will be shared with you.' },
  { h: 'Refund Method', p: 'Refunds are credited back to the original payment method only. For cash payments, refunds are processed via bank transfer to your account.' },
  { h: 'Disputes', p: 'If you disagree with a refund decision, please contact us at rentoramobility@gmail.com within 7 days of the decision. We will review your case and respond within 3 business days.' },
];

export default function Page() {
  return <LegalPage title="Refund Policy" updated="August 2025" sections={CONTENT} />;
}
