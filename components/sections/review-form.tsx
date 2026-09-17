"use client";

import * as React from "react";
import { X, Star, CheckCircle2, AlertCircle, Loader2, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/reviews";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_REVIEW_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export function ReviewForm({ onClose, onSuccess }: ReviewFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [review, setReview] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Please enter your name.";
    else if (name.trim().length > MAX_NAME_LENGTH) newErrors.name = "Name is too long.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (rating < 1 || rating > 5) newErrors.rating = "Please select a rating.";
    if (!review.trim()) newErrors.review = "Please write your review.";
    else if (review.trim().length > MAX_REVIEW_LENGTH) newErrors.review = "Review must be under 2000 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleUpload(file: File) {
    if (file.size > MAX_AVATAR_BYTES) {
      setErrors((e) => ({ ...e, avatar: "Image must be 2 MB or smaller." }));
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((e) => ({ ...e, avatar: "Use JPEG, PNG or WebP only." }));
      return;
    }
    setUploading(true);
    setErrors((e) => {
      const { avatar: _, ...rest } = e;
      return rest;
    });
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/reviews/avatar", { method: "POST", body: form });
      const data = await res.json();
      if (data.success && data.avatar_url) {
        setAvatarUrl(data.avatar_url);
        setAvatarFile(file);
      } else {
        setErrors((e) => ({ ...e, avatar: data.error || "Could not upload photo." }));
      }
    } catch {
      setErrors((e) => ({ ...e, avatar: "Network error uploading photo." }));
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (submitting) return; // guard against double-submit

    setSubmitting(true);
    setErrors((e) => {
      const { submit, ...rest } = e;
      return rest;
    });

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          rating,
          review: review.trim(),
          avatar_url: avatarUrl,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        onSuccess?.();
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
        <div className="bg-white dark:bg-card rounded-2xl p-8 max-w-md w-full text-center luxury-card">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-gold/10 text-gold mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-sans text-xl font-semibold mb-2">Thank You</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for sharing your experience with Rentora Mobility.
          </p>
          <Button onClick={onClose} className="btn-gold rounded-xl w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-card rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto luxury-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-sans text-xl font-semibold">Write a Review</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
            aria-label="Close"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              maxLength={MAX_NAME_LENGTH}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email (optional) */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email Address (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Used only for your avatar lookup. Never shared publicly.
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Rating *</label>
            <StarRating rating={rating} interactive onChange={setRating} size="lg" />
            {errors.rating && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.rating}
              </p>
            )}
          </div>

          {/* Review text */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Your Review *</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your Rentora Mobility experience..."
              rows={4}
              maxLength={MAX_REVIEW_LENGTH}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.review && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.review}
                </p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">{review.length}/{MAX_REVIEW_LENGTH}</p>
            </div>
          </div>

          {/* Profile photo (optional) */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Profile Photo (optional)</label>
            <p className="text-xs text-muted-foreground mb-2">
              JPEG, PNG or WebP — up to 2 MB. If you skip this, we will use your
              Gravatar or an initials-based avatar.
            </p>
            {avatarUrl ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border border-border">
                  <AvatarImage src={avatarUrl} alt={name || "your photo"} />
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl(null);
                    setAvatarFile(null);
                  }}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            ) : (
              <label className="flex h-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                    e.target.value = "";
                  }}
                />
                <Upload className="h-5 w-5 mr-2" />
                Upload a photo
              </label>
            )}
            {uploading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
              </div>
            )}
            {errors.avatar && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.avatar}
              </p>
            )}
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.submit}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || uploading} className="btn-gold flex-1 rounded-xl">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
