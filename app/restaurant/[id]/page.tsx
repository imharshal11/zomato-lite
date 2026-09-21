import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  Header,
  RestaurantHero,
  Card,
  StarRating,
  ReviewCard,
  StatusChip,
  Button,
  Chip,
  KpiCard,
} from '@/components';
import { RestaurantTabs } from './RestaurantTabs';
import { MenuSectionClient } from './MenuSectionClient';
import { ReviewsSectionClient } from './ReviewsSectionClient';
import { getInitials } from '@/lib/utils';
import { getMenuItemsGroupedByCategoryWithRatings } from '@/lib/restaurants';

const sql = neon(process.env.DATABASE_URL!);

interface RestaurantRow {
  name: string;
  cuisine: string;
  area: string;
  image_url: string | null;
}

interface ReviewRow {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  recommends: boolean;
  food_rating: number | null;
  packaging_rating: number | null;
  menu_item_id: number | null;
}

interface MenuItemInfo {
  id: number;
  name: string;
  is_veg: boolean;
}

interface RestaurantData {
  name: string;
  cuisine: string;
  area: string;
  imageUrl: string | null;
  averageRating: number | null;
  totalReviews: number;
  latestReview: ReviewRow | null;
  reviews: ReviewRow[];
  menuItemNames: Map<number, string>;
}

async function getRestaurantData(id: string) {
  const restaurantId = parseInt(id, 10);
  if (!Number.isInteger(restaurantId) || restaurantId < 1) return null;

  const restaurant = await sql`
    SELECT name, cuisine, area, image_url FROM restaurants WHERE id = ${restaurantId}
  ` as RestaurantRow[];
  if (restaurant.length === 0) return null;

  const reviews = await sql`
    SELECT id, rating, comment, created_at, recommends, food_rating, packaging_rating, menu_item_id
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
  ` as ReviewRow[];

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : null;

  const menuItemIds = reviews
    .filter(r => r.menu_item_id !== null)
    .map(r => r.menu_item_id!);
  
  const menuItems = menuItemIds.length > 0 ? await sql`
    SELECT id, name, is_veg FROM menu_items WHERE id = ANY(${menuItemIds})
  ` as MenuItemInfo[] : [];
  
  const menuItemNames = new Map(menuItems.map(m => [m.id, m.name]));

  const latestReview = totalReviews > 0 ? reviews[0] : null;
  const olderReviews = totalReviews > 1 ? reviews.slice(1) : [];

  return {
    name: restaurant[0].name,
    cuisine: restaurant[0].cuisine,
    area: restaurant[0].area,
    imageUrl: restaurant[0].image_url,
    averageRating,
    totalReviews,
    latestReview,
    reviews: olderReviews,
    menuItemNames,
    menuItems,
  };
}

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getRestaurantData(id);
  const restaurantId = parseInt(id, 10);
  const menuItemsByCategory = await getMenuItemsGroupedByCategoryWithRatings(restaurantId);

  if (!data) notFound();

  // Convert Map to plain object with STRING keys for client component serialization
  const menuItemNamesObj: Record<string, string> = {};
  for (const [k, v] of data.menuItemNames) {
    menuItemNamesObj[String(k)] = v;
  }

  // Convert menuItems array to plain objects for client component serialization
  const menuItemsObj = data.menuItems.map(m => ({
    id: m.id,
    name: m.name,
    is_veg: m.is_veg,
  }));

  // Create data object with menuItemNames as Record<string, string> for client components
  const clientData = {
    ...data,
    menuItemNames: menuItemNamesObj,
  };

  const initials = getInitials(data.name);
  const isOpen = true;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Zomato Lite" backHref="/restaurants" backLabel="Restaurants" homeLink />

      <main className="max-w-[560px] mx-auto px-4 pb-28 flex-1">
        <RestaurantHero
          initials={initials}
          name={data.name}
          cuisine={data.cuisine}
          area={data.area}
          isOpen={isOpen}
        />

        {/* Header Info + KPI Card - Always visible above tabs */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">{data.name}</h1>
              <p className="mt-1 text-sm text-[#6b6b6b]">{data.cuisine} · {data.area}</p>
            </div>
            <StatusChip label={isOpen ? 'Open' : 'Closed'} status={isOpen ? 'open' : 'closed'} />
          </div>

          <KpiCard
            label="Overall"
            rating={data.averageRating}
            reviewCount={data.totalReviews}
            size="lg"
            variant="primary"
          />
        </Card>

        {/* RestaurantTabs handles tab state and panel rendering */}
        <RestaurantTabs
          menuItemsByCategory={menuItemsByCategory}
          restaurantId={restaurantId}
          data={clientData}
          menuItemNamesObj={menuItemNamesObj}
          menuItems={data.menuItems}
          id={id}
        />

      </main>

      {/* FAB - Write a Review - Always visible */}
      <Link
        href={`/review/${id}`}
        className="fixed bottom-6 right-4 z-40 sm:bottom-8 sm:right-6"
        aria-label="Write a review"
      >
        <button className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#e23744] text-white shadow-lg shadow-[#e23744]/40 flex items-center justify-center hover:bg-[#c42d3a] hover:shadow-xl hover:shadow-[#e23744]/50 active:scale-[0.95] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e23744] focus:ring-offset-2">
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </Link>
    </div>
  );
}