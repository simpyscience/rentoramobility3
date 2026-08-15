export const CONTACT = {
  company: 'Rentora Mobility',
  tagline: 'Premium Mobility. Trusted Journeys.',
  email: 'rentoramobility@protonmail.com',
  phone: '+91 9958021329',
  phoneDisplay: '+91 99580 21329',
  phone2: '+91 7291973553',
  phone2Display: '+91 72919 73553',
  whatsapp: '919958021329',
  whatsappDisplay: '+91 99580 21329',
  whatsapp2: '917291973553',
  whatsapp2Display: '+91 72919 73553',
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function whatsapp2Link(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp2}?text=${encodeURIComponent(message)}`;
}

export function telLink(): string {
  return `tel:${CONTACT.phone.replace(/\s/g, '')}`;
}

export function tel2Link(): string {
  return `tel:${CONTACT.phone2.replace(/\s/g, '')}`;
}

export function mailtoLink(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  return `mailto:${CONTACT.email}${query ? `?${query}` : ''}`;
}

export interface ContactChannel {
  label: string;
  display: string;
  href: string;
  icon: 'phone' | 'whatsapp' | 'mail' | 'clock';
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  { label: 'Call us', display: CONTACT.phoneDisplay, href: telLink(), icon: 'phone' },
  { label: 'WhatsApp', display: CONTACT.whatsappDisplay, href: whatsappLink('Hello Rentora Mobility'), icon: 'whatsapp' },
  { label: 'Email', display: CONTACT.email, href: mailtoLink(), icon: 'mail' },
];
