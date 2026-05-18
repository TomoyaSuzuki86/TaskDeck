import { addDays, todayKey } from './dateUtils';
import type { DisplaySession, Task } from './types';

function touch(task: Task, now: Date): Task {
  return { ...task, updatedAt: now.toISOString() };
}

export function createDisplaySession(): DisplaySession {
  return { hiddenTaskIds: new Set() };
}

export function completeTask(task: Task, now = new Date()): Task {
  return touch({ ...task, status: 'completed', completedAt: now.toISOString() }, now);
}

export function postponeTask(task: Task, session: DisplaySession, now = new Date()): Task {
  if (task.dueDate && task.dueDate < todayKey(now)) {
    throw new Error('期限切れタスクは後回しできません');
  }
  session.hiddenTaskIds.add(task.id);
  const tomorrow = addDays(todayKey(now), 1);
  return touch(
    {
      ...task,
      dueDate: tomorrow,
      postponedAt: now.toISOString(),
      snoozedUntil: tomorrow,
    },
    now,
  );
}

export function archiveTask(task: Task, now = new Date()): Task {
  return touch({ ...task, status: 'archived', archivedAt: now.toISOString() }, now);
}

export function restoreTask(task: Task, now = new Date()): Task {
  const { archivedAt: _archivedAt, ...rest } = task;
  return touch({ ...rest, status: 'active' }, now);
}
