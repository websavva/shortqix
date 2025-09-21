import { formatTimeAgoIntl } from '@vueuse/core';

export function timeAgo(
  date: Date | string | null,
  defaultValue: string = 'Unknown',
) {
  if (!date) return defaultValue;

  return formatTimeAgoIntl(new Date(date));
}
