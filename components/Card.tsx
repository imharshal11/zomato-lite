import { type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { StarRating } from './StarRating';
import { NewBadge } from './Chip';

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  bordered?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  bordered = true,
}) => (
  <div
    className={`
      bg-white rounded-2xl ${bordered ? 'border border-[#f1f0eb]' : ''} 
      shadow-sm ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
      ${paddingClasses[padding]} ${className}
    `}
  >
    {children}
  </div>
);

export interface RestaurantCardProps {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  imageUrl: string | null;
  averageRating: number | null;
  totalReviews: number;
  createdAt: string;
}

export const RestaurantCard: FC<RestaurantCardProps> = ({
  id,
  name,
  cuisine,
  area,
  imageUrl,
  averageRating,
  totalReviews,
  createdAt,
}) => {
  const displayImage = imageUrl || `https://placehold.co/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(name)}`;

  return (
    <Link
      href={`/restaurant/${id}`}
      className="group block bg-white rounded-2xl border border-[#f1f0eb] shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <div className="relative h-40 w-full bg-gradient-to-br from-gray-100 to-gray-200">
        <NewBadge createdAt={createdAt} size="sm" overlay />
        <img
          src={displayImage}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#1a1a1a] truncate group-hover:text-[#e23744] transition-colors">
          {name}
        </h3>
        <p className="mt-1 text-sm text-[#6b6b6b]">{cuisine} · {area}</p>
        <div className="mt-3 flex items-center gap-2">
          {averageRating !== null ? (
            <>
              <StarRating rating={averageRating} size="sm" colorByRating />
              <span className="text-sm font-semibold text-[#1a1a1a] tabular-nums">{averageRating}</span>
              <span className="text-sm text-[#9ca3af]">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
            </>
          ) : (
            <span className="text-sm text-[#9ca3af]">No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  );
};