import type { Task } from '../taskDeck/types';

export type SyncOperationType = 'createGoogleTask' | 'completeGoogleTask' | 'importGoogleTasks';
export type SyncOperationStatus = 'pending' | 'done' | 'failed';

export type SyncOperation = {
  id: string;
  type: SyncOperationType;
  taskId?: string;
  status: SyncOperationStatus;
  attempts: number;
  createdAt: string;
  updatedAt: string;
};

export type SyncAdapter = {
  createTask(task: Task): Promise<void>;
  completeTask(task: Task): Promise<void>;
  importTasks(): Promise<Task[]>;
};

function createOperation(type: SyncOperationType, taskId?: string): SyncOperation {
  const now = new Date().toISOString();
  return {
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    taskId,
    status: 'pending',
    attempts: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function queueTaskCreated(queue: SyncOperation[], task: Task): SyncOperation[] {
  return [...queue, createOperation('createGoogleTask', task.id)];
}

export function queueTaskCompleted(queue: SyncOperation[], task: Task): SyncOperation[] {
  return [...queue, createOperation('completeGoogleTask', task.id)];
}

export function queueImportGoogleTasks(queue: SyncOperation[]): SyncOperation[] {
  return [...queue, createOperation('importGoogleTasks')];
}

export async function processSyncQueue(
  queue: SyncOperation[],
  tasks: Task[],
  adapter: SyncAdapter,
): Promise<{ queue: SyncOperation[]; importedTasks: Task[] }> {
  const importedTasks: Task[] = [];
  const nextQueue: SyncOperation[] = [];

  for (const operation of queue) {
    if (operation.status === 'done') {
      nextQueue.push(operation);
      continue;
    }

    try {
      if (operation.type === 'createGoogleTask') {
        const task = tasks.find((item) => item.id === operation.taskId);
        if (task) await adapter.createTask(task);
      }
      if (operation.type === 'completeGoogleTask') {
        const task = tasks.find((item) => item.id === operation.taskId);
        if (task) await adapter.completeTask(task);
      }
      if (operation.type === 'importGoogleTasks') {
        importedTasks.push(...(await adapter.importTasks()));
      }
      nextQueue.push({ ...operation, status: 'done', attempts: operation.attempts + 1, updatedAt: new Date().toISOString() });
    } catch {
      nextQueue.push({ ...operation, status: 'pending', attempts: operation.attempts + 1, updatedAt: new Date().toISOString() });
    }
  }

  return { queue: nextQueue, importedTasks };
}
