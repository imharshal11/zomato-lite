import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function applyMigration() {
  console.log("Applying migration...");
  await sql`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS image_url TEXT`;
  console.log("Done!");
  
  // Verify
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'restaurants'
  `;
  console.log("Restaurants table columns:");
  console.table(columns);
}

applyMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});