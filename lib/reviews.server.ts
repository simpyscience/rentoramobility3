import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PublicReview } from "@/lib/reviews";

const AVATAR_URL_RE = /^\/storage\/v1\/object\/public\/review-avatars\/.+$/;

export interface ReviewsList {
  reviews: PublicReview[];
  averageRating: number;
  totalReviews: number;
  error: string | null;
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
      u.hostname.endsWith(".supabase.co") && AVATAR_URL_RE.test(u.pathname)
    );
  } catch {
    return false;
  }
}

interface RawReview {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  customer_avatar: string | null;
  email: string | null;
  created_at: string;
}

export function toPublic(row: RawReview): PublicReview {
  // Email is intentionally NOT returned. It is only used server-side to
  // derive a Gravatar hash (which exposes no raw email address).
  const avatar =
    row.customer_avatar ||
    (row.email ? gravatarUrl(row.email) : null) ||
    null;
  return {
    id: row.id,
    name: row.customer_name,
    rating: row.rating,
    review: row.review_text,
    avatar_url: avatar,
    created_at: row.created_at,
  };
}

export const MAX_REVIEWS_LIMIT = 100;

export async function getPublicReviews(
  limit = MAX_REVIEWS_LIMIT
): Promise<ReviewsList> {
  const safeLimit = Math.min(Math.max(1, Number(limit) || 50), MAX_REVIEWS_LIMIT);
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select(
        "id,customer_name,rating,review_text,customer_avatar,email,created_at"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(safeLimit);

    if (error) {
      console.error("Reviews fetch error:", error.message);
      return {
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        error: "Unable to load reviews.",
      };
    }

    const reviews = (data || []).map(toPublic);
    const total = reviews.length;
    const average =
      total > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    return {
      reviews,
      averageRating: Math.round(average * 10) / 10,
      totalReviews: total,
      error: null,
    };
  } catch (err) {
    console.error("Reviews fetch exception:", err);
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
      error: "Unable to load reviews.",
    };
  }
}

export { isValidAvatarUrl };
