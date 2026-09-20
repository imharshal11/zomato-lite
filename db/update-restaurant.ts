import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function updateRestaurant() {
  console.log("Updating restaurant name and area...");
  
  const result = await sql`
    UPDATE restaurants 
    SET name = 'Burritos by Protein Chef', area = 'BKC, Mumbai'
    WHERE id = 1
    RETURNING id, name, cuisine, area
  `;
  
  if (result.length > 0) {
    console.log("Updated restaurant:", result[0]);
  } else {
    console.log("No restaurant with id=1 found");
  }
  
  console.log("Done!");
}

updateRestaurant().catch((err) => {
  console.error(err);
  process.exit(1);
});