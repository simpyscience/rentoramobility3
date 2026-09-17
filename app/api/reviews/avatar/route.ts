import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const AVATAR_BUCKET = "review-avatars";
// Input ceiling: large enough for a normal phone/camera photo. The customer
// never sees this number — the form resizes/compesses the image client-side
// before upload, so typical uploads are tiny. This is just a safety backstop.
const MAX_AVATAR_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function detectMime(buf: Buffer): string | null {
  // JPEG: FF D8 FF
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png";
  }
  // WebP: "RIFF" + (size, 4 bytes ignored) + "WEBP"
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

const BUCKET_OPTIONS = {
  public: true,
  allowedMimeTypes: ALLOWED_MIME,
  fileSizeLimit: MAX_AVATAR_BYTES,
} as const;

async function ensureBucket(): Promise<void> {
  // Create if missing...
  try {
    await supabaseAdmin.storage.createBucket(AVATAR_BUCKET, BUCKET_OPTIONS);
  } catch {
    // Bucket already exists (createBucket errors on duplicate) — fall through.
  }
  // ...then (re)assert the desired config on the *existing* bucket.
  // createBucket does NOT mutate an existing bucket, so an older bucket that
  // was created with a stricter 2 MB limit is upgraded to the 10 MB ceiling
  // here. service_role bypasses RLS, so this is permitted.
  try {
    await supabaseAdmin.storage.updateBucket(AVATAR_BUCKET, {
      public: BUCKET_OPTIONS.public,
      allowedMimeTypes: BUCKET_OPTIONS.allowedMimeTypes,
      fileSizeLimit: BUCKET_OPTIONS.fileSizeLimit,
    });
  } catch (updateErr) {
    console.error(
      "Could not update avatar bucket config:",
      (updateErr as Error)?.message
    );
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, error: "No image provided." }, { status: 400 });
    }

    if (file.size > MAX_AVATAR_BYTES) {
      return NextResponse.json({ success: false, error: "That photo is too large. Please choose a smaller image." }, { status: 400 });
    }

    // Validate declared MIME type first (cheap), then verify magic bytes (spoof-proof).
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported format. Use JPEG, PNG or WebP." },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const detected = detectMime(buf);
    if (!detected) {
      return NextResponse.json(
        { success: false, error: "File content does not match an allowed image type." },
        { status: 400 }
      );
    }

    await ensureBucket();

    // Safe, generated filename — never trust the user-provided name.
    const safeName = `${randomUUID()}.${MIME_TO_EXT[detected]}`;

    const { data, error } = await supabaseAdmin.storage
      .from(AVATAR_BUCKET)
      .upload(safeName, buf, { contentType: detected, upsert: false });

    if (error) {
      console.error("Avatar upload error:", error.message);
      return NextResponse.json({ success: false, error: "Unable to upload your photo." }, { status: 500 });
    }

    const { data: publicUrl } = supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      avatar_url: publicUrl?.publicUrl,
    });
  } catch (err) {
    console.error("Avatar upload exception:", err);
    return NextResponse.json({ success: false, error: "Unable to upload your photo." }, { status: 500 });
  }
}
