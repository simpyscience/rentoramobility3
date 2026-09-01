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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response!;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { status, admin_note } = body;

  if (!status || !ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { status };
  if (status === "approved") {
    updateData.approved_at = new Date().toISOString();
  }
  if (typeof admin_note === "string") {
    updateData.admin_note = admin_note.trim().slice(0, 500);
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .update(updateData)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error("Review update error:", error);
    return NextResponse.json({ success: false, error: "Unable to update review." }, { status: 500 });
  }

  return NextResponse.json({ success: true, review: data });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response!;

  const { error } = await supabaseAdmin
    .from("reviews")
    .delete()
    .eq("id", params.id);

  if (error) {
    console.error("Review delete error:", error);
    return NextResponse.json({ success: false, error: "Unable to delete review." }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Review deleted." });
}
