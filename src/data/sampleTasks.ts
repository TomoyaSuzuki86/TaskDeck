import type { Task } from '../domain/taskDeck/types';
import { addDays, todayKey } from '../domain/taskDeck/dateUtils';

export function createSampleTasks(now = new Date()): Task[] {
  const today = todayKey(now);
  const timestamp = now.toISOString();

  return [
    {
      id: 'overdue-report',
      title: '提出済みのレポートを確認する',
      dueDate: addDays(today, -1),
      status: 'active',
      tags: ['仕事'],
      order: 1,
      source: 'taskDeck',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'plan-outline',
      title: '企画書の構成を考える',
      dueDate: today,
      status: 'active',
      tags: ['仕事'],
      order: 2,
      source: 'taskDeck',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'reply-mail',
      title: 'メールの返信をする',
      dueDate: today,
      status: 'active',
      tags: ['仕事'],
      order: 3,
      source: 'taskDeck',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'collect-materials',
      title: '資料をまとめる',
      dueDate: today,
      status: 'active',
      tags: ['勉強'],
      order: 4,
      source: 'taskDeck',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'gym',
      title: 'ジムに行く',
      dueDate: addDays(today, 1),
      status: 'active',
      tags: ['運動'],
      order: 5,
      source: 'taskDeck',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}
