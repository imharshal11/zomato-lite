import { neon } from '@neondatabase/serverless';
import {
  Header,
  RestaurantCard,
  Chip,
  Card,
  StarRating,
} from '@/components';
import { getRestaurants } from '@/lib/restaurants';

const CATEGORIES = ['Bowls', 'Wraps', 'Salads', 'Sides', 'Drinks'];

export default async function HomePage() {
  const restaurants = await getRestaurants();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Zomato Lite" subtitle="BKC, Mumbai" />

      <main className="max-w-[560px] mx-auto px-4 py-6 pb-8 flex-1">
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">Search restaurants</label>
          <input
            id="search"
            type="search"
            placeholder="What are you craving?"
            className="w-full px-4 py-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-full text-[#1a1a1a] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#e23744] focus:border-transparent transition-all duration-150"
            readOnly
          />
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {CATEGORIES.map((category, index) => (
            <Chip
              key={category}
              variant={index === 0 ? 'active' : 'default'}
              aria-pressed={index === 0}
            >
              {category}
            </Chip>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>

        {restaurants.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-[#6b6b6b]">No restaurants yet</p>
          </Card>
        )}
      </main>
    </div>
  );
}