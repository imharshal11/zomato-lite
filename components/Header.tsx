import { type FC } from 'react';
import Link from 'next/link';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  showDivider?: boolean;
  homeLink?: boolean;
}

export const Header: FC<HeaderProps> = ({
  title = 'Zomato Lite',
  subtitle,
  backHref,
  backLabel = 'Back',
  showDivider = true,
  homeLink = false,
}) => (
  <header className={`sticky top-0 z-40 bg-white ${showDivider ? 'border-b border-[#f1f0eb]' : ''} shadow-sm`}>
    <div className="max-w-[560px] mx-auto px-4 py-3">
      {backHref ? (
        <Link
          href={backHref}
          className="flex items-center justify-between"
        >
          <span className="text-sm text-[#e23744] font-medium hover:underline">{backLabel}</span>
          {homeLink ? (
            <Link href="/" className="text-xl font-bold text-[#e23744] tracking-tight hover:opacity-80 transition-opacity">
              {title}
            </Link>
          ) : (
            <span className="text-xl font-bold text-[#e23744] tracking-tight">{title}</span>
          )}
        </Link>
      ) : homeLink ? (
        <Link href="/" className="flex flex-col gap-1">
          <span className="text-xl font-bold text-[#e23744] tracking-tight hover:opacity-80 transition-opacity">{title}</span>
          {subtitle && <span className="text-sm text-[#6b6b6b]">{subtitle}</span>}
        </Link>
      ) : subtitle ? (
        <div className="flex flex-col gap-1">
          {homeLink ? (
            <Link href="/" className="text-xl font-bold text-[#e23744] tracking-tight hover:opacity-80 transition-opacity">
              {title}
            </Link>
          ) : (
            <span className="text-xl font-bold text-[#e23744] tracking-tight">{title}</span>
          )}
          <span className="text-sm text-[#6b6b6b]">{subtitle}</span>
        </div>
      ) : homeLink ? (
        <Link href="/" className="text-xl font-bold text-[#e23744] tracking-tight hover:opacity-80 transition-opacity">
          {title}
        </Link>
      ) : (
        <span className="text-xl font-bold text-[#e23744] tracking-tight">{title}</span>
      )}
    </div>
  </header>
);