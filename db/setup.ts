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
  await sql(schema);
  console.log("Schema applied.");

  console.log("Seeding data...");
  // Insert restaurant
  const result = await sql("INSERT INTO restaurants (name, cuisine, area) VALUES (, , ) RETURNING id", ['Ludhiana Burrito', 'Indian', 'Sector 32']);
  const restaurantId = result[0].id;
  console.log("Created restaurant with id: " + restaurantId);

  // Insert reviews with specific created_at values
  await sql("INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES (, , , NOW() - INTERVAL '8 days')", [restaurantId, 5, 'Paneer burrito is unreal']);
  await sql("INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES (, , , NOW() - INTERVAL '6 days')", [restaurantId, 4, 'Good, but slow service']);
  await sql("INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES (, , , NOW() - INTERVAL '2 days')", [restaurantId, 4, 'Solid. Would repeat.']);
  console.log("Inserted 3 reviews.");

  console.log("Done!");
}

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});
