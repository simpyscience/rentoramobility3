/**
 * Rentora Mobility — Server-side WhatsApp notification sender
 *
 * Uses the Meta WhatsApp Cloud API to deliver booking notifications to the
 * Rentora Mobility WhatsApp number/account.
 *
 * IMPORTANT SECURITY
 * - This module is ONLY imported by server-side API routes. It is never
 *   imported by client components, so the credentials below are never
 *   bundled into or exposed to the browser and never sent to ElevenLabs.
 * - WhatsApp credentials are NEVER logged. `redact()` strips bearer tokens
 *   and long secrets from any logged payload.
 * - `sendBookingNotification` never throws. A WhatsApp failure can never
 *   roll back or invalidate a booking that was already created in Supabase.
 */
import { CONTACT } from "@/lib/data/contact";

const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v19.0";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
// Destination = Rentora Mobility's WhatsApp number (already configured for
// the webapp). Override via env to point at a different account if needed.
const WHATSAPP_RECIPIENT_PHONE =
  process.env.WHATSAPP_RECIPIENT_PHONE || CONTACT.whatsapp;
// Base URL defaults to the official Meta Graph API. Override is supported for
// server-side testing only (e.g. a local stub); it is never exposed to the
// browser because this module is imported only by server-side code.
const WHATSAPP_API_BASE_URL =
  process.env.WHATSAPP_API_BASE_URL || "https://graph.facebook.com";

const GRAPH_BASE_URL = WHATSAPP_API_BASE_URL;

function buildEndpoint(): string | null {
  if (!WHATSAPP_PHONE_NUMBER_ID) return null;
  return `${GRAPH_BASE_URL}/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
}

export interface BookingRecord {
  booking_reference: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  vehicle: string;
  service_type: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  return_datetime: string;
  total_price: number | string | null;
  special_requirements: string | null;
  status?: string | null;
}

/**
 * In-process deduplication guard.
 *
 * Tracks booking references that have already been notified so that a retried
 * request for the SAME booking reference does not produce a duplicate
 * WhatsApp message. This is process-scoped (not distributed) which is
 * "reasonably possible" without altering the existing booking API contract.
 */
const notifiedReferences = new Set<string>();

export function isNotified(bookingReference: string): boolean {
  return notifiedReferences.has(bookingReference);
}

export function markNotified(bookingReference: string): void {
  notifiedReferences.add(bookingReference);
}

function redact(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  const clone: Record<string, unknown> = { ...value };
  for (const key of Object.keys(clone)) {
    if (/^(token|access_token|bearer|password|secret|key)/i.test(key)) {
      clone[key] = "[REDACTED]";
    } else {
      clone[key] = redact(clone[key]);
    }
  }
  return clone;
}

function safeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function displayServiceType(value: string): string {
  const v = value.trim().toLowerCase();
  if (v === "chauffeur") return "Chauffeur";
  if (v === "self-drive" || v === "self drive") return "Self Drive";
  return value || "N/A";
}

function formatPrice(value: number | string | null | undefined): string {
  if (value == null || value === "") return "N/A";
  return `₹${value}`;
}

function buildWhatsAppMessage(booking: BookingRecord): string {
  const lines: string[] = [];
  lines.push("🚗 RENTORA MOBILITY");
  lines.push("NEW BOOKING CONFIRMED");
  lines.push("");
  lines.push(`Booking Reference: ${booking.booking_reference}`);
  lines.push("");
  lines.push("Customer Details");
  lines.push(`Name: ${booking.customer_name || "N/A"}`);
  lines.push(`Phone: ${booking.phone || "N/A"}`);
  lines.push(`Email: ${booking.email || "N/A"}`);
  lines.push("");
  lines.push("Rental Details");
  lines.push(`Vehicle: ${booking.vehicle || "N/A"}`);
  lines.push(`Service: ${displayServiceType(booking.service_type)}`);
  lines.push(`Pickup: ${booking.pickup_location || "N/A"}`);
  lines.push(`Drop-off: ${booking.dropoff_location || "N/A"}`);
  lines.push(`Pickup Date & Time: ${formatDate(booking.pickup_datetime)}`);
  lines.push(`Return Date & Time: ${formatDate(booking.return_datetime)}`);
  lines.push("");
  lines.push(`Total Price: ${formatPrice(booking.total_price)}`);
  lines.push(
    `Special Requirements: ${booking.special_requirements || "None"}`
  );
  lines.push("");
  lines.push("Status: CONFIRMED");
  lines.push("");
  lines.push("— Rentora Mobility Booking System");
  return lines.join("\n");
}

export interface WhatsAppSendResult {
  sent: boolean;
  skipped?: boolean;
  reason?: string;
}

/**
 * Send a WhatsApp booking notification for a freshly-created booking.
 *
 * This function is intentionally side-effect-safe: it logs failures without
 * exposing secrets and never throws. The caller (booking API) must only
 * invoke it AFTER the booking has been committed in Supabase, and must NOT
 * treat a notification failure as a booking failure.
 */
export async function sendBookingWhatsAppNotification(
  booking: BookingRecord
): Promise<WhatsAppSendResult> {
  // Duplicate-notification protection: if we already sent a notification for
  // this booking reference during this process lifetime, do not send again.
  if (notifiedReferences.has(booking.booking_reference)) {
    console.warn(
      `[whatsapp] Duplicate notification suppressed for booking reference: ${booking.booking_reference}`
    );
    return { sent: false, skipped: true, reason: "duplicate suppressed" };
  }

  const token = WHATSAPP_API_TOKEN;
  const phoneNumberId = WHATSAPP_PHONE_NUMBER_ID;

  // Credentials are required server-side. If they are missing we skip
  // silently (with a safe warning) so the booking is never affected.
  if (!token || !phoneNumberId) {
    console.warn(
      "[whatsapp] Notification skipped: WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not configured."
    );
    return {
      sent: false,
      skipped: true,
      reason: "credentials not configured",
    };
  }

  const endpoint = buildEndpoint();
  if (!endpoint) {
    console.warn(
      "[whatsapp] Notification skipped: could not resolve endpoint from WHATSAPP_PHONE_NUMBER_ID."
    );
    return { sent: false, skipped: true, reason: "endpoint not configured" };
  }

  const recipient = (WHATSAPP_RECIPIENT_PHONE || "").replace(/\D/g, "");
  if (!recipient) {
    console.warn(
      "[whatsapp] Notification skipped: no recipient phone number configured."
    );
    return { sent: false, skipped: true, reason: "no recipient" };
  }

  const payload = {
    messaging_product: "whatsapp",
    to: recipient,
    type: "text",
    text: { body: buildWhatsAppMessage(booking) },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[whatsapp] Send failed (Meta API error):", {
        status: res.status,
        response: redact(data),
        booking_reference: booking.booking_reference,
      });
      return {
        sent: false,
        skipped: false,
        reason: `whatsapp api error ${res.status}`,
      };
    }

    console.log(
      `[whatsapp] Notification sent for booking reference: ${booking.booking_reference}`
    );

    // Only record the dedup key AFTER a successful send so that, on
    // transient failures, a retry is still able to (re)send the message.
    notifiedReferences.add(booking.booking_reference);

    return { sent: true };
  } catch (error) {
    // Network/encoding errors. Never throw; never log the token.
    console.error("[whatsapp] Send failed (network/unexpected error):", {
      error: safeError(error),
      booking_reference: booking.booking_reference,
    });
    return {
      sent: false,
      skipped: false,
      reason: `request error: ${safeError(error)}`,
    };
  }
}
