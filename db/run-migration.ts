import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  console.log("Running migration: add recommends column to reviews...");
  
  const migration = fs.readFileSync(path.join(process.cwd(), "db", "migrate-add-recommends.sql"), "utf-8");
  
  await sql.unsafe(migration);
  
  console.log("Migration complete!");
  
  // Verify
  const result = await sql`SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'recommends'`;
  console.log("Verification:", result[0]);
}

runMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});