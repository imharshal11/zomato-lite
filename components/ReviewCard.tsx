import { type FC } from 'react';
import { StarRating } from './StarRating';

export interface ReviewCardProps {
  rating: number;
  comment: string;
  createdAt: string;
  recommends?: boolean;
  foodRating?: number | null;
  packagingRating?: number | null;
  isLatest?: boolean;
  dishName?: string | null;
}

function ReviewCardComponent({
  rating,
  comment,
  createdAt,
  recommends = false,
  foodRating = null,
  packagingRating = null,
  isLatest = false,
  dishName,
}: ReviewCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm hover:shadow-md transition-shadow duration-200 p-5 relative">
      {isLatest && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2f2] text-sm font-semibold text-[#e23744]">
          Latest review
        </div>
      )}
      <div className="mb-3 flex items-center gap-2">
        {dishName ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fef2f2] text-sm font-medium text-[#e23744]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Reviewed: {dishName}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f1f0eb] text-sm font-medium text-[#6b6b6b]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>General Review</span>
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-2 flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <StarRating rating={rating} size="md" colorByRating />
            <span className="text-md font-bold text-[#1a1a1a] tabular-nums" style={{ color: rating <= 2 ? '#dc2626' : rating === 3 ? '#f59e0b' : '#16a34a' }}>
              {rating}
            </span>
          </div>
          {recommends && (
            <span className="flex items-center gap-1 text-sm text-[#16a34a] whitespace-nowrap" aria-label="Recommended">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span>Recommended</span>
            </span>
          )}
        </div>
        <time className="text-xs text-[#9ca3af] whitespace-nowrap flex-shrink-0 ml-2" dateTime={createdAt}>
          {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </time>
      </div>
      <p className="text-[#1a1a1a] leading-relaxed whitespace-pre-wrap mb-3">{comment}</p>

      {(foodRating !== null || packagingRating !== null) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f1f0eb]">
          {foodRating !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fef2f2] text-xs font-medium">
              <StarRating rating={foodRating} size="sm" colorByRating />
              <span style={{ color: foodRating <= 2 ? '#dc2626' : foodRating === 3 ? '#f59e0b' : '#16a34a' }}>
                Food {foodRating}
              </span>
            </span>
          )}
          {packagingRating !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fef2f2] text-xs font-medium">
              <StarRating rating={packagingRating} size="sm" colorByRating />
              <span style={{ color: packagingRating <= 2 ? '#dc2626' : packagingRating === 3 ? '#f59e0b' : '#16a34a' }}>
                Packaging {packagingRating}
              </span>
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export const ReviewCard: FC<ReviewCardProps> = ReviewCardComponent;