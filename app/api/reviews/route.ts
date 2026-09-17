import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  MAX_NAME_LENGTH,
  MAX_REVIEW_LENGTH,
  MAX_EMAIL_LENGTH,
  RATING_MIN,
  RATING_MAX,
} from "@/lib/reviews";
import { getPublicReviews, isValidAvatarUrl, toPublic } from "@/lib/reviews.server";

const DEDUPE_WINDOW_MIN = 5;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= MAX_EMAIL_LENGTH;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const rawName = body.name ?? body.customer_name;
  const name = isNonEmptyString(rawName) ? (rawName as string).trim().slice(0, MAX_NAME_LENGTH) : "";
  const emailRaw = body.email == null ? "" : String(body.email);
  const rating = body.rating;
  const rawReview = body.review ?? body.review_text;
  const review = isNonEmptyString(rawReview) ? (rawReview as string).trim().slice(0, MAX_REVIEW_LENGTH) : "";
  const avatarRaw = body.avatar_url == null ? "" : String(body.avatar_url);

  if (!name) {
    return NextResponse.json({ success: false, error: "Please enter your name." }, { status: 400 });
  }
  if (name.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ success: false, error: "Name is too long." }, { status: 400 });
  }
  const emailTrimmed = emailRaw.trim().toLowerCase();
  if (!emailTrimmed) {
    return NextResponse.json(
      { success: false, error: "Please enter your email address." },
      { status: 400 }
    );
  }
  if (!isValidEmail(emailTrimmed)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < RATING_MIN || rating > RATING_MAX) {
    return NextResponse.json({ success: false, error: "Please select a rating between 1 and 5." }, { status: 400 });
  }
  if (!review) {
    return NextResponse.json({ success: false, error: "Please write your review." }, { status: 400 });
  }
  if (review.length > MAX_REVIEW_LENGTH) {
    return NextResponse.json({ success: false, error: "Review is too long." }, { status: 400 });
  }

  const cleanEmail = emailTrimmed;
  const avatarUrl = avatarRaw && isValidAvatarUrl(avatarRaw) ? avatarRaw : null;
  const now = new Date().toISOString();

  const selectCols = "id,customer_name,rating,review_text,customer_avatar,email,created_at";

  try {
    // Anti-duplicate guard: if an identical review was just submitted (rapid
    // double-click / repeated submit), return the existing one instead of
    // creating a second record.
    const windowAgo = new Date(Date.now() - DEDUPE_WINDOW_MIN * 60 * 1000).toISOString();
    let dedupeQuery = supabaseAdmin
      .from("reviews")
      .select(selectCols)
      .eq("customer_name", name)
      .eq("rating", rating)
      .eq("review_text", review)
       .gte("created_at", windowAgo)
      .order("created_at", { ascending: false })
      .limit(1);
    // Email is required on this form, so match it exactly (prevents duplicate
    // submissions of the same review within the dedupe window).
    dedupeQuery = dedupeQuery.eq("email", cleanEmail);

    const { data: existing, error: dupErr } = await dedupeQuery.maybeSingle();

    if (dupErr) {
      // Never expose DB internals; just log and continue to a fresh insert.
      console.error("Review dedupe lookup error:", dupErr.message);
    } else if (existing) {
      return NextResponse.json({
        success: true,
        message: "Thank you for sharing your experience with Rentora Mobility.",
        review: toPublic(existing),
      });
    }

    // Auto-publish: status is forced to 'approved' server-side so the review is
    // immediately public. The client cannot set the status.
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        customer_name: name,
        email: cleanEmail,
        rating,
        review_text: review,
        customer_avatar: avatarUrl,
        status: "approved",
        approved_at: now,
      })
      .select(selectCols)
      .single();

    if (error) {
      console.error("Review submission error:", error.message);
      return NextResponse.json(
        { success: false, error: "Unable to submit your review. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for sharing your experience with Rentora Mobility.",
      review: toPublic(data),
    });
  } catch (err) {
    console.error("Review submission exception:", err);
    return NextResponse.json(
      { success: false, error: "Unable to submit your review. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "12", 10)), 50);

  const { reviews, averageRating, totalReviews, error } =
    await getPublicReviews(limit);

  if (error) {
    return NextResponse.json(
      { success: false, error: "Unable to load reviews." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    reviews,
    averageRating,
    totalReviews,
  });
}
