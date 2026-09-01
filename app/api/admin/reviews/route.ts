import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { NextRequest } from "next/server";

const ALLOWED_STATUSES = ["pending", "approved", "rejected"] as const;

function requireAuth(request: NextRequest): { ok: boolean; response?: NextResponse } {
  const cookie = request.cookies.get("admin_session");
  if (cookie?.value !== "authenticated") {
    return { ok: false, response: NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 }) };
  }
  return { ok: true };
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response!;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  try {
    let query = supabaseAdmin.from("reviews").select("*").order("created_at", { ascending: false });

    if (status && ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.limit(200);

    if (error) {
      console.error("Admin reviews fetch error:", error);
      return NextResponse.json({ success: false, error: "Unable to fetch reviews." }, { status: 500 });
    }

    return NextResponse.json({ success: true, reviews: data || [] });
  } catch (error) {
    console.error("Admin reviews API error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
  }
}
