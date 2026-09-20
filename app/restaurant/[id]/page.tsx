import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Header,
  RestaurantHero,
  Card,
  StarRating,
  ReviewCard,
  StatusChip,
  Button,
  Footer,
} from '@/components';
import { getInitials, formatRelativeTime } from '@/lib/utils';

const sql = neon(process.env.DATABASE_URL!);

interface RestaurantRow {
  name: string;
  cuisine: string;
  area: string;
  image_url: string | null;
}

interface ReviewRow {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  recommends: boolean;
  food_rating: number | null;
  packaging_rating: number | null;
}

interface RestaurantData {
  name: string;
  cuisine: string;
  area: string;
  imageUrl: string | null;
  averageRating: number | null;
  totalReviews: number;
  latestReview: ReviewRow | null;
  reviews: ReviewRow[];
}

async function getRestaurantData(id: string): Promise<RestaurantData | null> {
  const restaurantId = parseInt(id, 10);
  if (!Number.isInteger(restaurantId) || restaurantId < 1) return null;

  const restaurant = await sql`
    SELECT name, cuisine, area, image_url FROM restaurants WHERE id = ${restaurantId}
  ` as RestaurantRow[];
  if (restaurant.length === 0) return null;

  const reviews = await sql`
    SELECT id, rating, comment, created_at, recommends, food_rating, packaging_rating
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
  ` as ReviewRow[];

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : null;

  const latestReview = totalReviews > 0 ? reviews[0] : null;
  const olderReviews = totalReviews > 1 ? reviews.slice(1) : [];

  return {
    name: restaurant[0].name,
    cuisine: restaurant[0].cuisine,
    area: restaurant[0].area,
    imageUrl: restaurant[0].image_url,
    averageRating,
    totalReviews,
    latestReview,
    reviews: olderReviews,
  };
}

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRestaurantData(id);

  if (!data) notFound();

  const initials = getInitials(data.name);
  const isOpen = true;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Zomato Lite" backHref="/restaurants" backLabel="Restaurants" homeLink />

      <main className="max-w-[560px] mx-auto px-4 pb-28 flex-1">
        <RestaurantHero
          initials={initials}
          name={data.name}
          cuisine={data.cuisine}
          area={data.area}
          isOpen={isOpen}
        />

        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">{data.name}</h1>
              <p className="mt-1 text-sm text-[#6b6b6b]">{data.cuisine} · {data.area}</p>
            </div>
            <StatusChip label={isOpen ? 'Open' : 'Closed'} status={isOpen ? 'open' : 'closed'} />
          </div>

          <div className="text-center py-2">
            <div className="text-4xl font-bold text-[#1a1a1a] tabular-nums leading-none">
              {data.averageRating ?? '—'}
            </div>
            <div className="mt-2">
              <StarRating rating={data.averageRating ?? 0} size="lg" showHalf />
            </div>
            <p className="mt-2 text-sm text-[#6b6b6b]">
              {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-3">
            {data.latestReview ? (
              <>
                <ReviewCard
                  rating={data.latestReview.rating}
                  comment={data.latestReview.comment}
                  createdAt={data.latestReview.created_at}
                  recommends={data.latestReview.recommends}
                  foodRating={data.latestReview.food_rating}
                  packagingRating={data.latestReview.packaging_rating}
                  isLatest
                />
                {data.reviews.length > 0 && (
                  <div className="space-y-3">
                    {data.reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        rating={review.rating}
                        comment={review.comment}
                        createdAt={review.created_at}
                        recommends={review.recommends}
                        foodRating={review.food_rating}
                        packagingRating={review.packaging_rating}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#6b6b6b] mb-4">No reviews yet</p>
                <Link href={`/review/${id}`}>
                  <Button>Be the first to review</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Footer cuisine={data.cuisine} area={data.area} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-[560px] mx-auto px-4 pb-4 pt-2 bg-gradient-to-t from-white to-transparent z-30">
        <Link href={`/review/${id}`}>
          <Button fullWidth size="lg">Write a Review</Button>
        </Link>
      </div>
    </div>
  );
}