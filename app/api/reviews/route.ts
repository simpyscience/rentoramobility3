import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_REVIEW_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_LOCATION_LENGTH = 100;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { customer_name, email, rating, review_text, vehicle, service_type, location } = body;

  // Validate required fields
  if (!isNonEmptyString(customer_name)) {
    return NextResponse.json(
      { success: false, error: "Please enter your name." },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json(
      { success: false, error: "Please select a rating between 1 and 5." },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(review_text)) {
    return NextResponse.json(
      { success: false, error: "Please write your review." },
      { status: 400 }
    );
  }

  // Sanitize inputs
  const cleanName = sanitizeString(customer_name, MAX_NAME_LENGTH);
  const cleanEmail = email.trim().toLowerCase();
  const cleanReview = sanitizeString(review_text, MAX_REVIEW_LENGTH);
  const cleanVehicle = isNonEmptyString(vehicle) ? sanitizeString(vehicle, 100) : null;
  const cleanServiceType = isNonEmptyString(service_type) ? sanitizeString(service_type, 50) : null;
  const cleanLocation = isNonEmptyString(location) ? sanitizeString(location, MAX_LOCATION_LENGTH) : null;

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .insert({
      customer_name: cleanName,
      email: cleanEmail,
      rating,
      review_text: cleanReview,
      vehicle: cleanVehicle,
      service_type: cleanServiceType,
      location: cleanLocation,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to submit review. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Thank you! Your review has been submitted and is pending approval.",
    review: data,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, customer_name, rating, review_text, vehicle, service_type, location, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to fetch reviews." },
      { status: 500 }
    );
  }

  // Calculate average rating
  const { data: avgData } = await supabaseAdmin
    .from("reviews")
    .select("rating")
    .eq("status", "approved");

  const avgRating = avgData && avgData.length > 0
    ? avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length
    : 0;

  return NextResponse.json({
    success: true,
    reviews: data || [],
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews: avgData?.length || 0,
  });
}
