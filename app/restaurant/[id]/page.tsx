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
  recommends: boolean;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  recommends: boolean;
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
  const skipWords = new Set(['by', 'the', 'of', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);
  return name
    .split(' ')
    .filter((word) => !skipWords.has(word.toLowerCase()))
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function getRestaurantData(id: string): Promise<RestaurantData | null> {
  const restaurantId = parseInt(id, 10);
  if (!Number.isInteger(restaurantId) || restaurantId < 1) return null;

  const restaurant = await sql`
    SELECT name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  ` as RestaurantRow[];
  if (restaurant.length === 0) return null;

  const reviews = await sql`
    SELECT id, rating, comment, created_at, recommends
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
      recommends: latestReview.recommends,
    } : null,
    reviews: olderReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      recommends: r.recommends,
    })),
  };
}

function StarRating({ rating, size = 'md', filledColor = ACCENT, emptyColor = '#d1d5db', showHalf = true }: { 
  rating: number; 
  size?: 'sm' | 'md' | 'lg';
  filledColor?: string;
  emptyColor?: string;
  showHalf?: boolean;
}) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  const fullStars = Math.floor(rating);
  const hasHalf = showHalf && rating % 1 >= 0.5;
  
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return (
            <span key={star} className={sizes[size]} style={{ color: filledColor }}>
              ★
            </span>
          );
        }
        if (star === fullStars + 1 && hasHalf) {
          return (
            <span key={star} className={sizes[size]} style={{ color: filledColor }}>
              ½
            </span>
          );
        }
        return (
          <span key={star} className={sizes[size]} style={{ color: emptyColor }}>
            ☆
          </span>
        );
      })}
    </span>
  );
}

function ReviewCard({ review, isLatest = false }: { review: Review; isLatest?: boolean }) {
  const relativeTime = formatRelativeTime(review.createdAt);

  return (
    <article className="bg-white rounded-2xl border border-[#f1f0eb] shadow-sm hover:shadow-md transition-shadow duration-200 p-5 relative">
      {isLatest && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2f2] text-sm font-semibold text-[#e23744]">
          <span className="relative">Latest review</span>
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-2 flex-1 min-w-0">
          <StarRating rating={review.rating} size="md" />
          {review.recommends && (
            <span className="flex items-center gap-1 text-sm text-[#16a34a] whitespace-nowrap" aria-label="Recommended">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span>Recommended</span>
            </span>
          )}
        </div>
        <time className="text-xs text-[#9ca3af] whitespace-nowrap flex-shrink-0 ml-2" dateTime={review.createdAt}>
          {relativeTime}
        </time>
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
  // Hardcoded to true for now — replace with real hours logic later
  const isOpen = true;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#f1f0eb] shadow-sm">
        <div className="max-w-[560px] mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold text-[#e23744] tracking-tight">Zomato Lite</span>
        </div>
      </header>

      <main className="max-w-[560px] mx-auto px-4 pb-28 flex-1">
        {/* Restaurant Banner/Hero */}
        <div className="rounded-t-2xl bg-gradient-to-br from-[#e23744] to-[#c42d3a] h-44 flex items-end px-6 pb-6">
          <span className="text-5xl font-bold text-white tracking-tight">{initials}</span>
        </div>

        {/* Restaurant Info Card */}
        <div className="bg-white rounded-b-2xl rounded-t-none border border-[#f1f0eb] border-t-0 shadow-sm">
          <div className="px-5 py-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold text-[#1a1a1a] truncate">{data.name}</h1>
                <p className="mt-1 text-[#6b6b6b]">{data.cuisine} · {data.area}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                isOpen
                  ? 'bg-[#16a34a] text-white'
                  : 'bg-[#e23744] text-white'
              }`}>
                {isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Overall Rating Card */}
          <div className="mx-5 mb-5 bg-white rounded-xl border border-[#f1f0eb] shadow-sm p-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#1a1a1a] tabular-nums leading-none">
                {data.averageRating ?? '—'}
              </div>
              <div className="mt-2">
                <StarRating 
                  rating={data.averageRating ?? 0} 
                  size="lg" 
                  filledColor={ACCENT} 
                  emptyColor="#d1d5db"
                  showHalf
                />
              </div>
              <p className="mt-2 text-sm text-[#6b6b6b]">
                {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
              </p>
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
        
        {/* Static Info Footer */}
        <footer className="mx-5 mt-8 pt-6 border-t border-[#f1f0eb]">
          <div className="space-y-2 text-sm text-[#6b6b6b]">
            <p>{data.cuisine} · {data.area}</p>
            <p>Open now</p>
            <p>Shop 4, Ground Floor, {data.area}</p>
          </div>
          
          {/* Footer Credit */}
          <div className="mt-8 pt-4 border-t border-[#f1f0eb] text-center">
            <p className="text-xs text-[#9ca3af]">Built by Harshal</p>
          </div>
        </footer>
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