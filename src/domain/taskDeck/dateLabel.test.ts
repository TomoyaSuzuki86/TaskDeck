import { describe, expect, test } from 'vitest';
import { formatDateLabel } from './dateLabel';
import { normalizeDueDate } from './dateUtils';

const now = new Date('2026-05-19T09:00:00+09:00');

describe('Task Deck date labels', () => {
  test('昨日以前のタスクは期限切れと表示される', () => {
    expect(formatDateLabel('2026-05-18', now)).toBe('期限切れ');
  });

  test('今日のタスクは今日中と表示される', () => {
    expect(formatDateLabel('2026-05-19', now)).toBe('今日中');
  });

  test('明日のタスクは明日と表示される', () => {
    expect(formatDateLabel('2026-05-20', now)).toBe('明日');
  });

  test('2日後のタスクは2日後と表示される', () => {
    expect(formatDateLabel('2026-05-21', now)).toBe('2日後');
  });

  test('3日後のタスクは3日後と表示される', () => {
    expect(formatDateLabel('2026-05-22', now)).toBe('3日後');
  });

  test('一定以上未来の日付はYYYY/MM/DD形式で表示される', () => {
    expect(formatDateLabel('2026-05-25', now)).toBe('2026/05/25');
  });

  test('期日なしタスクは今日中と表示される', () => {
    expect(formatDateLabel(null, now)).toBe('今日中');
  });

  test('時刻のずれに影響されずローカルの日付単位でラベルを計算する', () => {
    expect(formatDateLabel('2026-05-19T23:59:59Z', now)).toBe('今日中');
  });

  test('Google Tasksの期限日時をTask Deckの日付単位に正規化する', () => {
    expect(normalizeDueDate('2026-05-20T00:00:00.000Z', now)).toBe('2026-05-20');
  });
});
