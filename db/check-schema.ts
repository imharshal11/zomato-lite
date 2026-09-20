import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function checkSchema() {
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'restaurants'
  `;
  console.log("Restaurants table columns:");
  console.table(columns);
  
  const restaurants = await sql`SELECT * FROM restaurants`;
  console.log("Restaurants:");
  console.table(restaurants);
}

checkSchema().catch((err) => {
  console.error(err);
  process.exit(1);
});