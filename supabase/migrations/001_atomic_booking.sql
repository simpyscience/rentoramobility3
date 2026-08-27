-- Rentora Mobility — Inventory-aware atomic booking creation
--
-- This migration:
--   1. Adds inventory_count to the cars table (default 50).
--   2. Replaces the create_booking() RPC with inventory-aware logic.
--
-- Business rule: multiple physical vehicles share the same model name.
-- Overlapping bookings are allowed up to the inventory limit.
--
-- Example: Toyota Innova Crysta inventory_count = 50
--   -> Up to 50 overlapping active bookings allowed.
--   -> The 51st overlapping booking is rejected.
--
-- Concurrency: a PostgreSQL advisory transaction lock keyed on the model name
-- serializes concurrent bookings for the same model. The inventory count check
-- and insert happen inside the same locked transaction, preventing overselling.
--
-- Security: EXECUTE is revoked from PUBLIC, anon, and authenticated.
-- Only service_role (used by the server-side booking API) can execute this.
--
-- Run this in the Supabase SQL Editor.
-- The booking API calls this via supabaseAdmin.rpc('create_booking', ...).

-- 1. Add inventory column (safe to re-run).
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS inventory_count INTEGER NOT NULL DEFAULT 50;

-- Optional: ensure inventory is positive for existing rows.
UPDATE cars SET inventory_count = 50 WHERE inventory_count IS NULL;

-- 2. Replace the booking RPC with inventory-aware logic.
CREATE OR REPLACE FUNCTION create_booking(
  p_customer_name    TEXT,
  p_phone            TEXT,
  p_email            TEXT,
  p_vehicle          TEXT,
  p_service_type     TEXT,
  p_pickup_location  TEXT,
  p_dropoff_location TEXT,
  p_pickup_datetime  TIMESTAMPTZ,
  p_return_datetime  TIMESTAMPTZ,
  p_special_requirements TEXT,
  p_total_price      TEXT,
  p_booking_reference TEXT
)
RETURNS SETOF bookings
LANGUAGE plpgsql
AS $$
DECLARE
  lock_key bigint;
  model_record RECORD;
  active_count integer;
BEGIN
  -- Derive a deterministic advisory-lock key from the vehicle model name.
  -- pg_advisory_xact_lock is automatically released at end of transaction.
  lock_key := hashtextextended(p_vehicle, 0);
  PERFORM pg_advisory_xact_lock(lock_key);

  -- Look up the active model and its inventory count.
  SELECT id, price_per_day, inventory_count INTO model_record
  FROM cars
  WHERE name = p_vehicle AND is_active = true
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Vehicle model not found.';
  END IF;

  -- Count overlapping active bookings (pending / confirmed only).
  SELECT COUNT(*) INTO active_count
  FROM bookings
  WHERE vehicle = p_vehicle
    AND status IN ('pending', 'confirmed')
    AND pickup_datetime < p_return_datetime
    AND return_datetime > p_pickup_datetime;

  -- Reject if inventory is exhausted.
  IF active_count >= model_record.inventory_count THEN
    RAISE EXCEPTION 'No inventory available for the requested period.';
  END IF;

  -- Insert and return the new booking.
  -- p_total_price is TEXT from the API; cast explicitly to match the numeric column.
  RETURN QUERY
  INSERT INTO bookings (
    customer_name, phone, email, vehicle, service_type,
    pickup_location, dropoff_location, pickup_datetime, return_datetime,
    special_requirements, total_price, status, booking_reference
  ) VALUES (
    p_customer_name, p_phone, p_email, p_vehicle, p_service_type,
    p_pickup_location, p_dropoff_location, p_pickup_datetime, p_return_datetime,
    p_special_requirements, p_total_price::numeric, 'pending', p_booking_reference
  )
  RETURNING *;
END;
$$;

-- 3. Keep the RPC server-only.
REVOKE EXECUTE ON FUNCTION create_booking FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_booking FROM anon;
REVOKE EXECUTE ON FUNCTION create_booking FROM authenticated;
GRANT EXECUTE ON FUNCTION create_booking TO service_role;
