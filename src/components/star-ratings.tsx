import { StarIcon } from "lucide-react";
import React from "react";

const StarRatings = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className="text-primary-200 text-sm">
        <StarIcon fill="currentColor" className="size-4" />
      </span>,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className="relative text-sm">
        <span className="text-gray-300">
          <StarIcon fill="currentColor" className="size-4" />
        </span>
        <span
          className="absolute inset-0 text-primary-200 overflow-hidden"
          style={{ width: `${(rating % 1) * 100}%` }}
        >
          <StarIcon fill="currentColor" className="size-4" />
        </span>
      </span>,
    );
  }

  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className="text-gray-300 text-sm">
        <StarIcon fill="currentColor" className="size-4" />
      </span>,
    );
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default StarRatings;
