import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { restaurantId, rating, comment, recommends } = body as {
    restaurantId?: number;
    rating?: number;
    comment?: string;
    recommends?: boolean;
  };

  if (rating === undefined || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be an integer from 1 to 5' }, { status: 400 });
  }

  const trimmedComment = typeof comment === 'string' ? comment.trim() : '';
  if (!trimmedComment) {
    return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
  }

  if (restaurantId === undefined || !Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json({ error: 'Restaurant ID must be a positive integer' }, { status: 400 });
  }

  const restaurant = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`;
  if (restaurant.length === 0) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 400 });
  }

  const result = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment, recommends)
    VALUES (${restaurantId}, ${rating}, ${trimmedComment}, ${recommends ?? false})
    RETURNING id
  `;

  return NextResponse.json({ success: true, reviewId: result[0].id }, { status: 201 });
}