export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getInitials(name: string): string {
  const skipWords = new Set(['by', 'the', 'of', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for']);
  return name
    .split(' ')
    .filter((word) => !skipWords.has(word.toLowerCase()))
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}