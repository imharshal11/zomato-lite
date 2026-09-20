import { type FC } from 'react';

export interface FooterProps {
  cuisine: string;
  area: string;
}

export const Footer: FC<FooterProps> = ({ cuisine, area }) => (
  <footer className="mx-5 mt-8 pt-6 border-t border-[#f1f0eb]">
    <div className="space-y-2 text-sm text-[#6b6b6b] text-center">
      <p>{cuisine} · {area}</p>
      <p>Open now</p>
      <p>Shop 4, Ground Floor, {area}</p>
    </div>
    <div className="mt-8 pt-4 border-t border-[#f1f0eb] text-center">
      <p className="text-xs text-[#9ca3af]">Built by Harshal</p>
    </div>
  </footer>
);