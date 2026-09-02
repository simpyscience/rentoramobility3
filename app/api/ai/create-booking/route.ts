import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED_SERVICE_TYPES = ["self-drive", "chauffeur"] as const;

const SERVICE_TYPE_ALIASES: Record<string, string> = {
  "self drive": "self-drive",
  "selfdrive": "self-drive",
  "Self Drive": "self-drive",
  "Self drive": "self-drive",
  "with chauffeur": "chauffeur",
  "With Chauffeur": "chauffeur",
  "chauffeur": "chauffeur",
  "Chauffeur": "chauffeur",
  "chauffeur-driven": "chauffeur",
  "driver": "chauffeur",
  "Driver": "chauffeur",
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  return /^[\d\s+\-()]{10,15}$/.test(value);
}

function isValidISODate(value: string): boolean {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function normalizeServiceType(value: string): string | null {
  const trimmed = value.trim();
  if (ALLOWED_SERVICE_TYPES.includes(trimmed as (typeof ALLOWED_SERVICE_TYPES)[number])) {
    return trimmed;
  }
  return SERVICE_TYPE_ALIASES[trimmed] ?? null;
}

function generateBookingReference(): string {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `RM-${random}`;
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

  const {
    customer_name,
    phone,
    email,
    vehicle,
    service_type,
    pickup_location,
    dropoff_location,
    pickup_datetime,
    return_datetime,
    special_requirements,
    confirmed,
  } = body;

  /* ------------------------------------------------------------------ */
  /*  Confirmation gate — must be explicitly true                         */
  /* ------------------------------------------------------------------ */
  if (confirmed !== true) {
    return NextResponse.json(
      { success: false, error: "Booking confirmation is required." },
      { status: 400 }
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Validate customer fields                                            */
  /* ------------------------------------------------------------------ */
  if (!isNonEmptyString(customer_name)) {
    return NextResponse.json(
      { success: false, error: "Customer name is required." },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(phone) || !isValidPhone(phone as string)) {
    return NextResponse.json(
      { success: false, error: "A valid phone number is required." },
      { status: 400 }
    );
  }

  if (email !== undefined && email !== null && email !== "") {
    if (!isValidEmail(email as string)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Validate trip fields                                                */
  /* ------------------------------------------------------------------ */
  if (!isNonEmptyString(vehicle)) {
    return NextResponse.json(
      { success: false, error: "Vehicle selection is required." },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(service_type)) {
    return NextResponse.json(
      { success: false, error: "Service type is required." },
      { status: 400 }
    );
  }

  const normalizedServiceType = normalizeServiceType(service_type as string);
  if (!normalizedServiceType) {
    return NextResponse.json(
      { success: false, error: "A valid service type is required." },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(pickup_location)) {
    return NextResponse.json(
      { success: false, error: "Pickup location is required." },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(dropoff_location)) {
    return NextResponse.json(
      { success: false, error: "Drop-off location is required." },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(pickup_datetime) || !isValidISODate(pickup_datetime as string)) {
    return NextResponse.json(
      { success: false, error: "A valid pickup date and time are required." },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(return_datetime) || !isValidISODate(return_datetime as string)) {
    return NextResponse.json(
      { success: false, error: "A valid return date and time are required." },
      { status: 400 }
    );
  }

  const pickupDate = new Date(pickup_datetime as string);
  const returnDate = new Date(return_datetime as string);

  if (pickupDate >= returnDate) {
    return NextResponse.json(
      { success: false, error: "Pickup must be before return." },
      { status: 400 }
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Verify vehicle existence + fetch authoritative pricing             */
  /*  (AI-supplied price is NEVER trusted)                                */
  /* ------------------------------------------------------------------ */
  const { data: car, error: carError } = await supabaseAdmin
    .from("cars")
    .select("id, name, price_per_day, is_active")
    .eq("name", (vehicle as string).trim())
    .eq("is_active", true)
    .maybeSingle();

  if (carError) {
    console.error("AI Booking API — car lookup error:", carError);
    return NextResponse.json(
      { success: false, error: "Unable to verify vehicle." },
      { status: 500 }
    );
  }

  if (!car) {
    return NextResponse.json(
      { success: false, error: "The selected vehicle is not available." },
      { status: 404 }
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Server-authoritative price calculation                              */
  /*  (total_price from AI is intentionally ignored)                      */
  /* ------------------------------------------------------------------ */
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const days = Math.max(
    1,
    Math.ceil((returnDate.getTime() - pickupDate.getTime()) / MS_PER_DAY)
  );
  const baseRental = car.price_per_day * days;
  const chauffeurFee = normalizedServiceType === "chauffeur" ? 500 * days : 0;
  const gst = Math.round((baseRental + chauffeurFee) * 0.05);
  const totalPrice = (baseRental + chauffeurFee + gst).toString();

  /* ------------------------------------------------------------------ */
  /*  Server-generated booking reference (never from AI)                  */
  /* ------------------------------------------------------------------ */
  const booking_reference = generateBookingReference();

  /* ------------------------------------------------------------------ */
  /*  Atomic booking creation (advisory lock + overlap check inside RPC) */
  /* ------------------------------------------------------------------ */
  const { data, error } = await supabaseAdmin.rpc("create_booking", {
    p_customer_name: (customer_name as string).trim(),
    p_phone: (phone as string).trim(),
    p_email: isNonEmptyString(email) ? (email as string).trim() : null,
    p_vehicle: (vehicle as string).trim(),
    p_service_type: normalizedServiceType,
    p_pickup_location: (pickup_location as string).trim(),
    p_dropoff_location: (dropoff_location as string).trim(),
    p_pickup_datetime: pickupDate.toISOString(),
    p_return_datetime: returnDate.toISOString(),
    p_special_requirements: isNonEmptyString(special_requirements)
      ? (special_requirements as string).trim()
      : null,
    p_total_price: totalPrice,
    p_booking_reference: booking_reference,
  });

  if (error) {
    console.error("AI Booking API — create_booking error:", error);

    const msg = error.message?.toLowerCase() || "";

    if (msg.includes("no inventory available")) {
      return NextResponse.json(
        { success: false, error: "The selected vehicle is currently unavailable for the requested period." },
        { status: 409 }
      );
    }

    if (msg.includes("vehicle model not found")) {
      return NextResponse.json(
        { success: false, error: "The selected vehicle is not available." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unable to create booking." },
      { status: 500 }
    );
  }

  const booking = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({
    success: true,
    message: "Booking created successfully.",
    booking_reference,
    booking: {
      customer_name: booking.customer_name,
      vehicle: booking.vehicle,
      service_type: booking.service_type,
      pickup_location: booking.pickup_location,
      dropoff_location: booking.dropoff_location,
      pickup_datetime: booking.pickup_datetime,
      return_datetime: booking.return_datetime,
      total_price: booking.total_price,
    },
  });
}
