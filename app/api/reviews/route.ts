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

  const { restaurantId, rating, comment, recommends, foodRating, packagingRating, menuItemId } = body as {
    restaurantId?: number;
    rating?: number;
    comment?: string;
    recommends?: boolean;
    foodRating?: number;
    packagingRating?: number;
    menuItemId?: number;
  };

  if (rating === undefined || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be an integer from 1 to 5' }, { status: 400 });
  }

  if (foodRating !== undefined && (!Number.isInteger(foodRating) || foodRating < 1 || foodRating > 5)) {
    return NextResponse.json({ error: 'Food rating must be an integer from 1 to 5' }, { status: 400 });
  }

  if (packagingRating !== undefined && (!Number.isInteger(packagingRating) || packagingRating < 1 || packagingRating > 5)) {
    return NextResponse.json({ error: 'Packaging rating must be an integer from 1 to 5' }, { status: 400 });
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

  // Validate menuItemId belongs to the same restaurant if provided
  if (menuItemId !== undefined && menuItemId !== null) {
    if (!Number.isInteger(menuItemId) || menuItemId < 1) {
      return NextResponse.json({ error: 'Menu item ID must be a positive integer' }, { status: 400 });
    }
    const menuItem = await sql`SELECT id FROM menu_items WHERE id = ${menuItemId} AND restaurant_id = ${restaurantId}`;
    if (menuItem.length === 0) {
      return NextResponse.json({ error: 'Menu item not found for this restaurant' }, { status: 400 });
    }
  }

  const result = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment, recommends, food_rating, packaging_rating, menu_item_id)
    VALUES (${restaurantId}, ${rating}, ${trimmedComment}, ${recommends ?? false}, ${foodRating ?? null}, ${packagingRating ?? null}, ${menuItemId ?? null})
    RETURNING id
  `;

  return NextResponse.json({ success: true, reviewId: result[0].id }, { status: 201 });
}