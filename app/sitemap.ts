import { MetadataRoute } from 'next';
import { CARS } from '@/lib/data/cars';
import { SERVICES, BLOG_POSTS } from '@/lib/data/site';

const SITE_URL = 'https://rentoramobility.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '', '/fleet', '/services', '/about', '/blog', '/contact',
    '/privacy-policy', '/terms', '/refund-policy', '/cancellation-policy',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const carRoutes = CARS.map((car) => ({
    url: `${SITE_URL}/fleet/${car.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const serviceRoutes = SERVICES.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...carRoutes, ...serviceRoutes, ...blogRoutes];
}
