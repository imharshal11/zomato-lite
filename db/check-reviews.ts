import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function check() {
  const reviews = await sql`SELECT * FROM reviews ORDER BY restaurant_id, created_at`;
  console.table(reviews);
}

check().catch((err) => {
  console.error(err);
  process.exit(1);
});