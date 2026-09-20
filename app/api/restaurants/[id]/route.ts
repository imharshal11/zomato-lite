import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurantId = parseInt(id, 10);

  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json({ error: 'Invalid restaurant ID' }, { status: 400 });
  }

  const restaurant = await sql`
    SELECT name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  `;

  if (restaurant.length === 0) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
  }

  const reviews = await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
  `;

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : null;

  const latestReview = totalReviews > 0 ? reviews[0] : null;
  const olderReviews = totalReviews > 1 ? reviews.slice(1) : [];

  return NextResponse.json({
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
    reviews: olderReviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
    })),
  });
}