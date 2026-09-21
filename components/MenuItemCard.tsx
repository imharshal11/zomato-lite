'use client';

import Link from 'next/link';
import { StarRating } from './StarRating';
import { MenuItemWithRating } from '@/lib/restaurants';
import { NewBadge } from './Chip';

interface MenuItemCardProps {
  item: MenuItemWithRating;
  restaurantId: number;
}

export function MenuItemCard({ item, restaurantId }: MenuItemCardProps) {
  const displayImage = item.image_url || `https://placehold.co/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(item.name)}`;

  const vegIndicator = item.is_veg ? (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded border-2 border-[#16a34a] bg-white" aria-label="Vegetarian">
      <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded border-2 border-[#8b4513] bg-white" aria-label="Non-vegetarian">
      <span className="w-2 h-2 rounded-full bg-[#8b4513]" />
    </span>
  );

  const ratingDisplay = item.averageRating !== null && item.totalReviews > 0 ? (
    <div className="flex items-center gap-1.5 mt-2 min-w-0">
      <StarRating rating={item.averageRating} size="sm" colorByRating />
      <span className="text-sm font-semibold tabular-nums flex-shrink-0" style={{ color: item.averageRating! <= 2 ? '#dc2626' : item.averageRating! === 3 ? '#f59e0b' : '#16a34a' }}>
        {item.averageRating}
      </span>
      <span className="text-sm text-[#9ca3af] truncate">({item.totalReviews})</span>
    </div>
  ) : (
    <span className="text-sm text-[#9ca3af] mt-2">No reviews yet</span>
  );

  return (
    <Link
      href={`/review/${restaurantId}?dish=${item.id}`}
      className="bg-white rounded-xl border border-[#f1f0eb] p-4 flex gap-3 hover:border-[#e23744] hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="relative h-20 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <NewBadge createdAt={item.created_at} size="sm" overlay />
        <img
          src={displayImage}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 min-w-0">
            <h4 className="font-semibold text-[#1a1a1a] truncate min-w-0">{item.name}</h4>
            <span className="flex-shrink-0">{vegIndicator}</span>
          </div>
          {item.description && (
            <p className="text-sm text-[#6b6b6b] line-clamp-2">{item.description}</p>
          )}
          <div className="mt-2">
            {ratingDisplay}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2 min-w-0">
          <span className="flex items-center gap-1 text-sm text-[#6b6b6b] truncate min-w-0">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item.prep_time_minutes} mins
          </span>
          <span className="text-lg font-bold text-[#1a1a1a] tabular-nums flex-shrink-0">₹{item.price.toFixed(0)}</span>
        </div>
      </div>
    </Link>
  );
}