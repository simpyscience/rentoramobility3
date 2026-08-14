import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      vehicle,
      pickup_datetime,
      return_datetime,
      city,
    } = body;

    if (!vehicle || !pickup_datetime) {
      return NextResponse.json(
        {
          success: false,
          error: "Vehicle and pickup date are required.",
        },
        { status: 400 }
      );
    }

    // Find active cars matching the requested vehicle.
    let carsQuery = supabaseAdmin
      .from("cars")
      .select("*")
      .eq("name", vehicle)
      .eq("is_active", true);

    if (city) {
      carsQuery = carsQuery.eq("city", city);
    }

    const { data: cars, error: carsError } = await carsQuery;

    if (carsError) {
      console.error("Cars lookup error:", carsError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to check vehicle availability.",
        },
        { status: 500 }
      );
    }

    if (!cars || cars.length === 0) {
      return NextResponse.json({
        success: true,
        available: false,
        message: "No matching vehicle is currently available.",
      });
    }

    // Check whether any matching car already has a confirmed/pending
    // booking that overlaps the requested rental period.
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from("bookings")
      .select("id, vehicle, pickup_datetime, return_datetime, status")
      .eq("vehicle", vehicle)
      .in("status", ["pending", "confirmed"])
      .lt("pickup_datetime", return_datetime || pickup_datetime)
      .gt("return_datetime", pickup_datetime);

    if (bookingsError) {
      console.error("Bookings lookup error:", bookingsError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to check existing bookings.",
        },
        { status: 500 }
      );
    }

    const hasConflict = bookings && bookings.length > 0;

    if (hasConflict) {
      return NextResponse.json({
        success: true,
        available: false,
        message: `${vehicle} is already booked for the requested period.`,
      });
    }

    return NextResponse.json({
      success: true,
      available: true,
      vehicle,
      city: city || null,
      price_per_day: cars[0].price_per_day,
      message: `${vehicle} is available for the requested period.`,
    });
  } catch (error) {
    console.error("Availability API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Invalid availability request.",
      },
      { status: 400 }
    );
  }
}