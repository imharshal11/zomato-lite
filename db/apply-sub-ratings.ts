import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function applyMigration() {
  console.log("Applying sub-ratings migration...");
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS food_rating INTEGER CHECK (food_rating BETWEEN 1 AND 5)`;
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS packaging_rating INTEGER CHECK (packaging_rating BETWEEN 1 AND 5)`;
  console.log("Done!");
  
  // Verify
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'reviews'
  `;
  console.log("Reviews table columns:");
  console.table(columns);
}

applyMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});