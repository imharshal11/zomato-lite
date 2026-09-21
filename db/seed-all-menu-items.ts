import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function seedMenuItems() {
  const restaurants = await sql`
    SELECT id, name, cuisine FROM restaurants ORDER BY id
  `;
  
  for (const r of restaurants) {
    const existing = await sql`SELECT COUNT(*) FROM menu_items WHERE restaurant_id = ${r.id}`;
    if (Number(existing[0].count) > 0) {
      console.log(`Skipping ${r.name} - already has ${existing[0].count} menu items`);
      continue;
    }
    
    let menuItems: any[] = [];
    
    switch (r.cuisine) {
      case 'Healthy Food': // Bombay Bowl Co.
        menuItems = [
          { name: 'Quinoa Power Bowl', description: 'Quinoa, kale, chickpeas, avocado, tahini lemon dressing', price: 329, category: 'Bowls', is_veg: true, prep_time_minutes: 12, image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Quinoa+Bowl' },
          { name: 'Greek Yogurt Parfait Bowl', description: 'Greek yogurt, granola, berries, honey, chia seeds', price: 249, category: 'Bowls', is_veg: true, prep_time_minutes: 5, image_url: 'https://placehold.co/400x300/16a34a/ffffff?text=Yogurt+Bowl' },
          { name: 'Grilled Chicken Wrap', description: 'Grilled chicken, hummus, mixed greens, tomato, whole wheat wrap', price: 279, category: 'Wraps', is_veg: false, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Chicken+Wrap' },
          { name: 'Falafel Wrap', description: 'Crispy falafel, tahini, pickled veggies, lettuce, whole wheat wrap', price: 259, category: 'Wraps', is_veg: true, prep_time_minutes: 7, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Falafel+Wrap' },
          { name: 'Mediterranean Quinoa Salad', description: 'Quinoa, cucumber, feta, olives, cherry tomatoes, lemon herb dressing', price: 219, category: 'Salads', is_veg: true, prep_time_minutes: 6, image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Quinoa+Salad' },
          { name: 'Sweet Potato Fries', description: 'Baked sweet potato fries with garlic aioli', price: 149, category: 'Sides', is_veg: true, prep_time_minutes: 10, image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Sweet+Potato+Fries' },
          { name: 'Green Detox Smoothie', description: 'Spinach, apple, ginger, lemon, coconut water', price: 139, category: 'Drinks', is_veg: true, prep_time_minutes: 3, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Green+Smoothie' },
          { name: 'Cold Pressed Orange Juice', description: 'Fresh cold-pressed orange juice', price: 119, category: 'Drinks', is_veg: true, prep_time_minutes: 2, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Orange+Juice' },
        ];
        break;
        
      case 'North Indian': // Spice Route Kitchen
        menuItems = [
          { name: 'Butter Chicken', description: 'Tender chicken in rich tomato butter gravy, served with naan', price: 349, category: 'Bowls', is_veg: false, prep_time_minutes: 18, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Butter+Chicken' },
          { name: 'Dal Makhani Bowl', description: 'Slow-cooked black lentils, butter, cream, served with jeera rice', price: 289, category: 'Bowls', is_veg: true, prep_time_minutes: 15, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Dal+Makhani' },
          { name: 'Chicken Tikka Roll', description: 'Tandoori chicken tikka, mint chutney, onions, roomali roti', price: 269, category: 'Wraps', is_veg: false, prep_time_minutes: 10, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Chicken+Tikka+Roll' },
          { name: 'Paneer Tikka Roll', description: 'Marinated paneer tikka, mint chutney, onions, roomali roti', price: 249, category: 'Wraps', is_veg: true, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Paneer+Tikka+Roll' },
          { name: 'Kachumber Salad', description: 'Cucumber, tomato, onion, cilantro, lemon, chaat masala', price: 129, category: 'Salads', is_veg: true, prep_time_minutes: 5, image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Kachumber' },
          { name: 'Garlic Naan', description: 'Tandoor-baked naan brushed with garlic butter', price: 79, category: 'Sides', is_veg: true, prep_time_minutes: 6, image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Garlic+Naan' },
          { name: 'Masala Chai', description: 'Strong tea with ginger, cardamom, cinnamon, milk', price: 69, category: 'Drinks', is_veg: true, prep_time_minutes: 4, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Masala+Chai' },
          { name: 'Sweet Lassi', description: 'Yogurt drink with sugar, cardamom, rose water', price: 99, category: 'Drinks', is_veg: true, prep_time_minutes: 3, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Sweet+Lassi' },
        ];
        break;
        
      case 'Chinese': // Wok This Way
        menuItems = [
          { name: 'Kung Pao Chicken Bowl', description: 'Diced chicken, peanuts, bell peppers, dried chilies, steamed rice', price: 319, category: 'Bowls', is_veg: false, prep_time_minutes: 12, image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Kung+Pao+Chicken' },
          { name: 'Mapo Tofu Bowl', description: 'Silken tofu, minced pork, fermented bean paste, Sichuan peppercorn, rice', price: 289, category: 'Bowls', is_veg: false, prep_time_minutes: 10, image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Mapo+Tofu' },
          { name: 'Vegetable Hakka Noodles', description: 'Stir-fried noodles, cabbage, carrots, bell peppers, soy sauce', price: 239, category: 'Wraps', is_veg: true, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Hakka+Noodles' },
          { name: 'Chilli Paneer Roll', description: 'Crispy paneer, bell peppers, onions, schezwan sauce, wrap', price: 259, category: 'Wraps', is_veg: true, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Chilli+Paneer+Roll' },
          { name: 'Asian Slaw', description: 'Shredded cabbage, carrots, sesame ginger dressing, peanuts', price: 149, category: 'Salads', is_veg: true, prep_time_minutes: 5, image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Asian+Slaw' },
          { name: 'Spring Rolls (4 pcs)', description: 'Crispy vegetable spring rolls with sweet chili sauce', price: 169, category: 'Sides', is_veg: true, prep_time_minutes: 7, image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Spring+Rolls' },
          { name: 'Jasmine Iced Tea', description: 'Cold brewed jasmine tea with honey', price: 89, category: 'Drinks', is_veg: true, prep_time_minutes: 2, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Jasmine+Tea' },
          { name: 'Lychee Cooler', description: 'Lychee syrup, soda, mint, lime', price: 109, category: 'Drinks', is_veg: true, prep_time_minutes: 3, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Lychee+Cooler' },
        ];
        break;
        
      case 'South Indian': // The Curry Leaf
        menuItems = [
          { name: 'Masala Dosa Bowl', description: 'Crispy dosa, potato masala, sambar, coconut chutney, tomato chutney', price: 269, category: 'Bowls', is_veg: true, prep_time_minutes: 12, image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Masala+Dosa' },
          { name: 'Idli Sambar Bowl', description: 'Steamed idlis (4), sambar, coconut chutney, gunpowder', price: 219, category: 'Bowls', is_veg: true, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Idli+Sambar' },
          { name: 'Chicken Chettinad Wrap', description: 'Spicy Chettinad chicken, curry leaves, onions, parotta wrap', price: 289, category: 'Wraps', is_veg: false, prep_time_minutes: 10, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Chettinad+Wrap' },
          { name: 'Uttapam Wrap', description: 'Thick uttapam, tomato-onion topping, coconut chutney, wrapped', price: 229, category: 'Wraps', is_veg: true, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Uttapam+Wrap' },
          { name: 'Carrot Coconut Salad', description: 'Grated carrot, coconut, mustard seeds, curry leaves, lemon', price: 119, category: 'Salads', is_veg: true, prep_time_minutes: 5, image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Carrot+Salad' },
          { name: 'Medu Vada (2 pcs)', description: 'Crispy urad dal vadas with sambar and chutney', price: 139, category: 'Sides', is_veg: true, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Medu+Vada' },
          { name: 'Filter Coffee', description: 'Traditional South Indian filter coffee with chicory', price: 79, category: 'Drinks', is_veg: true, prep_time_minutes: 4, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Filter+Coffee' },
          { name: 'Neer Mor', description: 'Spiced buttermilk with ginger, green chili, curry leaves', price: 69, category: 'Drinks', is_veg: true, prep_time_minutes: 2, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Neer+Mor' },
        ];
        break;
        
      case 'Italian': // Slice & Dice Pizzeria
        menuItems = [
          { name: 'Margherita Pizza Bowl', description: 'San Marzano tomatoes, fresh mozzarella, basil, olive oil, served over garlic rice', price: 329, category: 'Bowls', is_veg: true, prep_time_minutes: 15, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Margherita+Bowl' },
          { name: 'Pepperoni Pizza Bowl', description: 'Spicy pepperoni, mozzarella, tomato sauce, oregano, garlic rice', price: 359, category: 'Bowls', is_veg: false, prep_time_minutes: 15, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Pepperoni+Bowl' },
          { name: 'Chicken Pesto Wrap', description: 'Grilled chicken, basil pesto, mozzarella, sun-dried tomatoes, wrap', price: 299, category: 'Wraps', is_veg: false, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Chicken+Pesto+Wrap' },
          { name: 'Caprese Wrap', description: 'Fresh mozzarella, tomato, basil, balsamic glaze, wrap', price: 269, category: 'Wraps', is_veg: true, prep_time_minutes: 6, image_url: 'https://placehold.co/400x300/f59e0b/ffffff?text=Caprese+Wrap' },
          { name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, Caesar dressing, anchovies', price: 199, category: 'Salads', is_veg: false, prep_time_minutes: 5, image_url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Caesar+Salad' },
          { name: 'Garlic Bread Sticks', description: 'Baked bread sticks, garlic butter, herbs, marinara dip', price: 149, category: 'Sides', is_veg: true, prep_time_minutes: 8, image_url: 'https://placehold.co/400x300/ef4444/ffffff?text=Garlic+Bread' },
          { name: 'Italian Soda', description: 'Sparkling water, vanilla syrup, cream', price: 109, category: 'Drinks', is_veg: true, prep_time_minutes: 2, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Italian+Soda' },
          { name: 'Espresso', description: 'Double shot espresso', price: 89, category: 'Drinks', is_veg: true, prep_time_minutes: 2, image_url: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Espresso' },
        ];
        break;
    }
    
    if (menuItems.length === 0) continue;
    
    for (const item of menuItems) {
      await sql`
        INSERT INTO menu_items (restaurant_id, name, description, price, category, is_veg, prep_time_minutes, image_url)
        VALUES (${r.id}, ${item.name}, ${item.description}, ${item.price}, ${item.category}, ${item.is_veg}, ${item.prep_time_minutes}, ${item.image_url})
      `;
    }
    
    console.log(`Seeded ${menuItems.length} menu items for ${r.name} (${r.cuisine})`);
  }
  
  // Verify all restaurants
  const allRestaurants = await sql`
    SELECT r.name, r.cuisine, COUNT(mi.id) as dish_count
    FROM restaurants r
    LEFT JOIN menu_items mi ON mi.restaurant_id = r.id
    GROUP BY r.id, r.name, r.cuisine
    ORDER BY r.id
  `;
  
  console.log('\n=== FINAL MENU ITEM COUNTS ===');
  console.table(allRestaurants);
  
  console.log('Done!');
}

seedMenuItems().catch((err) => {
  console.error(err);
  process.exit(1);
});