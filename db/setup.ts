import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const sql = neon(process.env.DATABASE_URL!);

async function setup() {
  console.log("Reading schema...");
  const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf-8");
  
  console.log("Applying schema...");
  await sql.unsafe(schema);
  console.log("Schema applied.");

  console.log("Running migrations...");
  const migrationsDir = path.join(process.cwd(), "db");
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.startsWith("migrate-") && f.endsWith(".sql"))
    .sort();
  
  for (const file of migrationFiles) {
    const migration = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    await sql.unsafe(migration);
    console.log(`Applied migration: ${file}`);
  }
  console.log("Migrations done.");

  console.log("Seeding data...");
  // Insert restaurants with placeholder images (using cuisine-based color gradients)
  const restaurants = [
    { name: 'Burritos by Protein Chef', cuisine: 'Indian', area: 'BKC, Mumbai', image_url: 'https://placehold.co/400x300/e23744/ffffff?text=Indian' },
    { name: 'Bombay Bowl Co.', cuisine: 'Healthy Food', area: 'Bandra West', image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Bowls' },
    { name: 'Spice Route Kitchen', cuisine: 'North Indian', area: 'Andheri East', image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=North+Indian' },
    { name: 'Wok This Way', cuisine: 'Chinese', area: 'Powai', image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Chinese' },
    { name: 'The Curry Leaf', cuisine: 'South Indian', area: 'Chembur', image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=South+Indian' },
    { name: 'Slice & Dice Pizzeria', cuisine: 'Italian', area: 'BKC', image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Italian' },
  ];

  for (const r of restaurants) {
    const result = await sql`
      INSERT INTO restaurants (name, cuisine, area, image_url) 
      VALUES (${r.name}, ${r.cuisine}, ${r.area}, ${r.image_url})
      RETURNING id
    `;
    console.log(`Created restaurant: ${r.name} (id: ${result[0].id})`);
  }

  // Insert reviews for first restaurant only (Burritos by Protein Chef)
  const firstRestaurant = await sql`SELECT id FROM restaurants WHERE name = 'Burritos by Protein Chef'`;
  const restaurantId = firstRestaurant[0].id;

  await sql`INSERT INTO reviews (restaurant_id, rating, comment, recommends, created_at) VALUES (${restaurantId}, 5, 'Paneer burrito is unreal', true, NOW() - INTERVAL '8 days')`;
  await sql`INSERT INTO reviews (restaurant_id, rating, comment, recommends, created_at) VALUES (${restaurantId}, 4, 'Good, but slow service', false, NOW() - INTERVAL '6 days')`;
  await sql`INSERT INTO reviews (restaurant_id, rating, comment, recommends, created_at) VALUES (${restaurantId}, 4, 'Solid. Would repeat.', true, NOW() - INTERVAL '2 days')`;
  console.log("Inserted 3 reviews for Burritos by Protein Chef.");

  console.log("Done!");
}

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});