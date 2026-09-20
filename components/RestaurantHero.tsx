import { type FC } from 'react';

export interface RestaurantHeroProps {
  initials: string;
  name: string;
  cuisine: string;
  area: string;
  isOpen?: boolean;
}

export const RestaurantHero: FC<RestaurantHeroProps> = ({
  initials,
  name,
  cuisine,
  area,
  isOpen = true,
}) => (
  <div className="rounded-t-2xl bg-gradient-to-br from-[#e23744] to-[#c42d3a] h-44 flex items-end px-6 pb-6 mb-6">
    <span className="text-5xl font-bold text-white tracking-tight">{initials}</span>
  </div>
);