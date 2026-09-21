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
      <div className="flex items-center justify-between gap-4">
        {/* Back link (left side) */}
        {backHref ? (
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-sm text-[#e23744] font-medium hover:underline whitespace-nowrap flex-shrink-0 min-h-[44px] px-2"
          >
            ← {backLabel}
          </Link>
        ) : (
          <span className="w-12 flex-shrink-0" aria-hidden="true" />
        )}

        {/* Title / Home link (center) */}
        {homeLink ? (
          <Link href="/" className="flex flex-col items-center gap-0.5 flex-1 text-center min-w-0">
            <span className="text-xl font-bold text-[#e23744] tracking-tight hover:opacity-80 transition-opacity truncate">
              {title}
            </span>
            {subtitle && <span className="text-sm text-[#6b6b6b] truncate">{subtitle}</span>}
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-0.5 flex-1 text-center min-w-0">
            <span className="text-xl font-bold text-[#e23744] tracking-tight truncate">{title}</span>
            {subtitle && <span className="text-sm text-[#6b6b6b] truncate">{subtitle}</span>}
          </div>
        )}

        {/* Spacer for alignment (right side) */}
        <span className="w-12 flex-shrink-0" aria-hidden="true" />
      </div>
    </div>
  </header>
);