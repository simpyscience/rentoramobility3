import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rentora Mobility',
  description:
    'How Rentora Mobility collects, uses and protects the information you share when booking and using our car rental and mobility services.',
  alternates: { canonical: '/privacy-policy' },
};

const SECTIONS = [
  {
    id: 'information-we-collect',
    h: 'Information We Collect',
    p: 'We collect information that you provide to us and information that is generated when you use our website and services. We only collect what is reasonably needed to deliver and support your rental experience.',
    list: [
      'Identity and contact details — such as your name, phone number and email address.',
      'Trip and booking details — pickup and drop-off locations, selected vehicle, travel dates and times, and any notes you share with us.',
      'Account and verification information — details needed to confirm a booking, such as a valid driving licence for self-drive rentals.',
      'Payment and billing information — details you provide to confirm and pay for a booking.',
      'Communications — messages, calls or chats you exchange with our team about a booking or enquiry.',
      'Technical information — such as your device type, browser, IP address and how you interact with the website, collected automatically as you browse.',
    ],
  },
  {
    id: 'how-we-use-information',
    h: 'How We Use Information',
    p: 'We use the information we collect for legitimate, operational purposes related to running our services:',
    list: [
      'Processing and managing your bookings and rentals.',
      'Providing the vehicle, chauffeur and support services you request.',
      'Communicating with you about your reservation, changes and support.',
      'Responding to enquiries and resolving issues.',
      'Maintaining internal records, accounts and operational history.',
      'Improving the website and the overall service experience.',
      'Preventing fraud, misuse and protecting our customers and business.',
    ],
  },
  {
    id: 'booking-information',
    h: 'Booking Information',
    p: 'When you submit a booking, the details you provide — including your contact information, trip plan, dates and vehicle selection — are used to check availability, confirm the reservation and prepare the vehicle or chauffeur for your journey. Booking information is retained as part of your rental record and may be referenced for future trips, support and accounting.',
  },
  {
    id: 'communications',
    h: 'Communications',
    p: 'We use your contact details to send service-related communications that are necessary for your booking. These may include booking confirmations, pickup details, changes, cancellation updates and customer-support messages. We do not send marketing communications unless you have separately agreed to receive them, and you can opt out of optional messages at any time.',
  },
  {
    id: 'cookies-technical-data',
    h: 'Cookies & Technical Data',
    p: 'Our website uses cookies and similar technologies to keep the site functioning, remember your preferences (such as display and theme settings) and maintain secure sessions. These technologies help us understand basic usage so we can keep the website reliable. You can control or disable cookies through your browser settings; some features may work differently if cookies are disabled.',
  },
  {
    id: 'data-sharing',
    h: 'Data Sharing',
    p: 'We do not sell your personal information. We may share information only where it is operationally necessary or legally required, such as:',
    list: [
      'With service providers who help deliver the booking — for example, payment processing, insurance partners and assigned chauffeurs.',
      'With technology and infrastructure providers that operate our website and systems.',
      'When required by law, regulation, legal process or to protect the rights, safety and property of our customers and business.',
    ],
  },
  {
    id: 'data-security',
    h: 'Data Security',
    p: 'We maintain reasonable administrative, technical and physical safeguards designed to protect your information from unauthorised access, loss or misuse. While we work to protect your data, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.',
  },
  {
    id: 'data-retention',
    h: 'Data Retention',
    p: 'We retain personal information for as long as reasonably necessary to process your bookings, provide ongoing services, meet legal and tax obligations, resolve disputes and maintain legitimate business records. When information is no longer required, we take steps to delete or anonymise it.',
  },
  {
    id: 'your-rights',
    h: 'Your Rights & Requests',
    p: 'You may request access to, correction of, or deletion of the personal information we hold about you, subject to applicable law and our retention obligations. To make a request or ask a question about your data, contact us using the details below. We will respond through an appropriate channel as soon as we reasonably can.',
    list: [
      'Email: rentoramobility@protonmail.com',
      'Phone / WhatsApp: +91 99580 21329 or +91 72919 73553',
    ],
  },
  {
    id: 'policy-updates',
    h: 'Policy Updates',
    p: 'We may update this Privacy Policy when our business, technology or legal requirements change. When we make material changes, we will post the updated policy on this page and update the “Last updated” date above. We encourage you to review this page periodically.',
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      category="Legal · Privacy"
      intro="How Rentora Mobility collects, uses and protects the information you share when you use our car rental and mobility services."
      heroImage="/images/policies/privacy-policy.jfif"
      heroAlt="Rentora Mobility representative reviewing a customer's premium car rental booking"
      lastUpdated="August 2025"
      sections={SECTIONS}
    />
  );
}
