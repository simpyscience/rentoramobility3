"use client";

import * as React from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewAvatar } from "@/components/reviews/review-avatar";
import { ReviewForm } from "@/components/sections/review-form";
import { PublicReview, formatReviewDate } from "@/lib/reviews";
import { cn } from "@/lib/utils";

interface ReviewsInitialState {
  reviews: PublicReview[];
  averageRating: number;
  totalReviews: number;
  error: string | null;
}

export function ReviewsPageClient({
  initial,
}: {
  initial: ReviewsInitialState;
}) {
  const [reviews, setReviews] = React.useState<PublicReview[]>(initial.reviews);
  const [averageRating, setAverageRating] = React.useState(
    initial.averageRating
  );
  const [totalReviews, setTotalReviews] = React.useState(initial.totalReviews);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(initial.error);
  const [showForm, setShowForm] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews?limit=100", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setReviews(json.reviews);
        setAverageRating(json.averageRating);
        setTotalReviews(json.totalReviews);
      } else {
        setError(json.error || "Unable to load reviews.");
      }
    } catch {
      setError("Unable to load reviews at this time.");
    } finally {
      setLoading(false);
    }
  }, []);

  const openForm = () => {
    setShowForm(true);
    const el = document.getElementById("write-review");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const rounded = Math.round(averageRating);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="text-center py-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            What Our Clients Say
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by clients who choose Rentora Mobility for a premium travel
            experience.
          </p>
        </section>

        {/* Rating summary (real, computed from the database) */}
        {totalReviews > 0 ? (
          <div className="flex flex-col items-center gap-3 mb-12">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-6 w-6",
                    i < rounded
                      ? "text-gold fill-gold"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <div className="text-3xl md:text-4xl font-bold">
              {averageRating.toFixed(1)} ★
            </div>
            <div className="text-sm text-muted-foreground">
              ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
            </div>
          </div>
        ) : null}

        {/* Write a Review CTA */}
        <div className="text-center mb-10">
          <Button
            onClick={openForm}
            className="btn-gold rounded-full px-8 h-12 text-base"
            disabled={loading}
          >
            <MessageSquare className="h-5 w-5 mr-2" /> Write a Review
          </Button>
        </div>

        {/* Reviews list */}
        {loading && reviews.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : error && reviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-sans text-lg font-semibold mb-2">
              Reviews Currently Unavailable
            </h3>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <Button
              onClick={refresh}
              variant="outline"
              className="rounded-full"
            >
              Try again
            </Button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-sans text-lg font-semibold mb-2">
              Be the first to share your experience.
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Help fellow travelers choose Rentora Mobility by sharing your
              journey.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="luxury-card p-6 flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <ReviewAvatar review={review} />
                  <div>
                    <p className="font-semibold text-sm leading-tight">
                      {review.name}
                    </p>
                    <StarRating rating={review.rating} size="sm" />
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
        )}

        {/* Write a Review form (revealed inline) */}
        <div id="write-review" className="mx-auto max-w-2xl">
          {showForm ? (
            <ReviewForm
              mode="inline"
              onSuccess={() => {
                refresh();
              }}
            />
          ) : (
            <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Click the Write a Review button above to share your experience.
            </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
