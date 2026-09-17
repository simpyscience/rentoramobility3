"use client";

import * as React from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ReviewForm } from "@/components/sections/review-form";
import { PublicReview, getInitials, formatReviewDate } from "@/lib/reviews";
import { cn } from "@/lib/utils";

const SITE_URL = "https://rentoramobility.in";

interface ReviewsState {
  reviews: PublicReview[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewsSection() {
  const [data, setData] = React.useState<ReviewsState | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const fetchReviews = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews?limit=12", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setData({
          reviews: json.reviews,
          averageRating: json.averageRating,
          totalReviews: json.totalReviews,
        });
        setError(null);
      } else {
        setError(json.error || "Unable to load reviews.");
      }
    } catch {
      setError("Unable to load reviews at this time.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Inject Review + AggregateRating structured data (real data only).
  React.useEffect(() => {
    if (!data || data.totalReviews === 0) return;
    const script = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Rentora Mobility",
      url: SITE_URL,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: String(data.averageRating),
        ratingCount: String(data.totalReviews),
        bestRating: 5,
        worstRating: 1,
      },
      review: data.reviews.slice(0, 8).map((r) => ({
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

    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(script);
    tag.setAttribute("data-rentora-reviews", "true");
    document.head.appendChild(tag);
    return () => {
      document.head.removeChild(tag);
    };
  }, [data]);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < rating ? "text-gold fill-gold" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  );

  const openForm = () => setShowForm(true);

  return (
    <section className="section-pad bg-card/30">
      <div className="container-lux">
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Trusted by clients who choose Rentora Mobility for a premium travel experience."
          center
        />

        {/* Average rating (real, computed from the database) */}
        {!loading && data && data.totalReviews > 0 && (
          <div className="flex items-center justify-center gap-3 mt-8 mb-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < Math.round(data.averageRating)
                      ? "text-gold fill-gold"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{data.averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({data.totalReviews} review{data.totalReviews !== 1 ? "s" : ""})
            </span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : error ? (
          <div className="text-center py-14">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-sans text-lg font-semibold mb-2">Reviews Currently Unavailable</h3>
            <p className="text-muted-foreground text-sm">{error}</p>
            <button
              onClick={fetchReviews}
              className="mt-4 rounded-xl border border-gold/30 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/10"
            >
              Try again
            </button>
          </div>
        ) : data && data.reviews.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {data.reviews.map((review) => (
                <article
                  key={review.id}
                  className="luxury-card p-6 flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow">
                      {review.avatar_url ? (
                        <AvatarImage src={review.avatar_url} alt={review.name} loading="lazy" />
                      ) : null}
                      <AvatarFallback className="bg-gold/10 text-gold font-semibold">
                        {getInitials(review.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm leading-tight">{review.name}</p>
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <blockquote className="mt-1 text-sm text-foreground leading-relaxed flex-1">
                    {review.review}
                  </blockquote>

                  <time
                    dateTime={review.created_at}
                    className="mt-4 text-xs text-muted-foreground"
                  >
                    {formatReviewDate(review.created_at)}
                  </time>
                </article>
              ))}
            </div>
          </>
        ) : (
          // Empty state (zero public reviews)
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-sans text-lg font-semibold mb-2">
              Be the first to share your experience.
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Help fellow travelers choose Rentora Mobility by sharing your journey.
            </p>
            <Button onClick={openForm} className="btn-gold rounded-full px-8 h-12">
              <MessageSquare className="h-4 w-4 mr-2" /> Write a Review
            </Button>
          </div>
        )}

        {/* Floating write-review CTA (always available) */}
        {data && data.reviews.length > 0 && (
          <div className="text-center mt-12">
            <Button onClick={openForm} className="btn-gold rounded-full px-8 h-12">
              <MessageSquare className="h-4 w-4 mr-2" /> Write a Review
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <ReviewForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchReviews();
            // Let the customer read the thank-you message, then close + reveal the new review.
            setTimeout(() => setShowForm(false), 1500);
          }}
        />
      )}
    </section>
  );
}
