export interface PublicReview {
  id: string;
  name: string;
  rating: number;
  review: string;
  avatar_url: string | null;
  created_at: string;
}

export interface ReviewsMeta {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewsResponse {
  success: boolean;
  reviews: PublicReview[];
  averageRating: number;
  totalReviews: number;
}

export interface SubmitReviewResponse {
  success: boolean;
  message: string;
  review: PublicReview;
}

export const MAX_NAME_LENGTH = 100;
export const MAX_REVIEW_LENGTH = 2000;
export const MAX_EMAIL_LENGTH = 254;
export const RATING_MIN = 1;
export const RATING_MAX = 5;

export function getInitials(name: string): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase() || '?';
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function formatReviewDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
