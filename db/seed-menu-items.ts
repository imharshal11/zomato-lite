import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function seedMenuItems() {
  // Get Burritos by Protein Chef restaurant
  const restaurant = await sql`
    SELECT id FROM restaurants WHERE name = 'Burritos by Protein Chef'
  `;
  
  if (restaurant.length === 0) {
    console.error("Restaurant not found");
    process.exit(1);
  }
  
  const restaurantId = restaurant[0].id;
  console.log(`Seeding menu items for restaurant ID: ${restaurantId}`);
  
  // Check if already seeded
  const existing = await sql`SELECT COUNT(*) FROM menu_items WHERE restaurant_id = ${restaurantId}`;
  if (existing[0].count > 0) {
    console.log("Menu items already seeded, skipping");
    return;
  }
  
  const menuItems = [
    // Bowls
    {
      name: 'Protein Power Bowl',
      description: 'Grilled chicken, quinoa, roasted veggies, avocado, tahini drizzle',
      price: 349.00,
      category: 'Bowls',
      is_veg: false,
      prep_time_minutes: 15,
      image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Protein+Bowl',
    },
    {
      name: 'Vegan Buddha Bowl',
      description: 'Tofu, brown rice, kale, sweet potato, hummus, seeds',
      price: 299.00,
      category: 'Bowls',
      is_veg: true,
      prep_time_minutes: 12,
      image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Buddha+Bowl',
    },
    // Wraps
    {
      name: 'Classic Chicken Burrito',
      description: 'Grilled chicken, cilantro lime rice, black beans, pico de gallo, chipotle crema',
      price: 249.00,
      category: 'Wraps',
      is_veg: false,
      prep_time_minutes: 10,
      image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Chicken+Burrito',
    },
    {
      name: 'Paneer Tikka Wrap',
      description: 'Marinated paneer, mint chutney, onions, bell peppers, whole wheat wrap',
      price: 229.00,
      category: 'Wraps',
      is_veg: true,
      prep_time_minutes: 10,
      image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Paneer+Wrap',
    },
    // Salads
    {
      name: 'Mexican Street Corn Salad',
      description: 'Grilled corn, cotija cheese, cilantro, lime, chili powder, mayo',
      price: 189.00,
      category: 'Salads',
      is_veg: true,
      prep_time_minutes: 8,
      image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Corn+Salad',
    },
    // Sides
    {
      name: 'Loaded Nachos',
      description: 'Tortilla chips, melted cheese, jalapeños, black beans, guac, sour cream',
      price: 199.00,
      category: 'Sides',
      is_veg: true,
      prep_time_minutes: 7,
      image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Nachos',
    },
    // Drinks
    {
      name: 'Cold Brew Coffee',
      description: 'Steeped 18 hours, served over ice',
      price: 99.00,
      category: 'Drinks',
      is_veg: true,
      prep_time_minutes: 2,
      image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Cold+Brew',
    },
    {
      name: 'Mango Lassi',
      description: 'Fresh mango, yogurt, cardamom, honey',
      price: 119.00,
      category: 'Drinks',
      is_veg: true,
      prep_time_minutes: 3,
      image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Mango+Lassi',
    },
  ];
  
  for (const item of menuItems) {
    await sql`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, prep_time_minutes, image_url)
      VALUES (${restaurantId}, ${item.name}, ${item.description}, ${item.price}, ${item.category}, ${item.is_veg}, ${item.prep_time_minutes}, ${item.image_url})
    `;
    console.log(`Inserted: ${item.name} (${item.category}) - ₹${item.price}`);
  }
  
  console.log("Menu items seeded successfully!");
}

seedMenuItems().catch((err) => {
  console.error(err);
  process.exit(1);
});