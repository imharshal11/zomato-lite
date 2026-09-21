import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function seedVariedReviews() {
  // Get restaurants 3-7
  const restaurants = await sql`
    SELECT id, name FROM restaurants 
    WHERE id BETWEEN 3 AND 7 
    ORDER BY id
  `;
  
  console.log("Restaurants to seed reviews for:");
  console.table(restaurants);

  const reviewsByRestaurant: Record<number, Array<{
    rating: number;
    comment: string;
    recommends: boolean;
    foodRating?: number | null;
    packagingRating?: number | null;
    daysAgo: number;
  }>> = {
    3: [], // Bombay Bowl Co. - ZERO reviews intentionally
    4: [ // Spice Route Kitchen
      { rating: 5, comment: 'Butter chicken was incredible, best I\'ve had in Mumbai', recommends: true, foodRating: 5, packagingRating: 4, daysAgo: 2 },
      { rating: 4, comment: 'Good food but delivery took longer than expected', recommends: true, foodRating: 4, packagingRating: 3, daysAgo: 5 },
      { rating: 4, comment: 'Dal makhani was rich and flavorful, naan was fresh', recommends: true, foodRating: 4, packagingRating: 4, daysAgo: 12 },
      { rating: 3, comment: 'Decent but not exceptional. Chicken tikka roll was average', recommends: false, foodRating: 3, packagingRating: 3, daysAgo: 18 },
      { rating: 5, comment: 'Amazing! Every dish packed with authentic flavors', recommends: true, foodRating: 5, packagingRating: 5, daysAgo: 25 },
    ],
    5: [ // Wok This Way
      { rating: 4, comment: 'Kung Pao chicken had great wok hei, peanuts were crunchy', recommends: true, foodRating: 4, packagingRating: 4, daysAgo: 1 },
      { rating: 3, comment: 'Mapo tofu was okay but could use more Sichuan peppercorn', recommends: false, foodRating: 3, packagingRating: 3, daysAgo: 4 },
      { rating: 2, comment: 'Spring rolls were soggy and cold by the time they arrived', recommends: false, foodRating: 2, packagingRating: 2, daysAgo: 8 },
      { rating: 4, comment: 'Hakka noodles perfectly cooked, good portion size', recommends: true, foodRating: 4, packagingRating: 4, daysAgo: 14 },
      { rating: 5, comment: 'Best Chinese takeout in the area! Lychee cooler was refreshing', recommends: true, foodRating: 5, packagingRating: 5, daysAgo: 20 },
      { rating: 3, comment: 'Chilli paneer roll was decent but a bit greasy', recommends: false, foodRating: 3, packagingRating: 3, daysAgo: 28 },
    ],
    6: [ // The Curry Leaf
      { rating: 5, comment: 'Masala dosa was crispy, sambar had perfect tang', recommends: true, foodRating: 5, packagingRating: 4, daysAgo: 3 },
      { rating: 4, comment: 'Idli sambar combo was comforting, chutneys were fresh', recommends: true, foodRating: 4, packagingRating: 4, daysAgo: 7 },
      { rating: 4, comment: 'Chicken Chettinad wrap packed with flavor, parotta was soft', recommends: true, foodRating: 4, packagingRating: 3, daysAgo: 11 },
      { rating: 2, comment: 'Uttapam wrap fell apart, filling was sparse', recommends: false, foodRating: 2, packagingRating: 2, daysAgo: 15 },
      { rating: 3, comment: 'Filter coffee good but medu vada was a bit dense', recommends: true, foodRating: 3, packagingRating: 3, daysAgo: 22 },
    ],
    7: [ // Slice & Dice Pizzeria
      { rating: 5, comment: 'Margherita pizza bowl - tomatoes so fresh, mozzarella perfect', recommends: true, foodRating: 5, packagingRating: 5, daysAgo: 2 },
      { rating: 4, comment: 'Pepperoni bowl had great spice level, crust was chewy', recommends: true, foodRating: 4, packagingRating: 4, daysAgo: 6 },
      { rating: 3, comment: 'Caesar salad decent but dressing was too heavy', recommends: false, foodRating: 3, packagingRating: 3, daysAgo: 10 },
      { rating: 4, comment: 'Chicken pesto wrap - pesto was vibrant, chicken tender', recommends: true, foodRating: 4, packagingRating: 4, daysAgo: 18 },
      { rating: 5, comment: 'Best pizza bowls in town! Garlic bread sticks amazing too', recommends: true, foodRating: 5, packagingRating: 5, daysAgo: 24 },
      { rating: 2, comment: 'Caprese wrap had wilted basil, mozzarella wasn\'t fresh', recommends: false, foodRating: 2, packagingRating: 2, daysAgo: 30 },
    ],
  };

  for (const restaurant of restaurants) {
    const reviews = reviewsByRestaurant[restaurant.id] || [];
    
    if (reviews.length === 0) {
      console.log(`\n${restaurant.name} (ID: ${restaurant.id}): Keeping at 0 reviews`);
      continue;
    }
    
    console.log(`\nSeeding ${reviews.length} reviews for ${restaurant.name} (ID: ${restaurant.id}):`);
    
    for (const review of reviews) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - review.daysAgo);
      
      await sql`
        INSERT INTO reviews (restaurant_id, rating, comment, recommends, food_rating, packaging_rating, created_at)
        VALUES (${restaurant.id}, ${review.rating}, ${review.comment}, ${review.recommends}, ${review.foodRating ?? null}, ${review.packagingRating ?? null}, ${createdAt.toISOString()})
      `;
      
      const ratingColor = review.rating <= 2 ? '🔴' : review.rating === 3 ? '🟡' : '🟢';
      console.log(`  ${ratingColor} ${review.rating}/5 - "${review.comment.slice(0, 50)}..."`);
    }
  }
  
  // Final verification
  const finalCounts = await sql`
    SELECT r.id, r.name, COUNT(rv.id) as review_count,
           ROUND(AVG(rv.rating)::numeric, 1) as avg_rating
    FROM restaurants r
    LEFT JOIN reviews rv ON rv.restaurant_id = r.id
    GROUP BY r.id, r.name
    ORDER BY r.id
  `;
  
  console.log('\n=== FINAL REVIEW COUNTS ===');
  console.table(finalCounts);
  
  console.log('\nDone!');
}

seedVariedReviews().catch((err) => {
  console.error(err);
  process.exit(1);
});