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

export function telLink(): string {
  return `tel:${CONTACT.phone.replace(/\s/g, '')}`;
}
