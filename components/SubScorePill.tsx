import { type FC } from 'react';
import { StarRating } from './StarRating';

export interface SubScorePillProps {
  label: string;
  rating: number | null;
  count: number;
}

export const SubScorePill: FC<SubScorePillProps> = ({ label, rating, count }) => {
  if (rating === null || count === 0) {
    return (
      <div className="flex flex-col items-center gap-1 px-4 py-3 bg-white border border-[#f1f0eb] rounded-xl">
        <span className="text-lg font-bold text-[#1a1a1a] tabular-nums">—</span>
        <span className="text-xs text-[#9ca3af] uppercase tracking-wide">{label}</span>
        <span className="text-xs text-[#9ca3af]">{count} rating{count !== 1 ? 's' : ''}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 bg-white border border-[#f1f0eb] rounded-xl">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[#1a1a1a] tabular-nums">{rating}</span>
        <StarRating rating={rating} size="sm" />
      </div>
      <span className="text-xs text-[#9ca3af] uppercase tracking-wide">{label}</span>
      <span className="text-xs text-[#9ca3af]">{count} rating{count !== 1 ? 's' : ''}</span>
    </div>
  );
};