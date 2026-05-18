const DATE_LENGTH = 10;

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function todayKey(now = new Date()): string {
  return toDateKey(now);
}

export function tomorrowKey(now = new Date()): string {
  return addDays(todayKey(now), 1);
}

export function normalizeDueDate(value: string | null | undefined, now = new Date()): string {
  if (!value) return todayKey(now);
  return value.slice(0, DATE_LENGTH);
}

export function dayDifference(dueDate: string | null | undefined, now = new Date()): number {
  const base = parseDateKey(todayKey(now)).getTime();
  const target = parseDateKey(normalizeDueDate(dueDate, now)).getTime();
  return Math.round((target - base) / 86_400_000);
}
