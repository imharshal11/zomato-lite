import { getRestaurants } from '@/lib/restaurants';
import RestaurantsPageClient from './page-client';

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();
  return <RestaurantsPageClient restaurants={restaurants} />;
}