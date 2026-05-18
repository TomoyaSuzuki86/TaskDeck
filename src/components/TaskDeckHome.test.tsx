import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { TaskDeckHome } from './TaskDeckHome';
import type { DeckSections, Task } from '../domain/taskDeck/types';

const task = (overrides: Partial<Task>): Task => ({
  id: overrides.id ?? 'task',
  title: overrides.title ?? 'タスク',
  dueDate: overrides.dueDate ?? '2026-05-19',
  status: overrides.status ?? 'active',
  tags: [],
  order: overrides.order ?? 1,
  source: 'taskDeck',
  createdAt: '2026-05-19T00:00:00.000Z',
  updatedAt: '2026-05-19T00:00:00.000Z',
  ...overrides,
});

const sections: DeckSections = {
  overdue: [task({ id: 'old', title: '提出済みのレポートを確認する', dueDate: '2026-05-18' })],
  today: [
    task({ id: 'one', title: '企画書の構成を考える', order: 1 }),
    task({ id: 'two', title: 'メールの返信をする', order: 2 }),
    task({ id: 'three', title: '資料をまとめる', order: 3 }),
  ],
  future: [task({ id: 'gym', title: 'ジムに行く', dueDate: '2026-05-20' })],
};

function renderHome(overrides = {}) {
  return render(
    <TaskDeckHome
      sections={sections}
      archivedTasks={[]}
      userEmail="user@example.com"
      onComplete={vi.fn()}
      onPostpone={vi.fn()}
      onArchive={vi.fn()}
      onRestore={vi.fn()}
      onLogout={vi.fn()}
      {...overrides}
    />,
  );
}

describe('TaskDeckHome', () => {
  test('Task Deckのアプリ名を表示する', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: 'Task Deck' })).toBeInTheDocument();
  });

  test('参考画像に沿った白基調で柔らかいカードUIを表示する', () => {
    renderHome();
    expect(screen.getByText('企画書の構成を考える').closest('article')).toHaveClass('task-card');
  });

  test('期限切れタスクを最上部の期限切れエリアに表示する', () => {
    renderHome();
    expect(screen.getByLabelText('期限切れ')).toHaveTextContent('提出済みのレポートを確認する');
  });

  test('期限切れタスクは色だけでなくアイコンとテキストでも強調する', () => {
    renderHome();
    expect(screen.getByText('期限過ぎ')).toBeInTheDocument();
  });

  test('今日中タスクを優先順に最大3件表示する', () => {
    renderHome();
    expect(screen.getByLabelText('今日中')).toHaveTextContent('企画書の構成を考える');
    expect(screen.getByLabelText('今日中')).toHaveTextContent('メールの返信をする');
    expect(screen.getByLabelText('今日中')).toHaveTextContent('資料をまとめる');
  });

  test('明日以降の最も近いタスクを補助的に表示する', () => {
    renderHome();
    expect(screen.getByLabelText('明日以降')).toHaveTextContent('ジムに行く');
  });

  test('すべてのタスク一覧をメイン体験として表示しない', () => {
    renderHome();
    expect(screen.queryByText('すべてのタスク')).not.toBeInTheDocument();
  });

  test('設定ボタンを表示する', () => {
    renderHome();
    expect(screen.getByRole('button', { name: '設定' })).toBeInTheDocument();
  });

  test('左スワイプで完了の視覚フィードバックを表示する', () => {
    renderHome();
    expect(screen.getByText('左で完了')).toBeInTheDocument();
  });

  test('右スワイプで後回しの視覚フィードバックを表示する', () => {
    renderHome();
    expect(screen.getByText('右で後回し')).toBeInTheDocument();
  });

  test('下スワイプで保管の視覚フィードバックを表示する', () => {
    renderHome();
    expect(screen.getByText('下で保管')).toBeInTheDocument();
  });

  test('タスク操作後に表示中の最上部カードが更新される', async () => {
    const onComplete = vi.fn();
    renderHome({ onComplete });
    await userEvent.click(screen.getAllByRole('button', { name: '完了' })[0]);
    expect(onComplete).toHaveBeenCalled();
  });
});
