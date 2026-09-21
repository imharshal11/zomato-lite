import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function auditRestaurants() {
  const restaurants = await sql`
    SELECT id, name, cuisine, area FROM restaurants ORDER BY id
  `;
  
  console.log("=== RESTAURANT AUDIT ===");
  for (const r of restaurants) {
    const menuCount = await sql`
      SELECT COUNT(*) as count FROM menu_items WHERE restaurant_id = ${r.id}
    `;
    const reviewCount = await sql`
      SELECT COUNT(*) as count FROM reviews WHERE restaurant_id = ${r.id}
    `;
    
    console.log(`\n${r.name} (ID: ${r.id})`);
    console.log(`  Cuisine: ${r.cuisine}, Area: ${r.area}`);
    console.log(`  Menu items: ${menuCount[0].count}`);
    console.log(`  Reviews: ${reviewCount[0].count}`);
  }
}

auditRestaurants().catch((err) => {
  console.error(err);
  process.exit(1);
});