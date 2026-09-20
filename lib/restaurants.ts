import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface RestaurantRow {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  image_url: string | null;
}

export interface RestaurantCardData {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  imageUrl: string | null;
  averageRating: number | null;
  totalReviews: number;
}

export async function getRestaurants(): Promise<RestaurantCardData[]> {
  const restaurants = await sql`
    SELECT id, name, cuisine, area, image_url
    FROM restaurants
    ORDER BY name
  ` as RestaurantRow[];

  const results = await Promise.all(
    restaurants.map(async (r) => {
      const reviews = await sql`
        SELECT rating FROM reviews WHERE restaurant_id = ${r.id}
      ` as { rating: number }[];

      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? Math.round((reviews.reduce((sum, rv) => sum + rv.rating, 0) / totalReviews) * 10) / 10
        : null;

      return {
        id: r.id,
        name: r.name,
        cuisine: r.cuisine,
        area: r.area,
        imageUrl: r.image_url,
        averageRating,
        totalReviews,
      };
    })
  );

  return results;
}

export async function getRestaurantById(id: string) {
  const restaurantId = parseInt(id, 10);
  if (!Number.isInteger(restaurantId) || restaurantId < 1) return null;

  const restaurant = await sql`
    SELECT name, cuisine, area, image_url FROM restaurants WHERE id = ${restaurantId}
  ` as RestaurantRow[];
  if (restaurant.length === 0) return null;

  return restaurant[0];
}