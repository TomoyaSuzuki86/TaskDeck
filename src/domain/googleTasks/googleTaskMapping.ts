import { normalizeDueDate, todayKey } from '../taskDeck/dateUtils';
import type { Task } from '../taskDeck/types';

export type GoogleTaskStatus = 'needsAction' | 'completed';

export type GoogleTask = {
  id?: string;
  title?: string;
  due?: string;
  status?: GoogleTaskStatus;
  completed?: string;
};

export type GoogleTaskPayload = {
  id?: string;
  title: string;
  due?: string;
  status: GoogleTaskStatus;
};

export function toGoogleTask(task: Task): GoogleTaskPayload {
  return {
    id: task.googleTaskId,
    title: task.title,
    due: task.dueDate ? `${task.dueDate}T00:00:00.000Z` : undefined,
    status: task.status === 'completed' ? 'completed' : 'needsAction',
  };
}

export function fromGoogleTask(googleTask: GoogleTask, listId: string, now = new Date()): Task {
  const timestamp = new Date().toISOString();
  const completed = googleTask.status === 'completed';

  return {
    id: `google-${googleTask.id ?? crypto.randomUUID()}`,
    title: googleTask.title?.trim() || '無題のタスク',
    dueDate: googleTask.due ? normalizeDueDate(googleTask.due, now) : todayKey(now),
    status: completed ? 'completed' : 'active',
    tags: [],
    order: Date.now(),
    source: 'googleTasks',
    googleTaskId: googleTask.id,
    googleTaskListId: listId,
    createdAt: timestamp,
    updatedAt: timestamp,
    completedAt: completed ? googleTask.completed ?? timestamp : undefined,
  };
}
