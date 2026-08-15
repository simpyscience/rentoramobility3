const SITE_URL = 'https://rentoramobility.in';

export function StructuredData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rentora Mobility',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/rentora-mobility-logo.png`,
    email: 'rentoramobility@protonmail.com',
    telephone: '+91 9958021329',
    additionalTelephone: '+91 7291973553',
    areaServed: 'India',
    slogan: 'Premium Mobility. Trusted Journeys.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '52, 1st Floor, Union Bank, Wazirabad',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122003',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://in.linkedin.com/in/rentora-mobility-a1040b428',
      'https://x.com/rentoramobilit',
      'https://www.facebook.com/profile.php?id=61588481046703',
    ],
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
