import { type FC } from 'react';
import { StarRating } from './StarRating';

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

export interface KpiCardProps {
  label: string;
  rating: number | null;
  reviewCount: number;
  size?: 'lg' | 'md';
  variant?: 'primary' | 'sub';
  children?: React.ReactNode;
}

export const KpiCard: FC<KpiCardProps> = ({
  label,
  rating,
  reviewCount,
  size = 'lg',
  variant = 'primary',
  children,
}) => {
  const isPrimary = variant === 'primary';
  const displayRating = rating ?? 0;
  const accentColor = rating !== null ? getRatingColor(rating) : '#9ca3af';
  const hasRating = rating !== null && reviewCount > 0;

  const numberSize = isPrimary ? (size === 'lg' ? 'text-5xl' : 'text-4xl') : 'text-3xl';
  const starSize = isPrimary ? 'lg' : 'sm';
  const padding = isPrimary ? 'p-6' : 'p-4';
  const gap = isPrimary ? 'gap-3' : 'gap-2';

  return (
    <div
      className={`bg-white rounded-2xl border border-[#f1f0eb] shadow-sm ${padding} ${gap} transition-all duration-200 hover:shadow-md w-full box-border`}
      style={{
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Label - always visible, prominent */}
        <span className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wide mb-1">
          {label}
        </span>
        <div className="flex items-baseline justify-center gap-2">
          <span
            className={`${numberSize} font-bold tabular-nums leading-none`}
            style={{ color: hasRating ? '#1a1a1a' : '#9ca3af' }}
          >
            {hasRating ? rating?.toFixed(1) : '—'}
          </span>
          {hasRating && (
            <StarRating rating={displayRating} size={starSize} colorByRating showHalf />
          )}
        </div>
        <p className="text-sm text-[#6b6b6b] mt-1">
          {reviewCount} review{reviewCount !== 1 ? 's' : ''}
        </p>
        {children && <div className="mt-2 w-full">{children}</div>}
      </div>
    </div>
  );
};

export interface KpiCardGridProps {
  cards: Array<{
    label: string;
    rating: number | null;
    reviewCount: number;
    key: string;
  }>;
  columns?: 2 | 3;
}

export const KpiCardGrid: FC<KpiCardGridProps> = ({ cards, columns = 3 }) => (
  <div
    className={`grid gap-4 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
  >
    {cards.map(({ key, ...props }) => (
      <KpiCard key={key} {...props} variant="sub" />
    ))}
  </div>
);