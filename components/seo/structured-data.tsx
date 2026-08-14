interface Props {
  cars?: boolean;
}

export function StructuredData({ cars = false }: Props) {
  const SITE_URL = 'https://rentoramobility.in';

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rentora Mobility',
    url: SITE_URL,
    email: 'rentoramobility@protonmail.com',
    telephone: '+91 9958021329',
    additionalTelephone: '+91 7291973553',
    areaServed: 'India',
    slogan: 'Premium Mobility. Trusted Journeys.',
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rentora Mobility',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/fleet?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'Rentora Mobility',
    image: `${SITE_URL}/og-image.jpg`,
    url: SITE_URL,
    telephone: '+91 9958021329',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    areaServed: 'India',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </>
  );
}
