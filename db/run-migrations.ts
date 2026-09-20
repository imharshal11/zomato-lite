import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const sql = neon(process.env.DATABASE_URL!);

async function runMigrations() {
  console.log("Running migrations...");
  const migrationsDir = path.join(process.cwd(), "db");
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.startsWith("migrate-") && f.endsWith(".sql"))
    .sort();
  
  for (const file of migrationFiles) {
    const migration = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    await sql.unsafe(migration);
    console.log(`Applied migration: ${file}`);
  }
  console.log("Migrations done.");
}

runMigrations().catch((err) => {
  console.error(err);
  process.exit(1);
});