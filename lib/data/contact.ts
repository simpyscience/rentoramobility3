export const CONTACT = {
  company: 'Rentora Mobility',
  tagline: 'Premium Mobility. Trusted Journeys.',
  email: 'rentoramobility@gmail.com',
  phone: '+91 9958021329',
  phoneDisplay: '+91 99580 21329',
  whatsapp: '919958021329',
  whatsappDisplay: '+91 99580 21329',
  country: 'India',
  url: 'https://rentoramobility.in',
  rating: 4.9,
  reviewCount: '50,000+',
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink(): string {
  return `tel:${CONTACT.phone.replace(/\s/g, '')}`;
}
