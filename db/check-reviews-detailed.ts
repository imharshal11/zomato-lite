import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function checkReviews() {
  // Check reviews for restaurants 1, 4, 5
  for (const id of [1, 4, 5]) {
    const reviews = await sql`
      SELECT id, rating, comment, created_at, recommends, food_rating, packaging_rating, menu_item_id
      FROM reviews
      WHERE restaurant_id = ${id}
      ORDER BY created_at DESC
    `;
    console.log(`\n=== Restaurant ${id} Reviews (${reviews.length}) ===`);
    console.table(reviews);
    
    // Also check menu items for this restaurant
    const menuItems = await sql`
      SELECT id, name FROM menu_items WHERE restaurant_id = ${id}
    `;
    console.log(`\n--- Restaurant ${id} Menu Items ---`);
    console.table(menuItems);
  }
}

checkReviews().catch((err) => {
  console.error(err);
  process.exit(1);
});