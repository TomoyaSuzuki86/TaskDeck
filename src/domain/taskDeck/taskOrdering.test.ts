import { describe, expect, test } from 'vitest';
import { getArchivedTasks, getDeckSections, getOrderedActiveTasks } from './taskOrdering';
import type { Task } from './types';

const now = new Date('2026-05-19T09:00:00+09:00');
const baseTask = (overrides: Partial<Task>): Task => ({
  id: overrides.id ?? 'task',
  title: overrides.title ?? 'task',
  dueDate: overrides.dueDate ?? '2026-05-19',
  status: overrides.status ?? 'active',
  tags: [],
  order: overrides.order ?? 1,
  source: 'taskDeck',
  createdAt: '2026-05-19T00:00:00.000Z',
  updatedAt: '2026-05-19T00:00:00.000Z',
  ...overrides,
});

describe('Task Deck task ordering', () => {
  test('期限切れタスクが他のすべてのタスクより先に表示される', () => {
    const tasks = [baseTask({ id: 'today' }), baseTask({ id: 'overdue', dueDate: '2026-05-18' })];
    expect(getOrderedActiveTasks(tasks, now)[0].id).toBe('overdue');
  });

  test('今日中のタスクが期限切れタスクの次に表示される', () => {
    const tasks = [baseTask({ id: 'tomorrow', dueDate: '2026-05-20' }), baseTask({ id: 'today' }), baseTask({ id: 'overdue', dueDate: '2026-05-18' })];
    expect(getOrderedActiveTasks(tasks, now).map((task) => task.id)).toEqual(['overdue', 'today', 'tomorrow']);
  });

  test('明日のタスクが今日中のタスクの次に表示される', () => {
    const tasks = [baseTask({ id: 'tomorrow', dueDate: '2026-05-20' }), baseTask({ id: 'today' })];
    expect(getOrderedActiveTasks(tasks, now).map((task) => task.id)).toEqual(['today', 'tomorrow']);
  });

  test('2日後以降のタスクは期日が近い順に表示される', () => {
    const tasks = [baseTask({ id: 'three', dueDate: '2026-05-22' }), baseTask({ id: 'two', dueDate: '2026-05-21' })];
    expect(getOrderedActiveTasks(tasks, now).map((task) => task.id)).toEqual(['two', 'three']);
  });

  test('期日なしタスクは今日中のタスクとして扱われる', () => {
    const tasks = [baseTask({ id: 'none', dueDate: null }), baseTask({ id: 'future', dueDate: '2026-05-21' })];
    expect(getOrderedActiveTasks(tasks, now)[0].id).toBe('none');
  });

  test('完了済みタスクはメインデッキに表示されない', () => {
    expect(getOrderedActiveTasks([baseTask({ status: 'completed' })], now)).toEqual([]);
  });

  test('保管済みタスクはメインデッキに表示されない', () => {
    expect(getOrderedActiveTasks([baseTask({ status: 'archived' })], now)).toEqual([]);
  });

  test('通常の今日中タスクは最大3件まで表示される', () => {
    const tasks = [1, 2, 3, 4].map((order) => baseTask({ id: String(order), order }));
    expect(getDeckSections(tasks, now).today).toHaveLength(3);
  });

  test('今日中タスクがない場合は明日以降の近いタスクでデッキを補う', () => {
    const tasks = [1, 2, 3, 4].map((order) => baseTask({ id: String(order), dueDate: `2026-05-2${order}`, order }));
    expect(getDeckSections(tasks, now).future.map((task) => task.id)).toEqual(['1', '2', '3']);
  });

  test('同じ期日のタスクはorder順に表示される', () => {
    const tasks = [baseTask({ id: 'b', order: 2 }), baseTask({ id: 'a', order: 1 })];
    expect(getOrderedActiveTasks(tasks, now).map((task) => task.id)).toEqual(['a', 'b']);
  });

  test('今日中タスクが3件あっても期限切れタスクは専用の最上部エリアに表示される', () => {
    const tasks = [baseTask({ id: 'overdue', dueDate: '2026-05-18' }), ...[1, 2, 3].map((order) => baseTask({ id: String(order), order }))];
    expect(getDeckSections(tasks, now).overdue.map((task) => task.id)).toEqual(['overdue']);
  });

  test('明日以降エリアには最も近い未来のタスクが補助的に表示される', () => {
    const tasks = [baseTask({ id: 'today' }), baseTask({ id: 'near', dueDate: '2026-05-20' }), baseTask({ id: 'far', dueDate: '2026-05-23' })];
    expect(getDeckSections(tasks, now).future.map((task) => task.id)).toEqual(['near']);
  });

  test('同じ表示セッション中にスヌーズされたタスクは表示されない', () => {
    const tasks = [baseTask({ id: 'hidden' }), baseTask({ id: 'shown', order: 2 })];
    expect(getOrderedActiveTasks(tasks, now, { hiddenTaskIds: new Set(['hidden']) }).map((task) => task.id)).toEqual(['shown']);
  });

  test('保管リスト画面では保管済みタスクを表示できる', () => {
    expect(getArchivedTasks([baseTask({ id: 'archived', status: 'archived' })]).map((task) => task.id)).toEqual(['archived']);
  });
});
