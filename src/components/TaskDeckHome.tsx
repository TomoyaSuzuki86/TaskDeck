import { Archive, CalendarDays, Check, Clock3, Settings, TriangleAlert } from 'lucide-react';
import { formatDateLabel } from '../domain/taskDeck/dateLabel';
import type { DeckSections, Task } from '../domain/taskDeck/types';

type TaskDeckHomeProps = {
  sections: DeckSections;
  onComplete: (task: Task) => void;
  onPostpone: (task: Task) => void;
  onArchive: (task: Task) => void;
  onOpenSettings: () => void;
};

function TaskCard({
  task,
  index,
  variant = 'today',
  onComplete,
  onPostpone,
  onArchive,
}: {
  task: Task;
  index?: number;
  variant?: 'overdue' | 'today' | 'future';
  onComplete: (task: Task) => void;
  onPostpone: (task: Task) => void;
  onArchive: (task: Task) => void;
}) {
  return (
    <article className={`task-card ${variant}`}>
      <div className="task-main">
        {index && <span className="task-rank">{index}</span>}
        <div>
          <h3>{task.title}</h3>
          <p>{formatDateLabel(task.dueDate)}</p>
        </div>
      </div>
      <div className="swipe-actions" aria-label={`${task.title}の操作`}>
        <button type="button" onClick={() => onComplete(task)} aria-label="完了">
          <Check size={17} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onPostpone(task)} aria-label="後回し" disabled={variant === 'overdue'}>
          <Clock3 size={17} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onArchive(task)} aria-label="保管">
          <Archive size={17} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export function TaskDeckHome({
  sections,
  onComplete,
  onPostpone,
  onArchive,
  onOpenSettings,
}: TaskDeckHomeProps) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Task Deck</h1>
        </div>
        <button className="icon-button" type="button" aria-label="設定" onClick={onOpenSettings}>
          <Settings size={22} aria-hidden="true" />
        </button>
      </header>

      <section className="deck-section overdue-section" aria-label="期限切れ">
        <h2>
          <TriangleAlert size={18} aria-hidden="true" />
          期限切れ
        </h2>
        {sections.overdue.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            variant="overdue"
            onComplete={onComplete}
            onPostpone={onPostpone}
            onArchive={onArchive}
          />
        ))}
      </section>

      <section className="deck-section" aria-label="今日中">
        <h2>
          <span className="section-dot" />
          今日
        </h2>
        <div className="today-stack">
          {sections.today.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index + 1}
              onComplete={onComplete}
              onPostpone={onPostpone}
              onArchive={onArchive}
            />
          ))}
        </div>
      </section>

      <section className="deck-section future-section" aria-label="明日以降">
        <h2>
          <CalendarDays size={18} aria-hidden="true" />
          次
        </h2>
        {sections.future.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            variant="future"
            onComplete={onComplete}
            onPostpone={onPostpone}
            onArchive={onArchive}
          />
        ))}
      </section>

    </main>
  );
}
