import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const sql = neon(process.env.DATABASE_URL!);

const ACCENT = '#e23744';
const ACCENT_HOVER = '#c42d3a';
const ACCENT_LIGHT = '#fef2f2';
const ACCENT_LIGHT_BORDER = '#fecaca';

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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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

function StarRating({ rating, size = 'md', filledColor = ACCENT, emptyColor = '#d1d5db' }: { 
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
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2f2] text-sm font-semibold text-[#e23744]">
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

  const initials = getInitials(data.name);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#f1f0eb] shadow-sm">
        <div className="max-w-[560px] mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold text-[#e23744] tracking-tight">Zomato Lite</span>
        </div>
      </header>

      <main className="max-w-[560px] mx-auto px-4 pb-28">
        {/* Restaurant Banner/Hero */}
        <div className="rounded-t-2xl bg-gradient-to-br from-[#e23744] to-[#c42d3a] h-44 flex items-end px-6 pb-6">
          <span className="text-5xl font-bold text-white tracking-tight">{initials}</span>
        </div>

        {/* Restaurant Info Card */}
        <div className="bg-white rounded-b-2xl rounded-t-none border border-[#f1f0eb] border-t-0 shadow-sm">
          <div className="px-5 py-5">
            <h1 className="text-2xl font-semibold text-[#1a1a1a]">{data.name}</h1>
            <p className="mt-1 text-[#6b6b6b]">{data.cuisine} · {data.area}</p>
          </div>

          {/* Overall Rating Card */}
          <div className="mx-5 mb-5 bg-white rounded-xl border border-[#f1f0eb] shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <div className="bg-[#e23744] text-white rounded-xl px-4 py-2">
                  <span className="text-3xl font-bold tabular-nums">{data.averageRating ?? '—'}</span>
                </div>
                <div>
                  <StarRating rating={data.averageRating ?? 0} size="lg" filledColor={ACCENT} emptyColor="#ffd9cc" />
                  <span className="ml-2 text-sm text-[#6b6b6b]">
                    {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="px-5 pb-5">
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
              <div className="bg-white rounded-xl border border-[#f1f0eb] shadow-sm p-8 text-center">
                <p className="text-[#6b6b6b] mb-4">No reviews yet</p>
                <Link
                  href={`/review/${id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#e23744] text-white text-sm font-semibold rounded-xl hover:bg-[#c42d3a] transition-colors shadow-sm hover:shadow-md min-h-[44px]"
                >
                  Be the first to review
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Write Review Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[560px] mx-auto px-4 pb-4 pt-2 bg-gradient-to-t from-white to-transparent z-30">
        <Link
          href={`/review/${id}`}
          className="block w-full px-5 py-3.5 bg-[#e23744] text-white text-center font-semibold rounded-xl shadow-lg hover:bg-[#c42d3a] active:scale-[0.98] transition-all duration-150 min-h-[44px]"
        >
          Write a Review
        </Link>
      </div>
    </div>
  );
}