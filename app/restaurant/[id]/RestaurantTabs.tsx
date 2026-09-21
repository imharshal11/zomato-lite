'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import { MenuSectionClient } from './MenuSectionClient';
import { ReviewsSectionClient } from './ReviewsSectionClient';

interface MenuItemInfo {
  id: number;
  name: string;
  is_veg: boolean;
}

interface RestaurantTabsProps {
  menuItemsByCategory: Record<string, any[]>;
  restaurantId: number;
  data: {
    totalReviews: number;
    latestReview: {
      id: number;
      rating: number;
      comment: string;
      created_at: string;
      recommends: boolean;
      food_rating: number | null;
      packaging_rating: number | null;
      menu_item_id: number | null;
    } | null;
    reviews: {
      id: number;
      rating: number;
      comment: string;
      created_at: string;
      recommends: boolean;
      food_rating: number | null;
      packaging_rating: number | null;
      menu_item_id: number | null;
    }[];
    menuItemNames: Record<string, string>;
  };
  menuItemNamesObj: Record<string, string>;
  menuItems: MenuItemInfo[];
  id: string;
}

export function RestaurantTabs({
  menuItemsByCategory,
  restaurantId,
  data,
  menuItemNamesObj,
  menuItems,
  id
}: RestaurantTabsProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'all'>('menu');

  const tabs: Array<{ id: 'menu' | 'reviews' | 'all'; label: string; count: number }> = [
    { id: 'menu', label: 'Menu', count: Object.values(menuItemsByCategory).flat().length },
    { id: 'reviews', label: 'Reviews', count: data.totalReviews },
    { id: 'all', label: 'All', count: Object.values(menuItemsByCategory).flat().length + data.totalReviews },
  ];

  return (
    <div className="w-full min-w-0 box-border">
      {/* Tab Navigation */}
      <div className="flex w-full border-b border-[#f1f0eb] mt-4 mb-4" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium rounded-t-xl transition-all duration-150 border-b-2 -mb-px truncate ${
              activeTab === tab.id
                ? 'text-[#e23744] border-[#e23744] bg-[#fef2f2]'
                : 'text-[#6b6b6b] hover:text-[#e23744] hover:bg-[#fef2f2] border-transparent'
            }`}
          >
            <span className="truncate">{tab.label}</span>
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#e23744] text-white'
                : 'bg-[#f1f0eb] text-[#6b6b6b]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Panels - ONLY render active one */}
      {activeTab === 'menu' && (
        <TabPanel id="menu">
          <Suspense fallback={<div className="px-4 py-8 text-center text-[#6b6b6b]">Loading menu...</div>}>
            <MenuSectionClient
              menuItemsByCategory={menuItemsByCategory}
              restaurantId={restaurantId}
            />
          </Suspense>
        </TabPanel>
      )}

      {activeTab === 'reviews' && (
        <TabPanel id="reviews">
          <Suspense fallback={<div className="px-4 py-8 text-center text-[#6b6b6b]">Loading reviews...</div>}>
            <ReviewsSectionClient
              data={{ ...data, menuItemNames: menuItemNamesObj, menuItems }}
              restaurantId={id}
            />
          </Suspense>
        </TabPanel>
      )}

      {activeTab === 'all' && (
        <TabPanel id="all">
          <div className="space-y-8 w-full min-w-0">
            <section className="w-full min-w-0">
              <Suspense fallback={<div className="px-4 py-8 text-center text-[#6b6b6b]">Loading menu...</div>}>
                <MenuSectionClient
                  menuItemsByCategory={menuItemsByCategory}
                  restaurantId={restaurantId}
                />
              </Suspense>
            </section>
            <section className="pt-4 border-t border-[#f1f0eb] w-full min-w-0">
              <Suspense fallback={<div className="px-4 py-8 text-center text-[#6b6b6b]">Loading reviews...</div>}>
                <ReviewsSectionClient
                  data={{ ...data, menuItemNames: menuItemNamesObj, menuItems }}
                  restaurantId={id}
                />
              </Suspense>
            </section>
          </div>
        </TabPanel>
      )}
    </div>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className="animate-fade-in w-full min-w-0"
    >
      {children}
    </div>
  );
}