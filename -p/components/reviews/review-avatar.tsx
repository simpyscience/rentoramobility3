"use client";

import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/reviews";
import type { PublicReview } from "@/lib/reviews";
import { cn } from "@/lib/utils";

export function ReviewAvatar({
  review,
  className,
  size = "md",
}: {
  review: PublicReview;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [imgOk, setImgOk] = React.useState(true);

  React.useEffect(() => {
    setImgOk(true);
  }, [review.avatar_url]);

  const sizeClass =
    size === "sm"
      ? "h-8 w-8"
      : size === "lg"
      ? "h-14 w-14"
      : "h-12 w-12";

  return (
    <Avatar className={cn("border-2 border-white shadow", sizeClass, className)}>
      {review.avatar_url && imgOk ? (
        <AvatarImage
          src={review.avatar_url}
          alt={review.name}
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      ) : null}
      <AvatarFallback className="bg-gold/10 text-gold font-semibold">
        {getInitials(review.name)}
      </AvatarFallback>
    </Avatar>
  );
}
