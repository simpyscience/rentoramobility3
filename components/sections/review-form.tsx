"use client";

import * as React from "react";
import { X, Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { CITIES } from "@/lib/data/site";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  onClose: () => void;
}

export function ReviewForm({ onClose }: ReviewFormProps) {
  const [customerName, setCustomerName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [reviewText, setReviewText] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [serviceType, setServiceType] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email.";
    if (rating < 1 || rating > 5) newErrors.rating = "Please select a rating.";
    if (!reviewText.trim()) newErrors.reviewText = "Please write your review.";
    if (reviewText.trim().length > 2000) newErrors.reviewText = "Review must be under 2000 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          email: email.trim().toLowerCase(),
          rating,
          review_text: reviewText.trim(),
          vehicle: vehicle || undefined,
          service_type: serviceType || undefined,
          location: location || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setErrors({ submit: data.error || "Submission failed. Please try again." });
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-sans text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-6">Your review has been submitted and is pending approval.</p>
          <Button onClick={onClose} className="btn-gold rounded-xl">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-sans text-xl font-semibold">Write a Review</h3>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            {errors.customerName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.customerName}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Rating *</label>
            <StarRating rating={rating} interactive onChange={setRating} size="lg" />
            {errors.rating && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.rating}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Your Experience *</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with Rentora Mobility..."
              rows={4}
              maxLength={2000}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.reviewText && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.reviewText}</p>}
              <p className="text-xs text-muted-foreground ml-auto">{reviewText.length}/2000</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Vehicle Used</label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                placeholder="e.g. Toyota Innova Crysta"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              >
                <option value="">Select</option>
                <option value="chauffeur">Chauffeur-driven</option>
                <option value="self-drive">Self-drive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            >
              <option value="">Select city</option>
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {errors.submit && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />{errors.submit}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={submitting} className="btn-gold flex-1 rounded-xl">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
