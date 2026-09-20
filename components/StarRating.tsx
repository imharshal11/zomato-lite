import { type FC } from 'react';
import { RATING_LABELS } from '@/lib/review-utils';

export interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  filledColor?: string;
  emptyColor?: string;
  showHalf?: boolean;
  ariaLabel?: string;
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-lg',
  lg: 'text-2xl',
};

export const StarRating: FC<StarRatingProps> = ({
  rating,
  size = 'md',
  filledColor = '#e23744',
  emptyColor = '#d1d5db',
  showHalf = true,
  ariaLabel,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = showHalf && rating % 1 >= 0.5;

  return (
    <span className="flex items-center gap-0.5" aria-label={ariaLabel ?? `${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return (
            <span key={star} className={sizeClasses[size]} style={{ color: filledColor }}>
              ★
            </span>
          );
        }
        if (star === fullStars + 1 && hasHalf) {
          return (
            <span key={star} className={sizeClasses[size]} style={{ color: filledColor }}>
              ½
            </span>
          );
        }
        return (
          <span key={star} className={sizeClasses[size]} style={{ color: emptyColor }}>
            ☆
          </span>
        );
      })}
    </span>
  );
};

export interface StarPickerProps {
  rating: number | null;
  onRatingChange: (r: number) => void;
  onHoverChange: (r: number | null) => void;
  hoverRating: number | null;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const pickerSizes = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-2xl',
};

export const StarPicker: FC<StarPickerProps> = ({
  rating,
  onRatingChange,
  onHoverChange,
  hoverRating,
  label,
  size = 'lg',
}) => {
  const displayRating = hoverRating ?? rating;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = rating !== null && star <= rating;
          const isHovered = hoverRating !== null && star <= hoverRating;
          const isActive = isFilled || isHovered;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={isFilled}
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => onHoverChange(star)}
              onMouseLeave={() => onHoverChange(null)}
              className={`flex items-center justify-center rounded-xl border-2 transition-all duration-150 ${
                isActive
                  ? 'bg-[#fef2f2] border-[#e23744] text-[#e23744] shadow-sm shadow-[#e23744]/10 scale-105'
                  : 'border-[#e5e7eb] text-[#d1d5db] hover:border-[#e23744] hover:text-[#e23744] hover:bg-[#fef2f2] hover:scale-105'
              } ${pickerSizes[size]}`}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              ★
            </button>
          );
        })}
      </div>
      <p className="text-sm font-medium text-[#e23744] min-h-[1.25rem] transition-colors duration-150">
        {displayRating ? RATING_LABELS[displayRating] : 'Tap to rate'}
      </p>
    </div>
  );
};