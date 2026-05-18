import { useState } from 'react';
import {
  Archive,
  Ban,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ListTodo,
  MoreHorizontal,
  Settings,
  TriangleAlert,
} from 'lucide-react';
import { formatDateLabel } from '../domain/taskDeck/dateLabel';
import type { DeckSections, Task } from '../domain/taskDeck/types';

type TaskDeckHomeProps = {
  sections: DeckSections;
  onComplete: (task: Task) => void;
  onPostpone: (task: Task) => void;
  onArchive: (task: Task) => void;
  onOpenSettings: () => void;
  onOpenArchive: () => void;
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
  const [open, setOpen] = useState(false);
  const isOverdue = variant === 'overdue';

  const run = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <article className={`task-card ${variant}`}>
      <div className="task-main">
        {isOverdue && (
          <span className="task-alert" aria-hidden="true">
            <TriangleAlert size={25} />
          </span>
        )}
        {index && <span className="task-rank">{index}</span>}
        <div>
          <h3>{task.title}</h3>
          <p>{formatDateLabel(task.dueDate)}</p>
        </div>
      </div>
      <div className="card-menu">
        {isOverdue ? (
          <button className="card-menu-button muted" type="button" aria-label="期限切れのため後回し不可" disabled>
            <Ban size={22} aria-hidden="true" />
          </button>
        ) : (
          <button
            className={variant === 'future' ? 'future-pill' : 'card-menu-button'}
            type="button"
            aria-label={`${task.title}の操作`}
            onClick={() => setOpen((value) => !value)}
          >
            {variant === 'future' ? (
              <>
                <span>{formatDateLabel(task.dueDate)}</span>
                <ChevronRight size={18} aria-hidden="true" />
              </>
            ) : (
              <MoreHorizontal size={25} aria-hidden="true" />
            )}
          </button>
        )}
        {open && (
          <div className="action-popover" role="menu">
            <button type="button" role="menuitem" onClick={() => run(() => onComplete(task))}>
              <Check size={16} aria-hidden="true" />
              完了
            </button>
            <button type="button" role="menuitem" onClick={() => run(() => onPostpone(task))}>
              <Clock3 size={16} aria-hidden="true" />
              後回し
            </button>
            <button type="button" role="menuitem" onClick={() => run(() => onArchive(task))}>
              <Archive size={16} aria-hidden="true" />
              保管
            </button>
          </div>
        )}
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
  onOpenArchive,
}: TaskDeckHomeProps) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Task Deck</h1>
          <p>3つだけ、シンプルに、今日やること。</p>
        </div>
        <div className="top-actions">
          <button className="icon-button" type="button" aria-label="保管リスト" onClick={onOpenArchive}>
            <ListTodo size={24} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" aria-label="設定" onClick={onOpenSettings}>
            <Settings size={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="deck-section overdue-section" aria-label="期限切れ">
        <h2>
          <TriangleAlert size={20} aria-hidden="true" />
          期限過ぎのタスク
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
          今日中のタスク
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
          <CalendarDays size={20} aria-hidden="true" />
          明日以降のタスク
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
