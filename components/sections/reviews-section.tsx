"use client";

import * as React from "react";
import { Star, Quote, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewForm } from "@/components/sections/review-form";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  vehicle: string | null;
  service_type: string | null;
  location: string | null;
  created_at: string;
}

export function ReviewsSection() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [averageRating, setAverageRating] = React.useState(0);
  const [totalReviews, setTotalReviews] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews?limit=10");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      } else {
        setError(data.error || "Unable to load reviews.");
      }
    } catch {
      setError("Unable to load reviews at this time.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < rating ? "text-gold fill-gold" : "text-muted-foreground/30")} />
      ))}
    </div>
  );

  return (
    <section className="section-pad bg-card/30">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Customer Reviews"
          title="What Our Clients Say"
          subtitle="Trusted by clients who choose Rentora Mobility for their journeys."
        />

        {/* Average Rating */}
        {!loading && totalReviews > 0 && (
          <div className="flex items-center justify-center gap-3 mt-8 mb-10">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={cn("h-6 w-6", i < Math.round(averageRating) ? "text-gold fill-gold" : "text-muted-foreground/30")} />
              ))}
            </div>
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({totalReviews} review{totalReviews !== 1 ? "s" : ""})</span>
          </div>
        )}

        {/* Reviews Grid / Loading / Error / Empty */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-sans text-lg font-semibold mb-2">Reviews Currently Unavailable</h3>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 border border-border/50 hover:border-gold/30 transition-colors luxury-card">
                <Quote className="h-8 w-8 text-gold/30 mb-3" />
                <p className="text-sm text-foreground leading-relaxed mb-4">{review.review_text}</p>
                <div className="flex items-center justify-between mb-3">
                  {renderStars(review.rating)}
                  <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="font-medium text-sm">{review.customer_name}</div>
                  {(review.vehicle || review.service_type || review.location) && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {[review.vehicle, review.service_type, review.location].filter(Boolean).join(" • ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-sans text-lg font-semibold mb-2">Be the First to Review</h3>
            <p className="text-muted-foreground text-sm mb-6">Share your Rentora Mobility experience with others.</p>
          </div>
        )}

        {/* Write a Review CTA */}
        <div className="text-center mt-10">
          <Button onClick={() => setShowForm(true)} className="btn-gold rounded-full px-8 h-12">
            <MessageSquare className="h-4 w-4 mr-2" /> Write a Review
          </Button>
        </div>
      </div>

      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
