import { dayDifference, normalizeDueDate } from './dateUtils';

export function formatDateLabel(dueDate: string | null | undefined, now = new Date()): string {
  const diff = dayDifference(dueDate, now);
  if (diff < 0) return '期限切れ';
  if (diff === 0) return '今日中';
  if (diff === 1) return '明日';
  if (diff === 2) return '2日後';
  if (diff === 3) return '3日後';
  return normalizeDueDate(dueDate, now).replaceAll('-', '/');
}
