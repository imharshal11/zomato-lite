'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, loading = false, disabled, className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'bg-[#e23744] text-white shadow-sm shadow-[#e23744]/20 hover:bg-[#c42d3a] hover:shadow-[#e23744]/30 active:scale-[0.98] focus:ring-[#e23744]',
      secondary: 'bg-[#16a34a] text-white shadow-sm shadow-[#16a34a]/20 hover:bg-[#15803d] active:scale-[0.98] focus:ring-[#16a34a]',
      outline: 'bg-white text-[#e23744] border-2 border-[#e23744] hover:bg-[#fef2f2] active:scale-[0.98] focus:ring-[#e23744]',
      ghost: 'text-[#6b6b6b] hover:text-[#e23744] hover:bg-[#f1f0eb] active:scale-[0.98] focus:ring-[#e23744]',
    };
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm min-h-[36px] gap-1.5',
      md: 'px-4 py-2.5 text-base min-h-[44px] gap-2',
      lg: 'px-6 py-3.5 text-lg min-h-[52px] gap-2.5',
    };
    
    const widthStyles = fullWidth ? 'w-full' : '';
    
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';