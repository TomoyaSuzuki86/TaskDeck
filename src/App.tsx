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

type ModalMode = 'manual' | 'voice' | null;

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
        archivedTasks={archivedTasks}
        userEmail={user.email}
        onComplete={(task) => updateTask(completeTask(task))}
        onPostpone={(task) => updateTask(postponeTask(task, sessionRef.current))}
        onArchive={(task) => updateTask(archiveTask(task))}
        onRestore={(task) => updateTask(restoreTask(task))}
        onLogout={logout}
      />
      <AddTaskButton onManualAdd={() => setModal('manual')} onVoiceAdd={() => setModal('voice')} />
      {modal === 'manual' && <ManualTaskModal today={todayKey()} onSave={addManualTask} onClose={() => setModal(null)} />}
      {modal === 'voice' && <VoiceTaskInput onCreate={addVoiceTask} onClose={() => setModal(null)} />}
    </>
  );
}
