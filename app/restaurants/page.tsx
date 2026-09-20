import { neon } from '@neondatabase/serverless';
import { Header, RestaurantCard, Card } from '@/components';
import { getRestaurants } from '@/lib/restaurants';

const sql = neon(process.env.DATABASE_URL!);

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Zomato Lite" />

      <main className="max-w-[560px] mx-auto px-4 py-6 pb-8 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">All Restaurants</h1>
          <p className="mt-1 text-sm text-[#6b6b6b]">{restaurants.length} restaurants found</p>
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