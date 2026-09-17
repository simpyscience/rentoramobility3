import type { Metadata } from "next";
import { ReviewsPageClient } from "@/components/reviews/reviews-page-client";
import { getPublicReviews } from "@/lib/reviews.server";
import type { PublicReview } from "@/lib/reviews";

// Always render on-demand: reviews must be fresh so a newly submitted review
// (auto-published) is visible immediately. Avoids executing the Supabase
// server import at build time (env is available at request time, like the
// existing /api/reviews route).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rentora Mobility Reviews | What Our Clients Say",
  description:
    "Read genuine customer experiences and reviews of Rentora Mobility's chauffeur-driven car rental services in Gurugram and beyond.",
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: "Rentora Mobility Reviews | What Our Clients Say",
    description:
      "Read genuine customer experiences and reviews of Rentora Mobility's chauffeur-driven car rental services in Gurugram and beyond.",
    url: "https://rentoramobility.in/reviews",
    type: "website",
    locale: "en_IN",
    siteName: "Rentora Mobility",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentora Mobility Reviews | What Our Clients Say",
    description:
      "Read genuine customer experiences and reviews of Rentora Mobility's chauffeur-driven car rental services in Gurugram and beyond.",
  },
};

function buildReviewSchema(
  reviews: PublicReview[],
  averageRating: number,
  totalReviews: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rentora Mobility",
    url: "https://rentoramobility.in",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(averageRating),
      ratingCount: String(totalReviews),
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 8).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewBody: r.review,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      datePublished: r.created_at ? r.created_at.slice(0, 10) : undefined,
    })),
  };
}

export default async function ReviewsPage() {
  const { reviews, averageRating, totalReviews, error } =
    await getPublicReviews(100);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildReviewSchema(reviews, averageRating, totalReviews)
          ),
        }}
      />
      <ReviewsPageClient
        initial={{ reviews, averageRating, totalReviews, error }}
      />
    </>
  );
}
