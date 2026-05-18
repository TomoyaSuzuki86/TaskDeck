import { useMemo, useRef, useState } from 'react';
import { AddTaskButton } from './components/AddTaskButton';
import { LoginScreen } from './components/LoginScreen';
import { ManualTaskModal } from './components/ManualTaskModal';
import { TaskDeckHome } from './components/TaskDeckHome';
import { VoiceTaskInput } from './components/VoiceTaskInput';
import { useAuth } from './auth/AuthProvider';
import { createSampleTasks } from './data/sampleTasks';
import { createManualTask, createVoiceTask } from './domain/taskDeck/taskCreation';
import { archiveTask, completeTask, createDisplaySession, postponeTask, restoreTask } from './domain/taskDeck/taskActions';
import { todayKey } from './domain/taskDeck/dateUtils';
import { getArchivedTasks, getDeckSections } from './domain/taskDeck/taskOrdering';
import type { Task } from './domain/taskDeck/types';

type ModalMode = 'manual' | 'voice' | 'settings' | 'archive' | null;

export function App() {
  const { user, loginWithGoogle, logout } = useAuth();
  const sessionRef = useRef(createDisplaySession());
  const [tasks, setTasks] = useState<Task[]>(() => createSampleTasks());
  const [modal, setModal] = useState<ModalMode>(null);

  const sections = useMemo(() => getDeckSections(tasks, new Date(), sessionRef.current), [tasks]);
  const archivedTasks = useMemo(() => getArchivedTasks(tasks), [tasks]);

  const updateTask = (nextTask: Task) => {
    setTasks((current) => current.map((task) => (task.id === nextTask.id ? nextTask : task)));
  };

  const addManualTask = (input: { title: string; dueDate: string | null; tags: string[] }) => {
    setTasks((current) => [
      ...current,
      createManualTask({
        title: input.title,
        dueDate: input.dueDate,
        tags: input.tags,
        order: current.length + 1,
      }),
    ]);
    setModal(null);
  };

  const addVoiceTask = (title: string) => {
    setTasks((current) => [...current, createVoiceTask({ title, order: current.length + 1 })]);
  };

  if (!user) {
    return <LoginScreen onLogin={loginWithGoogle} />;
  }

  return (
    <>
      <TaskDeckHome
        sections={sections}
        onComplete={(task) => updateTask(completeTask(task))}
        onPostpone={(task) => updateTask(postponeTask(task, sessionRef.current))}
        onArchive={(task) => updateTask(archiveTask(task))}
        onOpenSettings={() => setModal('settings')}
      />
      <AddTaskButton onManualAdd={() => setModal('manual')} onVoiceAdd={() => setModal('voice')} />
      {modal === 'manual' && <ManualTaskModal today={todayKey()} onSave={addManualTask} onClose={() => setModal(null)} />}
      {modal === 'voice' && <VoiceTaskInput onCreate={addVoiceTask} onClose={() => setModal(null)} />}
      {modal === 'settings' && (
        <div className="modal-backdrop" role="presentation">
          <section className="settings-sheet" role="dialog" aria-modal="true" aria-label="設定">
            <header>
              <h2>設定</h2>
              <button type="button" onClick={() => setModal(null)}>
                閉じる
              </button>
            </header>
            <div className="settings-list">
              <div>
                <span>アカウント</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>同期</span>
                <strong>待機中</strong>
              </div>
            </div>
            <button className="sheet-action" type="button" onClick={() => setModal('archive')}>
              保管リスト
            </button>
            <button className="sheet-danger" type="button" onClick={logout}>
              ログアウト
            </button>
          </section>
        </div>
      )}
      {modal === 'archive' && (
        <div className="modal-backdrop" role="presentation">
          <section className="settings-sheet" role="dialog" aria-modal="true" aria-label="保管リスト">
            <header>
              <h2>保管リスト</h2>
              <button type="button" onClick={() => setModal('settings')}>
                戻る
              </button>
            </header>
            {archivedTasks.length === 0 ? (
              <p className="empty-text">保管中のタスクはありません</p>
            ) : (
              <div className="archive-list">
                {archivedTasks.map((task) => (
                  <div className="archive-row" key={task.id}>
                    <span>{task.title}</span>
                    <button type="button" onClick={() => updateTask(restoreTask(task))}>
                      戻す
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
