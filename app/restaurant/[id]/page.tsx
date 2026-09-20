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

function StarRating({ rating, size = 'md', filledColor = '#e84d1f', emptyColor = '#d1d5db' }: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg';
  filledColor?: string;
  emptyColor?: string;
}) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={sizes[size]} style={{ color: star <= rating ? filledColor : emptyColor }}>
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
    <article className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
      {isLatest && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3f0] text-sm font-semibold text-[#e84d1f]">
          <span className="relative">Latest review</span>
        </div>
      )}
      <div className="flex items-baseline gap-3 mb-2">
        <StarRating rating={review.rating} size="md" />
        <time className="text-sm text-[#6b6b6b]">{date}</time>
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
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#f1f0eb] shadow-sm">
        <div className="max-w-[560px] mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold text-[#e84d1f] tracking-tight">Zomato Lite</span>
        </div>
      </header>

      <main className="max-w-[560px] mx-auto px-4 pb-28">
        {/* Restaurant Header */}
        <section className="py-6">
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">{data.name}</h1>
          <p className="mt-1 text-[#6b6b6b]">{data.cuisine} · {data.area}</p>
        </section>

        {/* Overall Rating Card */}
        <section className="mb-6" aria-label="Overall rating">
          <div className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <div className="bg-[#e84d1f] text-white rounded-xl px-4 py-2">
                  <span className="text-3xl font-bold tabular-nums">{data.averageRating ?? '—'}</span>
                </div>
                <div>
                  <StarRating rating={data.averageRating ?? 0} size="lg" filledColor="#e84d1f" emptyColor="#ffd9cc" />
                  <span className="ml-2 text-sm text-[#6b6b6b]">
                    {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section aria-label="Reviews">
          {data.latestReview ? (
            <>
              <ReviewCard review={data.latestReview} isLatest />
              {data.reviews.length > 0 && (
                <div className="mt-4 space-y-3">
                  {data.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm p-8 text-center">
              <p className="text-[#6b6b6b] mb-4">No reviews yet</p>
              <Link
                href={`/review/${id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e84d1f] text-white text-sm font-semibold rounded-xl hover:bg-[#d0421c] transition-colors shadow-sm hover:shadow-md"
              >
                Be the first to review
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Sticky Write Review Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[560px] mx-auto px-4 pb-4 pt-2 bg-gradient-to-t from-white to-transparent z-30">
        <Link
          href={`/review/${id}`}
          className="block w-full px-5 py-3.5 bg-[#e84d1f] text-white text-center font-semibold rounded-xl shadow-lg hover:bg-[#d0421c] active:scale-[0.98] transition-all duration-150"
        >
          Write a Review
        </Link>
      </div>
    </div>
  );
}