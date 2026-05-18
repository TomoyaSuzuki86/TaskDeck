import { todayKey, tomorrowKey } from './dateUtils';
import type { CreateTaskInput, Task } from './types';

function createId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function trimTitle(title: string): string {
  return title.trim();
}

export function createManualTask(input: CreateTaskInput): Task {
  const now = input.now ?? new Date();
  const title = trimTitle(input.title);
  if (!title) throw new Error('タスク名を入力してください');
  const timestamp = now.toISOString();

  return {
    id: input.id ?? createId(),
    title,
    dueDate: input.dueDate ?? todayKey(now),
    status: 'active',
    tags: input.tags ?? [],
    order: input.order ?? Date.now(),
    source: 'taskDeck',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createVoiceTask(input: Omit<CreateTaskInput, 'dueDate' | 'tags'>): Task {
  const now = input.now ?? new Date();
  return createManualTask({
    ...input,
    dueDate: tomorrowKey(now),
    tags: [],
    now,
  });
}
