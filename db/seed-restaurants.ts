import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function seedRestaurants() {
  console.log("Checking existing restaurants...");
  const existing = await sql`SELECT name FROM restaurants`;
  const existingNames = new Set(existing.map(r => r.name));
  console.log(`Found ${existingNames.size} existing restaurants`);

  const restaurants = [
    { name: 'Burritos by Protein Chef', cuisine: 'Indian', area: 'BKC, Mumbai', image_url: 'https://placehold.co/400x300/e23744/ffffff?text=Indian' },
    { name: 'Bombay Bowl Co.', cuisine: 'Healthy Food', area: 'Bandra West', image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Bowls' },
    { name: 'Spice Route Kitchen', cuisine: 'North Indian', area: 'Andheri East', image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=North+Indian' },
    { name: 'Wok This Way', cuisine: 'Chinese', area: 'Powai', image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Chinese' },
    { name: 'The Curry Leaf', cuisine: 'South Indian', area: 'Chembur', image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=South+Indian' },
    { name: 'Slice & Dice Pizzeria', cuisine: 'Italian', area: 'BKC', image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Italian' },
  ];

  for (const r of restaurants) {
    if (existingNames.has(r.name)) {
      console.log(`Skipping existing: ${r.name}`);
      continue;
    }
    const result = await sql`
      INSERT INTO restaurants (name, cuisine, area, image_url) 
      VALUES (${r.name}, ${r.cuisine}, ${r.area}, ${r.image_url})
      RETURNING id
    `;
    console.log(`Created restaurant: ${r.name} (id: ${result[0].id})`);
  }

  console.log("Done!");
}

seedRestaurants().catch((err) => {
  console.error(err);
  process.exit(1);
});