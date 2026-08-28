import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/book/',
        '/login',
        '/signup',
        '/dashboard',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: 'https://rentoramobility.in/sitemap.xml',
    host: 'https://rentoramobility.in',
  };
}
