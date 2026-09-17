import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  PublicReview,
  MAX_NAME_LENGTH,
  MAX_REVIEW_LENGTH,
  MAX_EMAIL_LENGTH,
  RATING_MIN,
  RATING_MAX,
} from "@/lib/reviews";

const DEDUPE_WINDOW_MIN = 5;
const AVATAR_URL_RE = /^\/storage\/v1\/object\/public\/review-avatars\/.+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= MAX_EMAIL_LENGTH;
}

function gravatarUrl(email: string): string {
  const normalized = email.trim().toLowerCase();
  const hash = crypto.createHash("md5").update(normalized).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=96`;
}

function isValidAvatarUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return (
      u.hostname.endsWith(".supabase.co") &&
      AVATAR_URL_RE.test(u.pathname)
    );
  } catch {
    return false;
  }
}

function toPublic(row: {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  customer_avatar: string | null;
  email: string | null;
  created_at: string;
}): PublicReview {
  // Email is intentionally NOT returned. It is only used server-side
  // to derive a Gravatar hash (which exposes no raw email address).
  const avatar = row.customer_avatar || (row.email ? gravatarUrl(row.email) : null) || null;
  return {
    id: row.id,
    name: row.customer_name,
    rating: row.rating,
    review: row.review_text,
    avatar_url: avatar,
    created_at: row.created_at,
  };
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
  if (emailRaw !== "") {
    if (!isValidEmail(emailRaw.trim().toLowerCase())) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }
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

  const cleanEmail = emailRaw.trim().toLowerCase() || null;
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
    // Match email exactly (NULL when email is optional and not provided).
    if (cleanEmail) {
      dedupeQuery = dedupeQuery.eq("email", cleanEmail);
    } else {
      dedupeQuery = dedupeQuery.is("email", null);
    }

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

  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("id,customer_name,rating,review_text,customer_avatar,email,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Reviews fetch error:", error.message);
      return NextResponse.json({ success: false, error: "Unable to load reviews." }, { status: 500 });
    }

    const reviews = (data || []).map(toPublic);
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

    return NextResponse.json({
      success: true,
      reviews,
      averageRating: Math.round(average * 10) / 10,
      totalReviews: total,
    });
  } catch (err) {
    console.error("Reviews fetch exception:", err);
    return NextResponse.json({ success: false, error: "Unable to load reviews." }, { status: 500 });
  }
}
