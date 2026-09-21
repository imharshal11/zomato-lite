import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface RestaurantRow {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  image_url: string | null;
  created_at: string;
}

export interface RestaurantCardData {
  id: number;
  name: string;
  cuisine: string;
  area: string;
  imageUrl: string | null;
  averageRating: number | null;
  totalReviews: number;
  createdAt: string;
}

export interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  is_veg: boolean;
  prep_time_minutes: number;
  image_url: string | null;
  created_at: string;
}

export async function getRestaurants(): Promise<RestaurantCardData[]> {
  const restaurants = await sql`
    SELECT id, name, cuisine, area, image_url, created_at
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
        createdAt: r.created_at,
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

export async function getMenuItems(restaurantId: number): Promise<MenuItem[]> {
  const items = await sql`
    SELECT id, restaurant_id, name, description, price, category, is_veg, prep_time_minutes, image_url, created_at
    FROM menu_items
    WHERE restaurant_id = ${restaurantId}
    ORDER BY category, name
  ` as MenuItem[];
  
  return items.map(item => ({
    ...item,
    price: Number(item.price),
  }));
}

export async function getMenuItemsGroupedByCategory(restaurantId: number): Promise<Record<string, MenuItem[]>> {
  const items = await getMenuItems(restaurantId);
  const grouped: Record<string, MenuItem[]> = {};
  
  for (const item of items) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  }
  
  return grouped;
}

export interface MenuItemWithRating extends MenuItem {
  averageRating: number | null;
  totalReviews: number;
}

export async function getMenuItemsWithRatings(restaurantId: number): Promise<MenuItemWithRating[]> {
  const items = await getMenuItems(restaurantId);
  
  const itemsWithRatings = await Promise.all(
    items.map(async (item) => {
      const reviews = await sql`
        SELECT rating FROM reviews WHERE menu_item_id = ${item.id}
      ` as { rating: number }[];
      
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? Math.round((reviews.reduce((sum, rv) => sum + rv.rating, 0) / totalReviews) * 10) / 10
        : null;
      
      return {
        ...item,
        averageRating,
        totalReviews,
      };
    })
  );
  
  return itemsWithRatings;
}

export async function getMenuItemsGroupedByCategoryWithRatings(restaurantId: number): Promise<Record<string, MenuItemWithRating[]>> {
  const items = await getMenuItemsWithRatings(restaurantId);
  const grouped: Record<string, MenuItemWithRating[]> = {};
  
  for (const item of items) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  }
  
  return grouped;
}