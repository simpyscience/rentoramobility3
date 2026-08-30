import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidISODate(value: string): boolean {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
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

  const { vehicle, pickup_datetime, return_datetime, city } = body;

  // Diagnostic: log incoming request
  console.log("[availability] Request:", { vehicle, pickup_datetime, return_datetime, city });

  if (!isNonEmptyString(vehicle)) {
    return NextResponse.json(
      { success: false, error: "Vehicle is required." },
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
  /*  Verify the vehicle exists and is active                            */
  /* ------------------------------------------------------------------ */
  let carsQuery = supabaseAdmin
    .from("cars")
    .select("id, name, price_per_day, inventory_count")
    .eq("name", (vehicle as string).trim())
    .eq("is_active", true);

  const { data: cars, error: carsError } = await carsQuery;

  // Diagnostic: log query result
  console.log("[availability] Cars query result:", {
    carsFound: cars?.length || 0,
    carsError: carsError ? { message: carsError.message, code: carsError.code } : null,
    cars: cars?.map(c => ({ id: c.id, name: c.name, inventory_count: c.inventory_count }))
  });

  if (carsError) {
    console.error("Availability API — cars lookup error:", carsError);
    return NextResponse.json(
      { success: false, error: "Unable to check vehicle availability." },
      { status: 500 }
    );
  }

  if (!cars || cars.length === 0) {
    return NextResponse.json({
      success: true,
      available: false,
      availability: "Currently unavailable",
      message: "No matching vehicle is currently available.",
    });
  }

  const model = cars[0];
  const inventoryCount = model.inventory_count ?? 50;

  /* ------------------------------------------------------------------ */
  /*  Count overlapping active bookings (pending / confirmed only)       */
  /* ------------------------------------------------------------------ */
  const { data: overlapping, error: bookingsError } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("vehicle", (vehicle as string).trim())
    .in("status", ["pending", "confirmed"])
    .lt("pickup_datetime", returnDate.toISOString())
    .gt("return_datetime", pickupDate.toISOString());

  // Diagnostic: log bookings result
  console.log("[availability] Overlapping bookings:", {
    count: overlapping?.length || 0,
    bookingsError: bookingsError ? { message: bookingsError.message } : null
  });

  if (bookingsError) {
    console.error("Availability API — bookings lookup error:", bookingsError);
    return NextResponse.json(
      { success: false, error: "Unable to check existing bookings." },
      { status: 500 }
    );
  }

  const activeCount = overlapping ? overlapping.length : 0;
  const remaining = inventoryCount - activeCount;

  let available: boolean;
  let availability: string;
  let message: string;

  if (remaining > 5) {
    available = true;
    availability = "Available";
    message = `${vehicle} is available for the requested period.`;
  } else if (remaining > 0) {
    available = true;
    availability = "Limited availability";
    message = `${vehicle} has limited availability for the requested period.`;
  } else {
    available = false;
    availability = "Currently unavailable";
    message = `${vehicle} is currently unavailable for the requested period.`;
  }

  return NextResponse.json({
    success: true,
    available,
    availability,
    vehicle,
    city: isNonEmptyString(city) ? (city as string).trim() : null,
    price_per_day: model.price_per_day,
    message,
  });
}
