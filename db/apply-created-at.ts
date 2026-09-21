import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function apply() {
  console.log("Adding created_at columns...");
  
  await sql`ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;
  console.log("Added created_at to restaurants");
  
  await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;
  console.log("Added created_at to menu_items");
  
  console.log("Updating existing rows...");
  await sql`UPDATE restaurants SET created_at = NOW() - INTERVAL '90 days'`;
  
  await sql`UPDATE restaurants SET created_at = NOW() - INTERVAL '15 days' WHERE id IN (5, 7)`;
  console.log("Marked restaurants 5, 7 as new");
  
  await sql`UPDATE menu_items SET created_at = NOW() - INTERVAL '90 days'`;
  await sql`UPDATE menu_items SET created_at = NOW() - INTERVAL '10 days' WHERE id IN (1, 2, 25, 26, 27)`;
  console.log("Marked some menu items as new");
  
  // Verify
  const r = await sql`SELECT id, name, created_at FROM restaurants ORDER BY id`;
  console.table(r);
  
  const m = await sql`SELECT id, name, restaurant_id, created_at FROM menu_items ORDER BY id LIMIT 10`;
  console.table(m);
  
  console.log("Done!");
}

apply().catch((err) => {
  console.error(err);
  process.exit(1);
});