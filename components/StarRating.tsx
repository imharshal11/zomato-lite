import { type FC } from 'react';
import { RATING_LABELS } from '@/lib/review-utils';

export interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  filledColor?: string;
  emptyColor?: string;
  showHalf?: boolean;
  ariaLabel?: string;
  colorByRating?: boolean;
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-lg',
  lg: 'text-2xl',
};

const RATING_COLORS = {
  low: '#dc2626',    // red for 1-2
  mid: '#f59e0b',    // amber for 3
  high: '#16a34a',   // green for 4-5
};

function getRatingColor(rating: number): string {
  if (rating <= 2) return RATING_COLORS.low;
  if (rating === 3) return RATING_COLORS.mid;
  return RATING_COLORS.high;
}

export const StarRating: FC<StarRatingProps> = ({
  rating,
  size = 'md',
  filledColor,
  emptyColor = '#d1d5db',
  showHalf = true,
  ariaLabel,
  colorByRating = true,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = showHalf && rating % 1 >= 0.5;
  const color = colorByRating ? getRatingColor(rating) : (filledColor ?? '#e23744');

  return (
    <span className="flex items-center gap-0.5 flex-shrink-0" aria-label={ariaLabel ?? `${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return (
            <span key={star} className={sizeClasses[size]} style={{ color }}>
              ★
            </span>
          );
        }
        if (star === fullStars + 1 && hasHalf) {
          return (
            <span key={star} className={sizeClasses[size]} style={{ color, opacity: 0.5 }}>
              ★
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
  sm: 'w-10 h-10 text-base',
  md: 'w-11 h-11 text-lg',
  lg: 'w-12 h-12 text-xl',
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
  const activeColor = displayRating ? getRatingColor(displayRating) : '#e23744';

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center w-full" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = rating !== null && star <= rating;
          const isHovered = hoverRating !== null && star <= hoverRating;
          const isActive = isFilled || isHovered;
          const starColor = isActive ? getRatingColor(star) : '#d1d5db';
          const borderColor = isActive ? getRatingColor(star) : '#e5e7eb';
          const bgColor = isActive ? `${starColor}15` : 'transparent'; // 10% opacity

          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={isFilled}
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => onHoverChange(star)}
              onMouseLeave={() => onHoverChange(null)}
              className={`flex items-center justify-center rounded-xl border-2 transition-all duration-150 flex-shrink-0 ${pickerSizes[size]}`}
              style={{
                color: starColor,
                borderColor,
                backgroundColor: isActive ? bgColor : 'transparent',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              ★
            </button>
          );
        })}
      </div>
      <p className="text-sm font-medium min-h-[1.25rem] text-center transition-colors duration-150" style={{ color: activeColor }}>
        {displayRating ? RATING_LABELS[displayRating] : 'Tap to rate'}
      </p>
    </div>
  );
};