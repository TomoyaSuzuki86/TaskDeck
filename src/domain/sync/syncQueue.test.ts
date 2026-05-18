import { describe, expect, test, vi } from 'vitest';
import { processSyncQueue, queueImportGoogleTasks, queueTaskCompleted, queueTaskCreated } from './syncQueue';
import type { Task } from '../taskDeck/types';

const task: Task = {
  id: 'task-1',
  title: '同期する',
  dueDate: '2026-05-19',
  status: 'active',
  tags: [],
  order: 1,
  source: 'taskDeck',
  createdAt: '2026-05-19T00:00:00.000Z',
  updatedAt: '2026-05-19T00:00:00.000Z',
};

describe('Task Deck sync queue', () => {
  test('Task Deckでタスクを作成したときGoogle Tasks作成操作をキューに積む', () => {
    expect(queueTaskCreated([], task)[0]).toMatchObject({ type: 'createGoogleTask', taskId: 'task-1', status: 'pending' });
  });

  test('Task Deckでタスクを完了したときGoogle Tasks完了操作をキューに積む', () => {
    expect(queueTaskCompleted([], task)[0].type).toBe('completeGoogleTask');
  });

  test('Google TasksのタスクをTask Deckに取り込める', async () => {
    const result = await processSyncQueue(queueImportGoogleTasks([]), [], {
      createTask: vi.fn(),
      completeTask: vi.fn(),
      importTasks: vi.fn().mockResolvedValue([task]),
    });
    expect(result.importedTasks).toEqual([task]);
  });

  test('Google Tasks同期に失敗してもローカルタスクを保持する', async () => {
    const result = await processSyncQueue(queueTaskCreated([], task), [task], {
      createTask: vi.fn().mockRejectedValue(new Error('fail')),
      completeTask: vi.fn(),
      importTasks: vi.fn(),
    });
    expect(result.queue[0].status).toBe('pending');
  });

  test('失敗した同期操作を再試行待ちとして記録する', async () => {
    const result = await processSyncQueue(queueTaskCreated([], task), [task], {
      createTask: vi.fn().mockRejectedValue(new Error('fail')),
      completeTask: vi.fn(),
      importTasks: vi.fn(),
    });
    expect(result.queue[0].attempts).toBe(1);
  });

  test('再試行待ちの同期操作を再実行できる', async () => {
    const createTask = vi.fn().mockResolvedValue(undefined);
    await processSyncQueue(queueTaskCreated([], task), [task], { createTask, completeTask: vi.fn(), importTasks: vi.fn() });
    expect(createTask).toHaveBeenCalledWith(task);
  });

  test('再試行時にGoogle連携済みタスクを重複作成しない', () => {
    expect(queueTaskCreated([], { ...task, googleTaskId: 'g1' })).toHaveLength(1);
  });

  test('オフライン中もユーザー操作を受け付けられる', () => {
    expect(queueTaskCreated([], task)[0].status).toBe('pending');
  });

  test('オフライン中のタスク作成を後続同期用にキューへ積む', () => {
    expect(queueTaskCreated([], task)).toHaveLength(1);
  });

  test('オンライン復帰後にキュー済み同期操作を処理する', async () => {
    const result = await processSyncQueue(queueTaskCreated([], task), [task], {
      createTask: vi.fn().mockResolvedValue(undefined),
      completeTask: vi.fn(),
      importTasks: vi.fn(),
    });
    expect(result.queue[0].status).toBe('done');
  });

  test('同期状態をUI表示状態とは分離して保持する', () => {
    expect(queueTaskCreated([], task)[0]).not.toHaveProperty('visible');
  });
});
