import { Archive, CalendarDays, Check, Clock3, LogOut, Settings, TriangleAlert } from 'lucide-react';
import { formatDateLabel } from '../domain/taskDeck/dateLabel';
import type { DeckSections, Task } from '../domain/taskDeck/types';

type TaskDeckHomeProps = {
  sections: DeckSections;
  archivedTasks: Task[];
  userEmail: string;
  onComplete: (task: Task) => void;
  onPostpone: (task: Task) => void;
  onArchive: (task: Task) => void;
  onRestore: (task: Task) => void;
  onLogout: () => void;
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
  archivedTasks,
  userEmail,
  onComplete,
  onPostpone,
  onArchive,
  onRestore,
  onLogout,
}: TaskDeckHomeProps) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Task Deck</h1>
          <p>3つだけ、シンプルに、今日やること。</p>
        </div>
        <button className="icon-button" type="button" aria-label="設定">
          <Settings size={22} aria-hidden="true" />
        </button>
      </header>

      <section className="deck-section overdue-section" aria-label="期限切れ">
        <h2>
          <TriangleAlert size={18} aria-hidden="true" />
          期限過ぎ
          <span>まずはここから</span>
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
          今日中
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

      <section className="deck-section" aria-label="明日以降">
        <h2>
          <CalendarDays size={18} aria-hidden="true" />
          明日以降
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

      <section className="gesture-guide" aria-label="スワイプ操作">
        <div>
          <Check size={17} aria-hidden="true" />
          左で完了
        </div>
        <div>
          <Clock3 size={17} aria-hidden="true" />
          右で後回し
        </div>
        <div>
          <Archive size={17} aria-hidden="true" />
          下で保管
        </div>
      </section>

      <section className="archive-panel" aria-label="保管リスト">
        <h2>保管リスト</h2>
        {archivedTasks.length === 0 ? (
          <p>保管中のタスクはありません</p>
        ) : (
          archivedTasks.map((task) => (
            <div className="archive-row" key={task.id}>
              <span>{task.title}</span>
              <button type="button" onClick={() => onRestore(task)}>
                戻す
              </button>
            </div>
          ))
        )}
      </section>

      <footer className="settings-panel">
        <span>{userEmail}</span>
        <span>同期状態: 待機中</span>
        <button type="button" onClick={onLogout}>
          <LogOut size={16} aria-hidden="true" />
          ログアウト
        </button>
      </footer>
    </main>
  );
}
