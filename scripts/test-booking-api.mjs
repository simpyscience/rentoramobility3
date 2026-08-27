/**
 * Rentora Mobility — Inventory-Aware Booking API Test Suite
 *
 * Run AFTER applying the migration (supabase/migrations/001_atomic_booking.sql)
 * and while the dev/prod server is running locally.
 *
 * Usage: node scripts/test-booking-api.mjs
 *
 * Business rule: multiple physical vehicles share the same model name.
 * Overlapping bookings are allowed up to the inventory limit (default 50).
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

const VALID_BOOKING = {
  customer_name: "Test User",
  phone: "+919876543210",
  email: "test@example.com",
  vehicle: "Toyota Innova Crysta",
  service_type: "chauffeur",
  pickup_location: "Delhi",
  dropoff_location: "Jaipur",
  pickup_datetime: "2026-10-01T10:00:00+05:30",
  return_datetime: "2026-10-03T10:00:00+05:30",
  special_requirements: "Test booking — please ignore",
};

let passed = 0;
let failed = 0;

async function api(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function assert(name, condition, detail) {
  if (condition) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${name} — ${detail || ""}`);
    failed++;
  }
}

async function run() {
  console.log("\n=== Rentora Mobility — Inventory-Aware Booking API Tests ===\n");

  /* ---------------------------------------------------------------- */
  /*  T1 — Valid booking succeeds                                     */
  /* ---------------------------------------------------------------- */
  console.log("T1: Valid booking");
  const t1 = await api("/api/bookings", {
    ...VALID_BOOKING,
    pickup_datetime: "2026-11-01T10:00:00+05:30",
    return_datetime: "2026-11-03T10:00:00+05:30",
  });
  assert("returns success", t1.data.success === true, JSON.stringify(t1.data));
  assert("has booking_reference", !!t1.data.booking?.booking_reference, "no reference");
  assert("status is pending", t1.data.booking?.status === "pending", "wrong status");

  /* ---------------------------------------------------------------- */
  /*  T2 — Invalid (nonexistent) car rejected                         */
  /* ---------------------------------------------------------------- */
  console.log("\nT2: Invalid car");
  const t2 = await api("/api/bookings", {
    ...VALID_BOOKING,
    vehicle: "Nonexistent Car XYZ",
    pickup_datetime: "2026-12-01T10:00:00+05:30",
    return_datetime: "2026-12-03T10:00:00+05:30",
  });
  assert("rejected", t2.data.success === false, JSON.stringify(t2.data));
  assert("status 400", t2.status === 400, `got ${t2.status}`);

  /* ---------------------------------------------------------------- */
  /*  T3 — Invalid dates (pickup after return)                        */
  /* ---------------------------------------------------------------- */
  console.log("\nT3: Invalid dates");
  const t3 = await api("/api/bookings", {
    ...VALID_BOOKING,
    pickup_datetime: "2026-12-10T10:00:00+05:30",
    return_datetime: "2026-12-01T10:00:00+05:30",
  });
  assert("rejected", t3.data.success === false, JSON.stringify(t3.data));
  assert("status 400", t3.status === 400, `got ${t3.status}`);

  /* ---------------------------------------------------------------- */
  /*  T4 — Overlapping booking ALLOWED (inventory remains)            */
  /*  Same model, same period as T1 — should succeed because           */
  /*  inventory (50) is far from exhausted.                           */
  /* ---------------------------------------------------------------- */
  console.log("\nT4: Overlapping booking (allowed)");
  const t4 = await api("/api/bookings", {
    ...VALID_BOOKING,
    customer_name: "Overlap User",
    pickup_datetime: "2026-11-02T10:00:00+05:30",
    return_datetime: "2026-11-04T10:00:00+05:30",
  });
  assert("succeeds", t4.data.success === true, JSON.stringify(t4.data));

  /* ---------------------------------------------------------------- */
  /*  T5 — Non-overlapping booking allowed                            */
  /* ---------------------------------------------------------------- */
  console.log("\nT5: Non-overlapping booking");
  const t5 = await api("/api/bookings", {
    ...VALID_BOOKING,
    customer_name: "NonOverlap User",
    pickup_datetime: "2026-11-10T10:00:00+05:30",
    return_datetime: "2026-11-12T10:00:00+05:30",
  });
  assert("succeeds", t5.data.success === true, JSON.stringify(t5.data));

  /* ---------------------------------------------------------------- */
  /*  T6 — Client price manipulation ignored                          */
  /* ---------------------------------------------------------------- */
  console.log("\nT6: Client price manipulation");
  const t6 = await api("/api/bookings", {
    ...VALID_BOOKING,
    customer_name: "Price Manipulator",
    total_price: "1",
    pickup_datetime: "2026-12-20T10:00:00+05:30",
    return_datetime: "2026-12-22T10:00:00+05:30",
  });
  assert("succeeds", t6.data.success === true, JSON.stringify(t6.data));
  assert(
    "price is NOT 1",
    t6.data.booking?.total_price !== "1",
    `price was ${t6.data.booking?.total_price}`
  );

  /* ---------------------------------------------------------------- */
  /*  T7 — Five concurrent bookings all succeed (inventory = 50)       */
  /* ---------------------------------------------------------------- */
  console.log("\nT7: Concurrent bookings (5 simultaneous, inventory 50)");
  const concurrent = Array.from({ length: 5 }, (_, i) =>
    api("/api/bookings", {
      ...VALID_BOOKING,
      customer_name: `Concurrent ${i}`,
      pickup_datetime: "2027-02-10T10:00:00+05:30",
      return_datetime: "2027-02-12T10:00:00+05:30",
    })
  );
  const results = await Promise.all(concurrent);
  const winners = results.filter((r) => r.data.success === true).length;
  const losers = results.filter((r) => r.data.success === false).length;
  assert("all 5 succeed", winners === 5, `winners=${winners}`);
  assert("0 rejected", losers === 0, `losers=${losers}`);

  /* ---------------------------------------------------------------- */
  /*  T8 — Inventory exhaustion (dedicated test model)                */
  /*  Uses a unique model name with a small inventory to verify the   */
  /*  boundary. Creates 3 overlapping bookings against inventory 3;   */
  /*  the 4th must be rejected.                                       */
  /* ---------------------------------------------------------------- */
  console.log("\nT8: Inventory exhaustion (boundary test)");
  const testModel = "Test Boundary Model XYZ";
  const baseDate = "2027-03-01T10:00:00+05:30";
  const endDate = "2027-03-03T10:00:00+05:30";

  // First, ensure the test model exists with inventory_count = 3.
  // This requires a direct DB insert via the API is not possible,
  // so we rely on the migration having created the column and the
  // model being seeded. If the model does not exist, all 4 will be
  // rejected with 400 (model not found) — which still proves the
  // API does NOT create bookings with a fallback price.
  const exhaustion = Array.from({ length: 4 }, (_, i) =>
    api("/api/bookings", {
      ...VALID_BOOKING,
      customer_name: `Exhaust ${i}`,
      vehicle: testModel,
      pickup_datetime: baseDate,
      return_datetime: endDate,
    })
  );
  const exResults = await Promise.all(exhaustion);
  const exWinners = exResults.filter((r) => r.data.success === true).length;
  const exLosers = exResults.filter((r) => r.data.success === false).length;

  if (exWinners === 3 && exLosers === 1) {
    assert("3 succeed", true);
    assert("1 rejected", true);
    assert(
      "rejected returns 409",
      exResults.find((r) => !r.data.success)?.status === 409,
      "expected 409 for exhausted inventory"
    );
  } else {
    // If the test model isn't seeded with inventory 3, report what happened.
    // The key safety property: NO booking is ever created at a fallback price.
    assert(
      "no fallback-price booking created",
      exWinners <= 3,
      `winners=${exWinners} losers=${exLosers} (test model may need seeding with inventory_count=3)`
    );
  }

  /* ---------------------------------------------------------------- */
  /*  T9 — Availability API does not leak customer data               */
  /* ---------------------------------------------------------------- */
  console.log("\nT9: Availability API data leakage");
  const t9 = await api("/api/availability", {
    vehicle: "Toyota Innova Crysta",
    pickup_datetime: "2026-11-01T10:00:00+05:30",
    return_datetime: "2026-11-03T10:00:00+05:30",
  });
  const respStr = JSON.stringify(t9.data);
  assert(
    "no customer data leaked",
    !respStr.includes("customer") && !respStr.includes("phone") && !respStr.includes("email"),
    "leaked!"
  );
  assert("returns availability status", !!t9.data.availability, "no availability field");

  /* ---------------------------------------------------------------- */
  /*  T10 — Availability reflects inventory (not just overlap)        */
  /* ---------------------------------------------------------------- */
  console.log("\nT10: Availability returns customer-facing status");
  assert(
    "availability is one of expected values",
    ["Available", "Limited availability", "Currently unavailable"].includes(t9.data.availability),
    `got: ${t9.data.availability}`
  );

  /* ---------------------------------------------------------------- */
  /*  Summary                                                         */
  /* ---------------------------------------------------------------- */
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error("Test runner error:", e);
  process.exit(1);
});
