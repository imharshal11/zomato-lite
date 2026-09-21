'use client';

import { MenuFilters } from '@/components/MenuFilters';
import { MenuItemCard } from '@/components/MenuItemCard';
import { MenuItemWithRating } from '@/lib/restaurants';

interface MenuSectionClientProps {
  menuItemsByCategory: Record<string, MenuItemWithRating[]>;
  restaurantId: number;
}

const categoryOrder = ['Bowls', 'Wraps', 'Salads', 'Sides', 'Drinks'];

export function MenuSectionClient({ menuItemsByCategory, restaurantId }: MenuSectionClientProps) {
  // Flatten all items for filtering
  const allItems = categoryOrder.flatMap(category => menuItemsByCategory[category] || []);

  const renderItem = (item: MenuItemWithRating) => (
    <MenuItemCard key={item.id} item={item} restaurantId={restaurantId} />
  );

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 px-4">Menu</h2>
      <MenuFilters
        items={allItems}
        renderItem={renderItem}
      />
    </div>
  );
}