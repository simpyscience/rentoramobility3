-- Rentora Mobility — Customer Reviews Table
--
-- Stores customer reviews with moderation workflow.
-- New reviews default to 'pending' and are only visible publicly
-- after admin approval.

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  vehicle TEXT,
  service_type TEXT,
  location TEXT,
  customer_avatar TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ
);

-- Index for fetching approved reviews quickly
CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews (created_at DESC);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can only insert (submit reviews)
CREATE POLICY "Allow public insert" ON reviews
  FOR INSERT WITH CHECK (status = 'pending');

-- Public can only read approved reviews
CREATE POLICY "Allow public read approved" ON reviews
  FOR SELECT USING (status = 'approved');

-- Service role bypasses RLS (already handled by supabaseAdmin client)
