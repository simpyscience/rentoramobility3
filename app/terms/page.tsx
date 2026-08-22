import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Terms of Service | Rentora Mobility',
  description:
    'The terms that apply when you use the Rentora Mobility website and vehicle rental services, including bookings, responsibilities and liabilities.',
  alternates: { canonical: '/terms' },
};

const SECTIONS = [
  {
    id: 'acceptance',
    h: 'Acceptance of Terms',
    p: 'By accessing or using the Rentora Mobility website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with these terms, please do not use our services.',
  },
  {
    id: 'about-the-service',
    h: 'About the Service',
    p: 'Rentora Mobility provides vehicle rental and mobility-related booking services through its website. This includes self-drive and chauffeur-driven options, airport transfers, outstation trips, corporate rentals and related services, subject to availability.',
  },
  {
    id: 'booking',
    h: 'Booking',
    p: 'When you make a booking you provide trip and contact information, select a vehicle and choose your dates. Bookings are subject to confirmation by our system or team based on availability. You are responsible for reviewing your booking details — including pickup location, dates, times and vehicle — before confirming.',
  },
  {
    id: 'customer-responsibilities',
    h: 'Customer Responsibilities',
    p: 'To use our services responsibly, you agree to the following:',
    list: [
      'Provide accurate and complete information for your booking and account.',
      'Arrive at the agreed pickup time and location, or inform us promptly of changes.',
      'Comply with rental requirements, including holding a valid driving licence where applicable.',
      'Use the vehicle and services lawfully and only as permitted by the booking terms.',
    ],
  },
  {
    id: 'pricing-payment',
    h: 'Pricing and Payment',
    p: 'Prices are shown on the website for the selected vehicle and trip. You agree to pay the total amount presented at the time of booking, which includes applicable taxes as displayed. A partial advance payment confirms your reservation, with the balance payable as agreed at pickup. Payment is processed through the methods made available during booking.',
  },
  {
    id: 'cancellation-refunds',
    h: 'Cancellation and Refunds',
    p: 'Cancellations and refunds are governed by our separate Cancellation Policy and Refund Policy. Those policies define the deductions that apply based on cancellation timing and how approved refunds are processed. Please review them before booking.',
    list: [
      <Link key="c" href="/cancellation-policy" className="font-medium text-gold underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        Cancellation Policy
      </Link>,
      <Link key="r" href="/refund-policy" className="font-medium text-gold underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        Refund Policy
      </Link>,
    ],
  },
  {
    id: 'vehicle-availability',
    h: 'Vehicle Availability',
    p: 'Requested vehicles are subject to availability and operational circumstances at the time of the booking. While we work to provide the exact vehicle selected, a confirmed booking is what guarantees the service. In the rare event a confirmed vehicle cannot be provided, we will offer a suitable alternative or a refund as described in our policies.',
  },
  {
    id: 'website-use',
    h: 'Acceptable Website Use',
    p: 'You agree not to misuse the website or services. Prohibited conduct includes unlawful activity, unauthorised attempts to access systems or data, deliberately disrupting website functionality, and submitting false or fraudulent information.',
  },
  {
    id: 'intellectual-property',
    h: 'Intellectual Property',
    p: 'The content, branding, design, text, images and materials on the Rentora Mobility website are owned by or licensed to Rentora Mobility and are protected where applicable by intellectual-property laws. You may not reproduce or reuse them without prior written permission.',
  },
  {
    id: 'third-party-services',
    h: 'Third-Party Services',
    p: 'To operate the website and deliver bookings, we work with service providers such as hosting, database and payment infrastructure, and operational partners including chauffeurs and insurance providers. Your information is handled by these providers only as needed to deliver the service, as described in our Privacy Policy.',
  },
  {
    id: 'limitation-liability',
    h: 'Limitation of Liability',
    p: 'To the fullest extent permitted by law, Rentora Mobility is not liable for indirect, incidental or consequential damages arising from the use of our website or services. Our total liability in connection with a booking is limited to the amount paid for that booking. Nothing in these terms excludes liability that cannot be excluded under applicable law.',
  },
  {
    id: 'changes-to-terms',
    h: 'Changes to These Terms',
    p: 'We may update these Terms of Service when our business, technology or legal requirements change. Continued use of the website or services after changes are posted constitutes acceptance of the updated terms. The “Last updated” date above reflects the latest revision.',
  },
  {
    id: 'contact',
    h: 'Contact',
    p: 'For questions about these terms, please contact us. We are available to help with bookings, clarifications and support.',
    list: [
      'Email: rentoramobility@protonmail.com',
      'Phone / WhatsApp: +91 99580 21329 or +91 72919 73553',
      'Address: 52, 1st Floor, Union Bank, Wazirabad, Gurugram-122003',
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Terms of Service"
      category="Legal · Terms"
      intro="The terms that apply when you use the Rentora Mobility website and vehicle rental services."
      heroImage="/images/policies/terms-of-service.jfif"
      heroAlt="Rentora Mobility service agreement and booking terms documentation"
      lastUpdated="August 2025"
      sections={SECTIONS}
    />
  );
}
