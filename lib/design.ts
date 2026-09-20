export const COLORS = {
  brand: {
    primary: '#e23744',
    primaryHover: '#c42d3a',
    primaryLight: '#fef2f2',
    primaryBorder: '#fecaca',
  },
  success: {
    primary: '#16a34a',
    light: '#dcfce7',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f1f0eb',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b6b6b',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#1a1a1a',
  },
  white: '#ffffff',
  transparent: 'transparent',
} as const;

export const SPACING = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
} as const;

export const TYPOGRAPHY = {
  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  lineHeights: {
    tight: '1.1',
    normal: '1.5',
    relaxed: '1.625',
  },
} as const;

export const BORDER_RADIUS = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const TRANSITIONS = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
} as const;

export const CONTAINER_MAX_WIDTH = '560px';

export const HEADER_HEIGHT = '56px';