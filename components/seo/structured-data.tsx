const SITE_URL = 'https://rentoramobility.in';

export { SITE_URL };

export function StructuredData() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rentora Mobility',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/rentora-mobility-logo.png`,
    email: 'rentoramobility@protonmail.com',
    telephone: '+91 9958021329',
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

  // LocalBusiness — appropriate for a car-rental business with a physical address.
  // Static (no customer data), safe to render server-side.
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Rentora Mobility',
    image: `${SITE_URL}/brand/rentora-mobility-logo.png`,
    url: SITE_URL,
    telephone: '+91 9958021329',
    email: 'rentoramobility@protonmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '52, 1st Floor, Union Bank, Wazirabad',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122003',
      addressCountry: 'IN',
    },
    areaServed: 'India',
    priceCurrency: 'INR',
    priceRange: '₹₹',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
