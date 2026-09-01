"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState(0);

  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = interactive ? starValue <= (hovered || rating) : starValue <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={cn(
              "transition-colors",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
              filled ? "text-gold" : "text-muted-foreground/30"
            )}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star className={sizeClass} fill={filled ? "currentColor" : "none"} />
          </button>
        );
      })}
    </div>
  );
}
