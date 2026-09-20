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
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const ReviewCard: FC<ReviewCardProps> = ({
  rating,
  comment,
  createdAt,
  recommends = false,
  foodRating = null,
  packagingRating = null,
  isLatest = false,
}) => {
  const relativeTime = formatRelativeTime(createdAt);

  return (
    <article className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm hover:shadow-md transition-shadow duration-200 p-5 relative">
      {isLatest && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2f2] text-sm font-semibold text-[#e23744]">
          Latest review
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-2 flex-1 min-w-0">
          <StarRating rating={rating} size="md" />
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
          {relativeTime}
        </time>
      </div>
      <p className="text-[#1a1a1a] leading-relaxed whitespace-pre-wrap mb-3">{comment}</p>
      
      {(foodRating !== null || packagingRating !== null) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f1f0eb]">
          {foodRating !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fef2f2] text-[#e23744] text-xs font-medium">
              <span className="text-[10px]">★</span>
              <span>Food {foodRating}</span>
            </span>
          )}
          {packagingRating !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fef2f2] text-[#e23744] text-xs font-medium">
              <span className="text-[10px]">★</span>
              <span>Packaging {packagingRating}</span>
            </span>
          )}
        </div>
      )}
    </article>
  );
};