import { cookies } from "next/headers";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminBookingManager, type BookingRecord } from "@/components/admin/admin-booking-manager";
import { AdminReviews } from "@/components/admin/admin-reviews";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata = {
  title: "Admin Dashboard — Rentora Mobility",
  description: "Manage bookings and reviews for Rentora Mobility.",
  robots: { index: false, follow: false },
};

async function fetchBookings(): Promise<BookingRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Failed to fetch bookings:", error);
      return [];
    }

    return (data || []) as BookingRecord[];
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
}

type SearchParams = { tab?: string };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "authenticated") {
    return <AdminLogin />;
  }

  const tab = searchParams.tab || "bookings";

  if (tab === "reviews") {
    return <AdminReviews />;
  }

  const bookings = await fetchBookings();
  return <AdminBookingManager initialBookings={bookings} />;
}
