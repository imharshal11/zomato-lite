import { getRestaurants } from '@/lib/restaurants';
import HomePageClient from './page-client';

export default async function HomePage() {
  const restaurants = await getRestaurants();
  return <HomePageClient restaurants={restaurants} />;
}