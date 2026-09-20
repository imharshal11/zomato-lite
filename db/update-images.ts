import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function updateImages() {
  await sql`UPDATE restaurants SET image_url = 'https://placehold.co/400x300/e23744/ffffff?text=Indian' WHERE name = 'Burritos by Protein Chef'`;
  await sql`UPDATE restaurants SET image_url = 'https://placehold.co/400x300/e23744/ffffff?text=Indian' WHERE name = 'Ludhiana Burrito'`;
  console.log("Updated existing restaurants with images");
}

updateImages().catch((err) => {
  console.error(err);
  process.exit(1);
});