-- Rentora Mobility — Admin Booking Management: Required Privileges
--
-- Run this in Supabase SQL Editor AFTER applying 001_atomic_booking.sql.
-- The service_role needs UPDATE privilege so admins can change booking status.
--
-- This is safe: it only grants update permission on the bookings table
-- to the service_role, which is already used for all server-side operations.

GRANT UPDATE ON public.bookings TO service_role;
