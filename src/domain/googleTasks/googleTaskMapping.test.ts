import { describe, expect, test } from 'vitest';
import { fromGoogleTask, toGoogleTask } from './googleTaskMapping';
import type { Task } from '../taskDeck/types';

const now = new Date('2026-05-19T09:00:00+09:00');
const task = (overrides: Partial<Task> = {}): Task => ({
  id: 'task',
  title: 'メールする',
  dueDate: '2026-05-20',
  status: 'active',
  tags: ['仕事'],
  order: 1,
  source: 'taskDeck',
  googleTaskId: 'google-1',
  googleTaskListId: 'list-1',
  createdAt: '2026-05-19T00:00:00.000Z',
  updatedAt: '2026-05-19T00:00:00.000Z',
  ...overrides,
});

describe('Google Tasks mapping', () => {
  test('Task Deckのタスク名をGoogle Tasksのtitleに変換できる', () => {
    expect(toGoogleTask(task()).title).toBe('メールする');
  });

  test('Task DeckのdueDateをGoogle Tasksのdueに変換できる', () => {
    expect(toGoogleTask(task()).due).toBe('2026-05-20T00:00:00.000Z');
  });

  test('Task Deckの完了済みタスクをGoogle Tasksのcompletedステータスに変換できる', () => {
    expect(toGoogleTask(task({ status: 'completed' })).status).toBe('completed');
  });

  test('Task DeckのアクティブタスクをGoogle TasksのneedsActionステータスに変換できる', () => {
    expect(toGoogleTask(task()).status).toBe('needsAction');
  });

  test('連携済みタスクを変換するときgoogleTaskIdを保持する', () => {
    expect(toGoogleTask(task()).id).toBe('google-1');
  });

  test('連携済みタスクを変換するときgoogleTaskListIdを保持する', () => {
    expect(task().googleTaskListId).toBe('list-1');
  });

  test('Google TasksのタスクをTask Deckのタスクに変換できる', () => {
    expect(fromGoogleTask({ id: 'g1', title: '買い物' }, 'list-1', now).title).toBe('買い物');
  });

  test('Google TasksのcompletedステータスをTask Deckのcompletedステータスに反映できる', () => {
    expect(fromGoogleTask({ status: 'completed' }, 'list-1', now).status).toBe('completed');
  });

  test('Google TasksのneedsActionステータスをTask Deckのactiveステータスに反映できる', () => {
    expect(fromGoogleTask({ status: 'needsAction' }, 'list-1', now).status).toBe('active');
  });

  test('Google側に期日がないタスクはTask Deckでは今日中として扱う', () => {
    expect(fromGoogleTask({ id: 'g1' }, 'list-1', now).dueDate).toBe('2026-05-19');
  });

  test('Google側の期限日時をYYYY-MM-DDの日付に正規化する', () => {
    expect(fromGoogleTask({ due: '2026-05-22T00:00:00.000Z' }, 'list-1', now).dueDate).toBe('2026-05-22');
  });

  test('Google Tasks APIのデータ形式をアダプタ層の外へ漏らさない', () => {
    expect(fromGoogleTask({ due: '2026-05-22T00:00:00.000Z' }, 'list-1', now)).not.toHaveProperty('due');
  });
});
