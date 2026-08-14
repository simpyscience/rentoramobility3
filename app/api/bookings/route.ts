import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      total_price,
    } = body;

    if (
      !customer_name ||
      !phone ||
      !vehicle ||
      !service_type ||
      !pickup_location ||
      !dropoff_location ||
      !pickup_datetime
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking information.",
        },
        { status: 400 }
      );
    }

    const booking_reference = `RM-${Date.now()}`;

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          customer_name,
          phone,
          email: email || null,
          vehicle,
          service_type,
          pickup_location,
          dropoff_location,
          pickup_datetime,
          return_datetime: return_datetime || null,
          special_requirements: special_requirements || null,
          total_price: total_price || null,
          status: "pending",
          booking_reference,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Booking creation error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to create booking.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: data,
      message: "Booking created successfully.",
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request.",
      },
      { status: 400 }
    );
  }
}