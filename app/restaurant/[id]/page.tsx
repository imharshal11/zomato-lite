import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RestaurantData {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
}

async function getRestaurantData(id: string): Promise<RestaurantData | null> {
  const restaurantId = parseInt(id, 10);
  if (!Number.isInteger(restaurantId) || restaurantId < 1) return null;

  const restaurant = await sql`
    SELECT name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  ` as RestaurantRow[];
  if (restaurant.length === 0) return null;

  const reviews = await sql`
    SELECT id, rating, comment, created_at
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
    averageRating,
    totalReviews,
    latestReview: latestReview ? {
      id: latestReview.id,
      rating: latestReview.rating,
      comment: latestReview.comment,
      createdAt: latestReview.created_at,
    } : null,
    reviews: olderReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
    })),
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-[#d4a843] text-lg">
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

function ReviewCard({ review, isLatest = false }: { review: Review; isLatest?: boolean }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article
      className={`p-6 rounded-xl border ${
        isLatest
          ? 'bg-[#fffbf0] border-[#d4a843] ring-1 ring-[#d4a843]'
          : 'bg-white border-[#e8e4dd]'
      }`}
    >
      {isLatest && (
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#b8860b]">
          <span className="relative">
            <span className="absolute -inset-1 bg-[#d4a843] rounded-full opacity-10"></span>
            Latest review
          </span>
        </div>
      )}
      <div className="flex items-baseline gap-3 mb-2">
        <StarRating rating={review.rating} />
        <time className="text-sm text-[#6b635a]">{date}</time>
      </div>
      <p className="text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">{review.comment}</p>
    </article>
  );
}

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRestaurantData(id);

  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <div className="max-w-[560px] mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-normal text-[#1a1a1a]">{data.name}</h1>
          <p className="mt-1 text-[#6b635a]">{data.cuisine} · {data.area}</p>
        </header>

        <section className="mb-10" aria-label="Overall rating">
          <div className="flex items-baseline gap-4">
            <div className="text-6xl font-light text-[#1a1a1a] tabular-nums">
              {data.averageRating ?? '—'}
            </div>
            <div>
              <StarRating rating={data.averageRating ?? 0} />
              <span className="ml-2 text-sm text-[#6b635a]">
                {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </section>

        <section aria-label="Reviews">
          {data.latestReview ? (
            <>
              <ReviewCard review={data.latestReview} isLatest />
              {data.reviews.length > 0 && (
                <div className="mt-8 space-y-4">
                  {data.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 border border-[#e8e4dd] rounded-xl bg-white">
              <p className="text-[#6b635a] mb-4">No reviews yet</p>
              <Link
                href={`/review/${id}`}
                className="inline-block text-sm font-medium text-[#d4a843] hover:underline"
              >
                Be the first to review
              </Link>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-[#e8e4dd]">
            <Link
              href={`/review/${id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#d4a843] hover:underline"
            >
              Write a review
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}