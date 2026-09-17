"use client";

import * as React from "react";
import { X, CheckCircle2, AlertCircle, Loader2, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/reviews";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  mode?: "modal" | "inline";
  onClose?: () => void;
  onSuccess?: () => void;
}

const MAX_REVIEW_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const AVATAR_MAX = 256;
const MAX_INPUT_BYTES = 10 * 1024 * 1024; // 10 MB input safety net (handled server-side too)

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function optimizeAvatar(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > AVATAR_MAX || height > AVATAR_MAX) {
        if (width >= height) {
          height = Math.round((height * AVATAR_MAX) / width);
          width = AVATAR_MAX;
        } else {
          width = Math.round((width * AVATAR_MAX) / height);
          height = AVATAR_MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not process image."));
        return;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) / 2 - 0.5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      ctx.restore();
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (blob) resolve(blob);
          else reject(new Error("Could not process image."));
        },
        "image/webp",
        0.88
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image."));
    };
    img.src = objectUrl;
  });
}

export function ReviewForm({ mode = "modal", onClose, onSuccess }: ReviewFormProps) {
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
    if (!email.trim()) newErrors.email = "Please enter your email address.";
    else if (!isValidEmail(email.trim())) newErrors.email = "Please enter a valid email address.";
    if (rating < 1 || rating > 5) newErrors.rating = "Please select a rating.";
    if (!review.trim()) newErrors.review = "Please write your review.";
    else if (review.trim().length > MAX_REVIEW_LENGTH)
      newErrors.review = "Review must be under 2000 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleUpload(file: File) {
    if (file.size > MAX_INPUT_BYTES) {
      setErrors((e) => ({ ...e, avatar: "That photo is too large. Please choose a smaller image." }));
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((e) => ({ ...e, avatar: "Use a JPEG, PNG or WebP photo." }));
      return;
    }
    setUploading(true);
    setErrors((e) => {
      const { avatar: _, ...rest } = e;
      return rest;
    });
    try {
      const optimizedBlob = await optimizeAvatar(file);
      const optimizedFile = new File(
        [optimizedBlob],
        file.name.replace(/\.[^.]+$/, ".webp"),
        { type: "image/webp" }
      );
      const form = new FormData();
      form.append("file", optimizedFile);
      const res = await fetch("/api/reviews/avatar", { method: "POST", body: form });
      const data = await res.json();
      if (data.success && data.avatar_url) {
        setAvatarUrl(data.avatar_url);
        setAvatarFile(optimizedFile);
      } else {
        setErrors((e) => ({ ...e, avatar: data.error || "Could not upload photo." }));
      }
    } catch {
      setErrors((e) => ({ ...e, avatar: "Could not process that image. Try another photo." }));
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (submitting) return;

    setSubmitting(true);
    setErrors((e) => {
      const { submit: _, ...rest } = e;
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

  const formContent = (
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

      {/* Email (required) */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.email}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Required. Used only for your avatar &amp; Gravatar. Never shared publicly.
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
          JPEG, PNG or WebP. We resize and optimize it for you — no size limit you need to worry about.
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
            <Loader2 className="h-3 w-3 animate-spin" /> Optimizing and uploading...
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
        {mode === "modal" ? (
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl" disabled={submitting}>
            Cancel
          </Button>
        ) : null}
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
  );

  if (success) {
    if (mode === "inline") {
      return (
        <div className="luxury-card p-8 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-gold/10 text-gold mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Thank You</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for sharing your experience with Rentora Mobility.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            className="rounded-full"
          >
            Write another review
          </Button>
        </div>
      );
    }

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

  if (mode === "inline") {
    const header = (
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Write a Review</h2>
      </div>
    );
    return (
      <div className="mx-auto max-w-2xl">
        {header}
        <div className="luxury-card p-6 md:p-8">{formContent}</div>
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
        {formContent}
      </div>
    </div>
  );
}
