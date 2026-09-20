import { type FC } from 'react';
import Link from 'next/link';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  showDivider?: boolean;
}

export const Header: FC<HeaderProps> = ({
  title = 'Zomato Lite',
  subtitle,
  backHref,
  backLabel = 'Back',
  showDivider = true,
}) => (
  <header className={`sticky top-0 z-40 bg-white ${showDivider ? 'border-b border-[#f1f0eb]' : ''} shadow-sm`}>
    <div className="max-w-[560px] mx-auto px-4 py-3">
      {backHref ? (
        <Link
          href={backHref}
          className="flex items-center justify-between"
        >
          <span className="text-sm text-[#e23744] font-medium hover:underline">{backLabel}</span>
          <span className="text-xl font-bold text-[#e23744] tracking-tight">{title}</span>
        </Link>
      ) : subtitle ? (
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold text-[#e23744] tracking-tight">{title}</span>
          <span className="text-sm text-[#6b6b6b]">{subtitle}</span>
        </div>
      ) : (
        <span className="text-xl font-bold text-[#e23744] tracking-tight">{title}</span>
      )}
    </div>
  </header>
);