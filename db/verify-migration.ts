import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function verify() {
  const result = await sql`SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'recommends'`;
  console.log("Column info:", result);
  
  const reviews = await sql`SELECT id, rating, comment, recommends FROM reviews`;
  console.log("Reviews:", reviews);
}

verify().catch(console.error);