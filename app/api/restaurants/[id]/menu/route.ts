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

  const items = await sql`
    SELECT id, name, category, price
    FROM menu_items
    WHERE restaurant_id = ${restaurantId}
    ORDER BY category, name
  `;

  return NextResponse.json(items.map(item => ({
    ...item,
    price: Number(item.price),
  })));
}