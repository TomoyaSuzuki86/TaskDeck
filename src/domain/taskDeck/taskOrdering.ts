import { dayDifference, normalizeDueDate } from './dateUtils';
import type { DeckSections, DisplaySession, Task } from './types';

function isVisibleTask(task: Task, session?: DisplaySession): boolean {
  return task.status === 'active' && !session?.hiddenTaskIds.has(task.id);
}

function compareTasks(now: Date) {
  return (a: Task, b: Task): number => {
    const diff = dayDifference(a.dueDate, now) - dayDifference(b.dueDate, now);
    if (diff !== 0) return diff;
    const order = a.order - b.order;
    if (order !== 0) return order;
    return a.createdAt.localeCompare(b.createdAt);
  };
}

export function getOrderedActiveTasks(tasks: Task[], now = new Date(), session?: DisplaySession): Task[] {
  return tasks
    .filter((task) => isVisibleTask(task, session))
    .sort(compareTasks(now));
}

export function getDeckSections(tasks: Task[], now = new Date(), session?: DisplaySession): DeckSections {
  const visible = getOrderedActiveTasks(tasks, now, session);
  const overdue = visible.filter((task) => dayDifference(task.dueDate, now) < 0);
  const todayAndLater = visible.filter((task) => dayDifference(task.dueDate, now) >= 0);
  const today = todayAndLater
    .filter((task) => dayDifference(task.dueDate, now) === 0)
    .slice(0, 3);
  const todayIds = new Set(today.map((task) => task.id));
  const future = todayAndLater
    .filter((task) => !todayIds.has(task.id) && dayDifference(task.dueDate, now) > 0)
    .slice(0, today.length === 0 ? 3 : 1);

  return { overdue, today, future };
}

export function getArchivedTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status === 'archived').sort((a: Task, b: Task) => {
    const date = normalizeDueDate(a.dueDate).localeCompare(normalizeDueDate(b.dueDate));
    if (date !== 0) return date;
    return a.order - b.order;
  });
}
