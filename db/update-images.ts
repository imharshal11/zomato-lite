import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function updateImages() {
  await sql`UPDATE restaurants SET image_url = '/restaurant-images/burritos-by-protein-chef.png' WHERE name = 'Burritos by Protein Chef'`;
  await sql`UPDATE restaurants SET image_url = '/restaurant-images/bombay-bowl-co.png' WHERE name = 'Bombay Bowl Co.'`;
  await sql`UPDATE restaurants SET image_url = '/restaurant-images/spice-route-kitchen.png' WHERE name = 'Spice Route Kitchen'`;
  await sql`UPDATE restaurants SET image_url = '/restaurant-images/wok-this-way.png' WHERE name = 'Wok This Way'`;
  await sql`UPDATE restaurants SET image_url = '/restaurant-images/the-curry-leaf.png' WHERE name = 'The Curry Leaf'`;
  await sql`UPDATE restaurants SET image_url = '/restaurant-images/slice-and-dice-pizzeria.png' WHERE name = 'Slice & Dice Pizzeria'`;
  await sql`UPDATE restaurants SET image_url = '/restaurant-images/ludhiana-burrito.png' WHERE name = 'Ludhiana Burrito'`;
  console.log("Updated all restaurants with new local images");
}

updateImages().catch((err) => {
  console.error(err);
  process.exit(1);
});