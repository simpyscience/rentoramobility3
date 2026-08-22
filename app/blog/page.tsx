import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/data/blog';
import { BlogListing } from '@/components/blog/blog-listing';

export const metadata: Metadata = {
  title: 'Rentora Mobility Journal | Travel & Car Rental Guides',
  description:
    'Practical, trustworthy articles from Rentora Mobility — car rental guides, road trip planning and reliable employee transportation advice for better journeys.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Rentora Mobility Journal',
    description:
      'Car rental guides, travel tips and corporate mobility advice from Rentora Mobility.',
    url: 'https://rentoramobility.in/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();
  return <BlogListing posts={posts} />;
}
