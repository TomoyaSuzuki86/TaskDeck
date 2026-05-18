import { describe, expect, test } from 'vitest';
import { archiveTask, completeTask, createDisplaySession, postponeTask, restoreTask } from './taskActions';
import { getDeckSections } from './taskOrdering';
import type { Task } from './types';

const now = new Date('2026-05-19T09:00:00+09:00');
const task = (overrides: Partial<Task> = {}): Task => ({
  id: 'task',
  title: 'タスク',
  dueDate: '2026-05-19',
  status: 'active',
  tags: [],
  order: 1,
  source: 'taskDeck',
  createdAt: '2026-05-19T00:00:00.000Z',
  updatedAt: '2026-05-19T00:00:00.000Z',
  ...overrides,
});

describe('Task Deck card actions', () => {
  test('左スワイプでタスクが完了になる', () => {
    expect(completeTask(task(), now).status).toBe('completed');
  });

  test('完了したタスクはメインデッキから消える', () => {
    expect(getDeckSections([completeTask(task(), now)], now).today).toHaveLength(0);
  });

  test('完了後に次のタスクが最上部に上がる', () => {
    const first = completeTask(task({ id: 'first', order: 1 }), now);
    const second = task({ id: 'second', order: 2 });
    expect(getDeckSections([first, second], now).today[0].id).toBe('second');
  });

  test('右スワイプでタスクが後回しになる', () => {
    expect(postponeTask(task(), createDisplaySession(), now).postponedAt).toBe(now.toISOString());
  });

  test('後回ししたタスクの期日は明日になる', () => {
    expect(postponeTask(task(), createDisplaySession(), now).dueDate).toBe('2026-05-20');
  });

  test('後回ししたタスクにはpostponedAtが設定される', () => {
    expect(postponeTask(task(), createDisplaySession(), now).postponedAt).toBeDefined();
  });

  test('後回ししたタスクがすぐ再表示されないようにsnoozedUntilが設定される', () => {
    expect(postponeTask(task(), createDisplaySession(), now).snoozedUntil).toBe('2026-05-20');
  });

  test('後回ししたタスクは同じ表示セッション内では再表示されない', () => {
    const session = createDisplaySession();
    const postponed = postponeTask(task({ id: 'a' }), session, now);
    expect(getDeckSections([postponed], now, session).future).toHaveLength(0);
  });

  test('下スワイプでタスクが保管される', () => {
    expect(archiveTask(task(), now).status).toBe('archived');
  });

  test('保管したタスクはメインデッキから消える', () => {
    expect(getDeckSections([archiveTask(task(), now)], now).today).toHaveLength(0);
  });

  test('保管したタスクは保管リストに表示される', () => {
    expect(archiveTask(task(), now).archivedAt).toBeDefined();
  });

  test('保管したタスクをアクティブなデッキに復元できる', () => {
    expect(restoreTask(archiveTask(task(), now), now).status).toBe('active');
  });

  test('タスクを保管しても期日は変更されない', () => {
    expect(archiveTask(task({ dueDate: '2026-05-22' }), now).dueDate).toBe('2026-05-22');
  });

  test('復元した期限切れタスクは期限切れかつ最優先として表示される', () => {
    const restored = restoreTask(archiveTask(task({ id: 'old', dueDate: '2026-05-18' }), now), now);
    expect(getDeckSections([restored, task({ id: 'today' })], now).overdue[0].id).toBe('old');
  });

  test('期限切れタスクは後回しできない', () => {
    expect(() => postponeTask(task({ dueDate: '2026-05-18' }), createDisplaySession(), now)).toThrow('期限切れ');
  });

  test('期限切れタスクは完了できる', () => {
    expect(completeTask(task({ dueDate: '2026-05-18' }), now).status).toBe('completed');
  });

  test('期限切れタスクは保管できる', () => {
    expect(archiveTask(task({ dueDate: '2026-05-18' }), now).status).toBe('archived');
  });

  test('保管した期限切れタスクはメインデッキから消える', () => {
    expect(getDeckSections([archiveTask(task({ dueDate: '2026-05-18' }), now)], now).overdue).toHaveLength(0);
  });

  test('保管リストから戻した期限切れタスクは再び最優先で表示される', () => {
    const restored = restoreTask(archiveTask(task({ dueDate: '2026-05-18' }), now), now);
    expect(getDeckSections([restored], now).overdue).toHaveLength(1);
  });
});
