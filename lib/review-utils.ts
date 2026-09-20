const DYNAMIC_HEADINGS: Record<string, string> = {
  low: 'Not great',
  mid: 'It was okay',
  high: 'Loved it!',
};

export function getDynamicHeading(rating: number | null): string {
  if (rating === null) return 'Rate your order';
  if (rating <= 2) return DYNAMIC_HEADINGS.low;
  if (rating === 3) return DYNAMIC_HEADINGS.mid;
  return DYNAMIC_HEADINGS.high;
}

export function getPlaceholder(rating: number | null): string {
  if (rating === null) return 'Tell us about your experience...';
  if (rating <= 2) return 'Tell us what went wrong...';
  if (rating === 3) return 'Tell us what could be better...';
  return 'Tell us what you loved...';
}

export const RATING_LABELS: Record<number, string> = {
  1: 'Bad',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};