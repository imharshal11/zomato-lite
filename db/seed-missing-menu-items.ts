import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function seedMissingMenuItems() {
  // Ludhiana Burrito (ID: 2) - Indian cuisine
  const existing = await sql`SELECT COUNT(*) as count FROM menu_items WHERE restaurant_id = 2`;
  if (Number(existing[0].count) > 0) {
    console.log("Ludhiana Burrito already has menu items, skipping");
    return;
  }

  const menuItems = [
    // Bowls
    { name: 'Butter Chicken Bowl', description: 'Butter chicken with rice and naan', price: 349, category: 'Bowls', is_veg: false, prep_time_minutes: 20, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Butter+Chicken' },
    { name: 'Dal Makhani Bowl', description: 'Creamy black lentils with butter naan', price: 269, category: 'Bowls', is_veg: true, prep_time_minutes: 18, image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Dal+Makhani' },
    { name: 'Paneer Tikka Bowl', description: 'Grilled paneer tikka with rice and salad', price: 299, category: 'Bowls', is_veg: true, prep_time_minutes: 18, image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Paneer+Tikka' },
    { name: 'Chicken Biryani Bowl', description: 'Fragrant basmati rice with spiced chicken', price: 329, category: 'Bowls', is_veg: false, prep_time_minutes: 25, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Biryani' },
    // Wraps
    { name: 'Chicken Kathi Roll', description: 'Spiced chicken in roomali roti with mint chutney', price: 249, category: 'Wraps', is_veg: false, prep_time_minutes: 12, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Kathi+Roll' },
    { name: 'Paneer Kathi Roll', description: 'Grilled paneer with onions and mint chutney', price: 229, category: 'Wraps', is_veg: true, prep_time_minutes: 12, image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Paneer+Roll' },
    { name: 'Aloo Wrap', description: 'Spiced potatoes with onions and chutney', price: 189, category: 'Wraps', is_veg: true, prep_time_minutes: 10, image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Aloo+Wrap' },
  ];

  for (const item of menuItems) {
    await sql`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, prep_time_minutes, image_url)
      VALUES (2, ${item.name}, ${item.description}, ${item.price}, ${item.category}, ${item.is_veg}, ${item.prep_time_minutes}, ${item.image_url})
    `;
    console.log(`Inserted: ${item.name} (${item.category}) - ₹${item.price}`);
  }
  
  console.log("\nDone! Added 7 menu items for Ludhiana Burrito (ID: 2)");
}

seedMissingMenuItems().catch((err) => {
  console.error(err);
  process.exit(1);
});