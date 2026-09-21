'use client';

import { useState, useMemo, useEffect } from 'react';
import { MenuItemWithRating } from '@/lib/restaurants';

type VegFilter = 'all' | 'veg' | 'nonveg';
type RatingFilter = 'all' | '1' | '2' | '3' | '4' | '5';

interface MenuFiltersProps {
  items: MenuItemWithRating[];
  renderItem: (item: MenuItemWithRating) => React.ReactNode;
}

export function MenuFilters({ items, renderItem }: MenuFiltersProps) {
  const [vegFilter, setVegFilter] = useState<VegFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');

  const filteredItems = useMemo(() => {
    const result = items.filter((item) => {
      const isVeg = Boolean(item.is_veg);
      const avgRating = item.averageRating !== null ? Number(item.averageRating) : null;

      if (vegFilter === 'veg' && !isVeg) return false;
      if (vegFilter === 'nonveg' && isVeg) return false;

      if (ratingFilter !== 'all') {
        const targetRating = parseInt(ratingFilter, 10);
        if (avgRating === null || Math.round(avgRating) !== targetRating) return false;
      }

      return true;
    });

    return result;
  }, [items, vegFilter, ratingFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full px-4">
        {/* Veg/Non-veg/All Toggle */}
        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm font-medium text-[#6b6b6b] whitespace-nowrap shrink-0">Diet:</label>
          <div className="flex gap-1 bg-[#f1f0eb] rounded-xl p-1 flex-1">
            <button
              onClick={() => setVegFilter('all')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-center ${
                vegFilter === 'all'
                  ? 'bg-white text-[#1a1a1a] shadow-sm'
                  : 'text-[#6b6b6b] hover:text-[#1a1a1a]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-center ${
                vegFilter === 'veg'
                  ? 'bg-[#16a34a] text-white shadow-sm'
                  : 'text-[#6b6b6b] hover:text-[#16a34a]'
              }`}
            >
              Veg
            </button>
            <button
              onClick={() => setVegFilter('nonveg')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-center ${
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
        <div className="flex items-center gap-3 shrink-0">
          <label className="text-sm font-medium text-[#6b6b6b] whitespace-nowrap shrink-0">Rating:</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as 'all' | '1' | '2' | '3' | '4' | '5')}
            className="w-full max-w-[160px] pl-3 pr-8 py-2 bg-white border border-[#e5e7eb] rounded-xl text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e23744] focus:border-transparent appearance-none bg-no-repeat bg-right"
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
      <p className="text-sm text-[#6b6b6b] px-4">
        {filteredItems.length} of {items.length} item{items.length !== 1 ? 's' : ''}
        {vegFilter !== 'all' || ratingFilter !== 'all' ? ' (filtered)' : ''}
      </p>

      {/* Items List */}
      <div className="space-y-3 px-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => renderItem(item))
        ) : (
          <div className="text-center py-8 text-[#6b6b6b]">
            No items match your filters
          </div>
        )}
      </div>
    </div>
  );
}