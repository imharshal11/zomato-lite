import { type FC } from 'react';

export interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'active' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
  'aria-pressed'?: boolean;
}

const variantStyles = {
  default: 'bg-white text-[#6b6b6b] border border-[#e5e7eb] hover:border-[#e23744] hover:text-[#e23744] hover:bg-[#fef2f2]',
  active: 'bg-[#e23744] text-white shadow-sm shadow-[#e23744]/25',
  success: 'bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]',
  warning: 'bg-[#fef9c3] text-[#f59e0b] border border-[#fde68a]',
  error: 'bg-[#fef2f2] text-[#e23744] border border-[#fecaca]',
  outline: 'bg-transparent text-[#6b6b6b] border border-[#e5e7eb] hover:border-[#e23744] hover:text-[#e23744] hover:bg-[#fef2f2]',
};

const sizeStyles = {
  sm: 'px-2.5 py-1.5 text-xs min-h-[44px]',
  md: 'px-4 py-2.5 text-sm min-h-[44px]',
};

export const Chip: FC<ChipProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  'aria-pressed': ariaPressed,
}) => {
  const Component = onClick ? 'button' : 'span';
  const isInteractive = !!onClick;

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-150 whitespace-nowrap flex-shrink-0
        ${variantStyles[variant]} ${sizeStyles[size]}
        ${isInteractive ? 'cursor-pointer' : ''}
        ${className}
      `}
      aria-pressed={ariaPressed}
    >
      {children}
    </Component>
  );
};

export interface StatusChipProps {
  label: string;
  status: 'open' | 'closed' | 'busy';
  size?: 'sm' | 'md';
}

export const StatusChip: FC<StatusChipProps> = ({ label, status, size = 'md' }) => {
  const statusStyles = {
    open: 'bg-[#16a34a] text-white',
    closed: 'bg-[#e23744] text-white',
    busy: 'bg-[#f59e0b] text-white',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full whitespace-nowrap ${statusStyles[status]} ${sizeStyles[size]}`}>
      {label}
    </span>
  );
};

export interface NewBadgeProps {
  createdAt: string;
  daysThreshold?: number;
  size?: 'sm' | 'md';
  overlay?: boolean;
}

export const NewBadge: FC<NewBadgeProps> = ({ 
  createdAt, 
  daysThreshold = 30,
  size = 'sm',
  overlay = false
}) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays > daysThreshold) return null;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const baseClass = `inline-flex items-center font-semibold rounded-full bg-[#e23744] text-white ${sizeStyles[size]}`;
  
  if (overlay) {
    return (
      <span 
        className={`${baseClass} absolute bottom-2 left-2 z-10 shadow-lg`}
        aria-label={`New - added ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`}
      >
        New
      </span>
    );
  }

  return (
    <span 
      className={baseClass}
      aria-label={`New - added ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`}
    >
      New
    </span>
  );
};