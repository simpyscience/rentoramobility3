import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "supabaseUrl is required. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL for the server-side admin client."
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required for the server-side admin client."
  );
}

// Safe diagnostic: log key type without revealing value
const keyType = serviceRoleKey.startsWith("sb_secret_")
  ? "secret"
  : serviceRoleKey.startsWith("sb_publishable_")
  ? "publishable"
  : "unknown";
console.log(`[supabaseAdmin] URL: ${supabaseUrl}, Key type: ${keyType}, Key length: ${serviceRoleKey.length}`);

if (keyType !== "secret") {
  console.error("[supabaseAdmin] WARNING: SUPABASE_SERVICE_ROLE_KEY should be the Secret key (sb_secret_...), not Publishable key");
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);