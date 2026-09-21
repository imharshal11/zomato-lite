import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function verify() {
  const results = await sql`
    SELECT r.id, r.name, COUNT(rv.id) as review_count, 
           ROUND(AVG(rv.rating)::numeric, 1) as avg_rating
    FROM restaurants r
    LEFT JOIN reviews rv ON rv.restaurant_id = r.id
    GROUP BY r.id, r.name
    ORDER BY r.id
  `;
  
  console.table(results);
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});