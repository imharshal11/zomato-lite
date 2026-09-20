require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const sql = neon(process.env.DATABASE_URL);

async function setup() {
  console.log('Reading schema...');
  const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf-8');
  
  console.log('Applying schema...');
  // Split schema into individual statements and execute each with query()
  const statements = schema.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log('Schema applied.');
  
  console.log('Seeding data...');
  // Insert restaurant using tagged template
  const result = await sql`INSERT INTO restaurants (name, cuisine, area) VALUES ('Ludhiana Burrito', 'Indian', 'Sector 32') RETURNING id`;
  const restaurantId = result[0].id;
  console.log('Created restaurant with id: ' + restaurantId);

  // Insert reviews with specific created_at values
  await sql`INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES (${restaurantId}, 5, 'Paneer burrito is unreal', NOW() - INTERVAL '8 days')`;
  await sql`INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES (${restaurantId}, 4, 'Good, but slow service', NOW() - INTERVAL '6 days')`;
  await sql`INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES (${restaurantId}, 4, 'Solid. Would repeat.', NOW() - INTERVAL '2 days')`;
  console.log('Inserted 3 reviews.');

  console.log('Done!');
}

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});