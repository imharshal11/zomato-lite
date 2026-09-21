import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function backfillDishLinks() {
  // Get all reviews with NULL menu_item_id
  const reviews = await sql`
    SELECT r.id, r.restaurant_id, r.comment, r.menu_item_id
    FROM reviews r
    WHERE r.menu_item_id IS NULL
    ORDER BY r.restaurant_id, r.id
  `;

  console.log(`Found ${reviews.length} reviews with NULL menu_item_id`);

  // Get all menu items for matching
  const menuItems = await sql`
    SELECT id, name, restaurant_id FROM menu_items
  `;

  // Group menu items by restaurant
  const menuItemsByRestaurant = new Map<number, Array<{ id: number; name: string }>>();
  for (const item of menuItems) {
    if (!menuItemsByRestaurant.has(item.restaurant_id)) {
      menuItemsByRestaurant.set(item.restaurant_id, []);
    }
    menuItemsByRestaurant.get(item.restaurant_id)!.push({ id: item.id, name: item.name });
  }

  let updated = 0;
  let skipped = 0;

  for (const review of reviews) {
    const menuItems = menuItemsByRestaurant.get(review.restaurant_id) || [];
    
    // Try to match comment text to a dish name
    let matchedItem: { id: number; name: string } | null = null;
    const comment = review.comment.toLowerCase();
    
    for (const item of menuItems) {
      const dishName = item.name.toLowerCase();
      // Check if dish name appears in comment (substring match)
      if (comment.includes(dishName)) {
        matchedItem = item;
        break;
      }
      // Also try matching individual words from dish name
      const words = dishName.split(' ').filter(w => w.length > 3);
      if (words.some(w => comment.includes(w))) {
        matchedItem = item;
        break;
      }
    }

    if (matchedItem) {
      await sql`
        UPDATE reviews 
        SET menu_item_id = ${matchedItem.id}
        WHERE id = ${review.id}
      `;
      console.log(`✓ Review ${review.id} (restaurant ${review.restaurant_id}): "${review.comment.slice(0, 50)}..." -> ${matchedItem.name} (ID ${matchedItem.id})`);
      updated++;
    } else {
      console.log(`✗ Review ${review.id} (restaurant ${review.restaurant_id}): "${review.comment.slice(0, 50)}..." - NO MATCH`);
      skipped++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total reviews processed: ${reviews.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (no match): ${skipped}`);
}

backfillDishLinks().catch((err) => {
  console.error(err);
  process.exit(1);
});