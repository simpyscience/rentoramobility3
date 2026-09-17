-- Rentora Mobility — Customer Reviews: fix submission & auto-publish
--
-- ROOT CAUSE OF "reviews could not be submitted / never appeared":
--   The `reviews` table was missing privileges for the server-side `service_role`.
--   The API routes use `supabaseAdmin` (service_role), so every
--   `from('reviews').insert()` / `.select()` failed with:
--       permission denied for table reviews   (PostgreSQL 42501)
--   Unlike `cars`/`bookings` (see migrations 001 & 002 which explicitly GRANT to
--   service_role), the reviews table never received those grants, so submissions
--   silently 500'd and reviews never loaded.
--
--   Additionally:
--     * new reviews were inserted as status='pending' but GET only returned
--       status='approved'  -> reviews never became public (manual approval gap)
--     * `email` was NOT NULL, blocking the new optional-email form
--     * there was no avatar column guarantee on every copy of the table
--
-- Run in the Supabase SQL Editor (or `supabase db push`).
-- All statements are idempotent (safe to re-run).

-- 1. Ensure the avatar column exists on every copy of the table.
--    Migration 003 already created `customer_avatar`; this is a defensive no-op
--    that also covers partial deployments. The API layer reads/writes the
--    `customer_avatar` column directly.
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS customer_avatar TEXT;

-- 2. Make email nullable: the simplified form collects it optionally.
--    (Existing email values are preserved; existing rows keep their data.)
ALTER TABLE public.reviews
  ALTER COLUMN email DROP NOT NULL;

-- 3. Preserve legacy columns that existing data depends on. (No-op if present.)
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS vehicle      TEXT;
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS location     TEXT;
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS status       TEXT NOT NULL DEFAULT 'approved'
                                       CHECK (status IN ('pending','approved','rejected'));
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS admin_note   TEXT;
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS approved_at  TIMESTAMPTZ;

-- 4. Auto-publish: any future row defaults to 'approved' (immediately public),
--    eliminating the manual pending->approved step for new reviews.
ALTER TABLE public.reviews
  ALTER COLUMN status SET DEFAULT 'approved';

-- 5. Replace the legacy RLS policies.
--    SECURITY: anonymous clients must NOT read reviews directly, because that
--    would expose customer email / vehicle / service_type / location.
--    All public access is mediated by /api/reviews, which uses service_role
--    (bypasses RLS) and strips every private field from the response.
DROP POLICY IF EXISTS "Allow public insert"       ON public.reviews;
DROP POLICY IF EXISTS "Allow public read approved" ON public.reviews;

-- 6. Root-cause fix: grant the server-side service_role full access to reviews,
--    mirroring migration 002 (`GRANT UPDATE ON public.bookings TO service_role`).
GRANT ALL ON public.reviews TO service_role;
-- Ensure the role can resolve the table (idempotent; normally already present).
GRANT USAGE ON SCHEMA public TO service_role;
