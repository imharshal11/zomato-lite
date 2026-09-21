'use client';

import { useState, useMemo } from 'react';

type RatingFilter = 'all' | '1' | '2' | '3' | '4' | '5';
type VegFilter = 'all' | 'veg' | 'nonveg';

interface ReviewFiltersProps {
  reviews: {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    recommends: boolean;
    food_rating: number | null;
    packaging_rating: number | null;
    menu_item_id: number | null;
  }[];
  menuItemNames: Record<string, string>;
  menuItemVegMap: Record<string, boolean>;
  getDishName: (menuItemId: number | null) => string | null;
  renderReview: (review: {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    recommends: boolean;
    food_rating: number | null;
    packaging_rating: number | null;
    menu_item_id: number | null;
  }) => React.ReactNode;
}

export function ReviewFilters({ reviews, menuItemNames, menuItemVegMap, getDishName, renderReview }: ReviewFiltersProps) {
  const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');

  const filteredReviews = useMemo(() => {
    const result = reviews.filter((review) => {
      if (ratingFilter !== 'all') {
        const targetRating = parseInt(ratingFilter, 10);
        if (review.rating !== targetRating) return false;
      }

      if (vegFilter !== 'all') {
        const menuItemId = review.menu_item_id;
        if (!menuItemId) return false;

        const isVeg = menuItemVegMap[String(menuItemId)];
        if (isVeg === undefined) return false;

        if (vegFilter === 'veg' && !isVeg) return false;
        if (vegFilter === 'nonveg' && isVeg) return false;
      }

      return true;
    });

    return result;
  }, [reviews, ratingFilter, vegFilter, menuItemNames, menuItemVegMap]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Veg/Non-veg/All Toggle */}
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-sm font-medium text-[#6b6b6b] whitespace-nowrap">Diet:</span>
          <div className="flex gap-1 bg-[#f1f0eb] rounded-xl p-1">
            <button
              onClick={() => setVegFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                vegFilter === 'all'
                  ? 'bg-white text-[#1a1a1a] shadow-sm'
                  : 'text-[#6b6b6b] hover:text-[#1a1a1a]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                vegFilter === 'veg'
                  ? 'bg-[#16a34a] text-white shadow-sm'
                  : 'text-[#6b6b6b] hover:text-[#16a34a]'
              }`}
            >
              Veg
            </button>
            <button
              onClick={() => setVegFilter('nonveg')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                vegFilter === 'nonveg'
                  ? 'bg-[#8b4513] text-white shadow-sm'
                  : 'text-[#6b6b6b] hover:text-[#8b4513]'
              }`}
            >
              Non-veg
            </button>
          </div>
        </div>

        {/* Rating Filter - Exact Match */}
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-sm font-medium text-[#6b6b6b] whitespace-nowrap">Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as 'all' | '1' | '2' | '3' | '4' | '5')}
            className="flex-1 max-w-[160px] pl-3 pr-8 py-1.5 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e23744] focus:border-transparent appearance-none bg-no-repeat bg-right"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b6b6b%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E")',
              backgroundPosition: 'right 10px center',
              backgroundSize: '14px',
            }}
          >
            <option value="all">All ratings</option>
            <option value="1">1 star</option>
            <option value="2">2 stars</option>
            <option value="3">3 stars</option>
            <option value="4">4 stars</option>
            <option value="5">5 stars</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#6b6b6b]">
        {filteredReviews.length} of {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        {ratingFilter !== 'all' || vegFilter !== 'all' ? ' (filtered)' : ''}
      </p>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => renderReview(review))
        ) : (
          <div className="text-center py-8 text-[#6b6b6b]">
            No reviews match your filters
          </div>
        )}
      </div>
    </div>
  );
}