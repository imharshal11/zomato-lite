'use client';

import { ReviewCard } from '@/components/ReviewCard';
import { ReviewFilters } from '@/components/ReviewFilters';

interface MenuItemInfo {
  id: number;
  name: string;
  is_veg: boolean;
}

interface ReviewsSectionClientProps {
  data: {
    totalReviews: number;
    latestReview: {
      id: number;
      rating: number;
      comment: string;
      created_at: string;
      recommends: boolean;
      food_rating: number | null;
      packaging_rating: number | null;
      menu_item_id: number | null;
    } | null;
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
    menuItems: MenuItemInfo[];
  };
  restaurantId: string;
}

export function ReviewsSectionClient({ data, restaurantId }: ReviewsSectionClientProps) {
  const getDishName = (menuItemId: number | null): string | null => {
    if (!menuItemId) return null;
    const name = data.menuItemNames[String(menuItemId)] || data.menuItemNames[menuItemId] || null;
    return name;
  };

  const menuItemVegMap: Record<string, boolean> = {};
  data.menuItems.forEach(item => {
    menuItemVegMap[String(item.id)] = item.is_veg;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 px-4">Reviews & Ratings</h2>
      {/* Filters */}
      <ReviewFilters
        reviews={data.reviews}
        menuItemNames={data.menuItemNames}
        menuItemVegMap={menuItemVegMap}
        getDishName={getDishName}
        renderReview={(review) => (
          <ReviewCard
            key={review.id}
            rating={review.rating}
            comment={review.comment}
            createdAt={review.created_at}
            recommends={review.recommends}
            foodRating={review.food_rating}
            packagingRating={review.packaging_rating}
            dishName={getDishName(review.menu_item_id)}
          />
        )}
      />
    </div>
  );
}