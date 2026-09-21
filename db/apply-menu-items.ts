import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function applyMigration() {
  console.log("Creating menu_items table...");
  await sql`
    CREATE TABLE IF NOT EXISTS menu_items (
      id                    SERIAL PRIMARY KEY,
      restaurant_id         INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
      name                  TEXT NOT NULL,
      description           TEXT,
      price                 NUMERIC(10,2) NOT NULL,
      category              TEXT NOT NULL CHECK (category IN ('Bowls', 'Wraps', 'Salads', 'Sides', 'Drinks')),
      is_veg                BOOLEAN NOT NULL DEFAULT FALSE,
      prep_time_minutes     INTEGER NOT NULL,
      image_url             TEXT,
      created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log("menu_items table created");
  
  console.log("Adding menu_item_id to reviews...");
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL`;
  console.log("menu_item_id column added");
  
  // Verify
  const tables = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log("Tables:");
  console.table(tables);
  
  const menuColumns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'menu_items'
  `;
  console.log("Menu items columns:");
  console.table(menuColumns);
  
  const reviewColumns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'reviews'
  `;
  console.log("Reviews columns:");
  console.table(reviewColumns);
}

applyMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});