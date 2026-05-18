export type TaskStatus = 'active' | 'completed' | 'archived';

export type TaskSource = 'taskDeck' | 'googleTasks';

export type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  status: TaskStatus;
  tags: string[];
  order: number;
  source: TaskSource;
  googleTaskId?: string;
  googleTaskListId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archivedAt?: string;
  postponedAt?: string;
  snoozedUntil?: string;
};

export type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type DeckSections = {
  overdue: Task[];
  today: Task[];
  future: Task[];
};

export type CreateTaskInput = {
  title: string;
  dueDate?: string | null;
  tags?: string[];
  now?: Date;
  id?: string;
  order?: number;
};

export type DisplaySession = {
  hiddenTaskIds: Set<string>;
};
