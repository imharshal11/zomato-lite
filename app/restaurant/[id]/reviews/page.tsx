import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Header,
  Card,
  StarRating,
  ReviewCard,
  SubScorePill,
  Button,
  KpiCard,
} from '@/components';
import { getInitials } from '@/lib/utils';

const sql = neon(process.env.DATABASE_URL!);

interface RestaurantRow {
  name: string;
  cuisine: string;
  area: string;
}

interface ReviewRow {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  recommends: boolean;
  food_rating: number | null;
  packaging_rating: number | null;
  menu_item_id: number | null;
}

interface RestaurantData {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  avgFoodRating: number | null;
  avgPackagingRating: number | null;
  recommendRate: number | null;
  reviews: ReviewRow[];
  menuItemNames: Map<number, string>;
}

async function getRestaurantData(id: string): Promise<RestaurantData | null> {
  const restaurantId = parseInt(id, 10);
  if (!Number.isInteger(restaurantId) || restaurantId < 1) return null;

  const restaurant = await sql`
    SELECT name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  ` as RestaurantRow[];
  if (restaurant.length === 0) return null;

  const reviews = await sql`
    SELECT id, rating, comment, created_at, recommends, food_rating, packaging_rating, menu_item_id
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
  ` as ReviewRow[];

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : null;

  const recommendsCount = reviews.filter(r => r.recommends).length;
  const recommendRate = totalReviews > 0
    ? Math.round((recommendsCount / totalReviews) * 100)
    : null;

  const foodRatings = reviews.filter(r => r.food_rating !== null).map(r => r.food_rating!);
  const packagingRatings = reviews.filter(r => r.packaging_rating !== null).map(r => r.packaging_rating!);

  const avgFoodRating = foodRatings.length > 0
    ? Math.round((foodRatings.reduce((sum, r) => sum + r, 0) / foodRatings.length) * 10) / 10
    : null;
  const avgPackagingRating = packagingRatings.length > 0
    ? Math.round((packagingRatings.reduce((sum, r) => sum + r, 0) / packagingRatings.length) * 10) / 10
    : null;

  // Fetch menu item names for reviews that have menu_item_id
  const menuItemIds = reviews
    .filter(r => r.menu_item_id !== null)
    .map(r => r.menu_item_id!);
  
  const menuItems = menuItemIds.length > 0 ? await sql`
    SELECT id, name FROM menu_items WHERE id = ANY(${menuItemIds})
  ` as { id: number; name: string }[] : [];
  
  const menuItemNames = new Map(menuItems.map(m => [m.id, m.name]));

  return {
    name: restaurant[0].name,
    cuisine: restaurant[0].cuisine,
    area: restaurant[0].area,
    averageRating,
    totalReviews,
    avgFoodRating,
    avgPackagingRating,
    recommendRate,
    reviews,
    menuItemNames,
  };
}

export default async function ReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRestaurantData(id);

  if (!data) notFound();

  const initials = getInitials(data.name);
  const foodRatingCount = data.reviews.filter(r => r.food_rating !== null).length;
  const packagingRatingCount = data.reviews.filter(r => r.packaging_rating !== null).length;

  // Convert Map to plain object with STRING keys for client-side lookup
  const menuItemNamesObj: Record<string, string> = {};
  for (const [k, v] of data.menuItemNames) {
    menuItemNamesObj[String(k)] = v;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Zomato Lite" backHref={`/restaurant/${id}`} backLabel="Back to restaurant" homeLink />

      <main className="max-w-[560px] mx-auto px-4 py-6 pb-12 flex-1">
        {/* Restaurant name header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{data.name}</h1>
          <p className="mt-1 text-sm text-[#6b6b6b]">{data.cuisine} · {data.area}</p>
        </div>

        {/* Overall Score Block */}
        <KpiCard
          label="Overall"
          rating={data.averageRating}
          reviewCount={data.totalReviews}
          size="lg"
          variant="primary"
        >
          {data.recommendRate !== null && (
            <div className="pt-4 border-t border-[#f1f0eb] w-full">
              <p className="text-sm text-[#6b6b6b] text-center">
                <span className="font-semibold text-[#1a1a1a]">{data.recommendRate}%</span> of reviewers recommend this place
              </p>
            </div>
          )}
          <p className="text-xs text-[#9ca3af] mt-2 text-center">
            Average of all star ratings from verified reviews
          </p>
        </KpiCard>

        {/* Sub-score KPI Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <KpiCard
            label="Food"
            rating={data.avgFoodRating}
            reviewCount={foodRatingCount}
            size="md"
            variant="sub"
          />
          <KpiCard
            label="Packaging"
            rating={data.avgPackagingRating}
            reviewCount={packagingRatingCount}
            size="md"
            variant="sub"
          />
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {data.reviews.length > 0 ? (
            data.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                rating={review.rating}
                comment={review.comment}
                createdAt={review.created_at}
                recommends={review.recommends}
                foodRating={review.food_rating}
                packagingRating={review.packaging_rating}
                dishName={review.menu_item_id ? menuItemNamesObj[String(review.menu_item_id)] || null : null}
              />
            ))
          ) : (
            <Card className="text-center py-8">
              <p className="text-[#6b6b6b] mb-4">No reviews yet</p>
              <Link href={`/review/${id}`}>
                <Button>Be the first to review</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}