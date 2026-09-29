"use client";

import * as React from "react";
import { Star, CheckCircle2, XCircle, Trash2, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  customer_name: string;
  email: string;
  rating: number;
  review_text: string;
  vehicle: string | null;
  service_type: string | null;
  location: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
  approved_at: string | null;
}

export function AdminReviews() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [updating, setUpdating] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const fetchReviews = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } catch (error) {
      console.error("Failed to update review:", error);
    } finally {
      setUpdating(null);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i < rating ? "text-gold fill-gold" : "text-muted-foreground/30")} />
      ))}
    </div>
  );

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        {/* Admin Navigation */}
        <div className="flex items-center gap-6 mb-6 pb-4 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Admin Panel</span>
          <nav className="flex items-center gap-4">
            <a href="/admin/bookings?tab=bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground pb-1">Bookings</a>
            <a href="/admin/bookings?tab=reviews" className="text-sm font-medium text-foreground border-b-2 border-gold pb-1">Customer Reviews</a>
          </nav>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="luxury-card p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</div>
            <div className="text-2xl font-bold">{reviews.length}</div>
          </div>
          <div className="luxury-card p-4">
            <div className="text-xs text-amber-600 uppercase tracking-wider mb-1">Pending</div>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          </div>
          <div className="luxury-card p-4">
            <div className="text-xs text-green-600 uppercase tracking-wider mb-1">Approved</div>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </div>
          <div className="luxury-card p-4">
            <div className="text-xs text-red-600 uppercase tracking-wider mb-1">Rejected</div>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                statusFilter === status ? "btn-gold" : "border border-border hover:border-gold/50"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="luxury-card p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-sans text-lg font-semibold mb-2">No Reviews</h3>
            <p className="text-muted-foreground text-sm">No reviews found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="luxury-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        review.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        review.status === "approved" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                        "bg-red-500/10 text-red-600 border-red-500/20"
                      )}>
                        {review.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{review.review_text}</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">{review.customer_name}</span> • {review.email}
                      {review.vehicle && <span> • {review.vehicle}</span>}
                      {review.service_type && <span> • {review.service_type}</span>}
                      {review.location && <span> • {review.location}</span>}
                      <span> • {formatDate(review.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {review.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(review.id, "approved")}
                        disabled={updating === review.id}
                        className="rounded-lg border border-green-500/20 bg-green-500/10 p-2 text-green-600 hover:bg-green-500/20 transition-colors"
                        aria-label="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(review.id, "rejected")}
                        disabled={updating === review.id}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-600 hover:bg-red-500/20 transition-colors"
                        aria-label="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(review.id)}
                      disabled={deleting === review.id}
                      className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
