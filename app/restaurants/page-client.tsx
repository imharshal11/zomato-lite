'use client';

import { useState } from 'react';
import {
  Header,
  RestaurantCard,
  Chip,
  Card,
} from '@/components';

import type { RestaurantCardData } from '@/lib/restaurants';

const CATEGORIES = ['All', 'Bowls', 'Wraps', 'Salads', 'Sides', 'Drinks'];

export default function RestaurantsPageClient({ restaurants }: { restaurants: RestaurantCardData[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 0) return matchesSearch;
    
    const categoryCuisineMap: Record<string, string[]> = {
      Bowls: ['Healthy Food', 'Bowls'],
      Wraps: ['Indian', 'North Indian', 'Mexican'],
      Salads: ['Healthy Food', 'Salads'],
      Sides: ['Sides', 'Appetizers'],
      Drinks: ['Beverages', 'Drinks', 'Cafe'],
    };
    
    const mappedCuisines = categoryCuisineMap[CATEGORIES[activeCategory]] || [];
    const matchesCategory = mappedCuisines.some(c => 
      restaurant.cuisine.toLowerCase().includes(c.toLowerCase())
    );
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Zomato Lite" homeLink />

      <main className="max-w-[560px] mx-auto px-4 py-6 pb-8 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">All Restaurants</h1>
          <p className="mt-1 text-sm text-[#6b6b6b]">{filteredRestaurants.length} restaurants found</p>
        </div>

        <div className="mb-4">
          <label htmlFor="search-restaurants" className="sr-only">Search restaurants</label>
<input
            id="search-restaurants"
            type="search"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-full text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#e23744] focus:border-transparent transition-all duration-150 min-h-[44px]"
          />
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {CATEGORIES.map((category, index) => (
            <Chip
              key={category}
              variant={index === activeCategory ? 'active' : 'default'}
              aria-pressed={index === activeCategory}
              onClick={() => setActiveCategory(index)}
            >
              {category}
            </Chip>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-[#6b6b6b]">No restaurants match your search</p>
          </Card>
        )}
      </main>
    </div>
  );
}