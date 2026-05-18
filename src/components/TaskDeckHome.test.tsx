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
    task({ id: 'one', title: '企画書の構成を整える', order: 1 }),
    task({ id: 'two', title: 'メールの返信をする', order: 2 }),
    task({ id: 'three', title: '資料をまとめる', order: 3 }),
  ],
  future: [task({ id: 'gym', title: 'ジムに行く', dueDate: '2026-05-20' })],
};

function renderHome(overrides = {}) {
  const props = {
    sections,
    onComplete: vi.fn(),
    onPostpone: vi.fn(),
    onArchive: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenArchive: vi.fn(),
    ...overrides,
  };

  render(<TaskDeckHome {...props} />);
  return props;
}

describe('TaskDeckHome', () => {
  test('Task Deckのアプリ名を表示する', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: 'Task Deck' })).toBeInTheDocument();
  });

  test('参考画像に合わせた短いサブコピーを表示する', () => {
    renderHome();
    expect(screen.getByText('3つだけ、シンプルに、今日やること。')).toBeInTheDocument();
  });

  test('期限切れタスクを最上部のエリアに表示する', () => {
    renderHome();
    expect(screen.getByLabelText('期限切れ')).toHaveTextContent('提出済みのレポートを確認する');
  });

  test('今日中タスクを優先順に最大3件表示する', () => {
    renderHome();
    const today = screen.getByLabelText('今日中');
    expect(today).toHaveTextContent('企画書の構成を整える');
    expect(today).toHaveTextContent('メールの返信をする');
    expect(today).toHaveTextContent('資料をまとめる');
  });

  test('明日以降の直近タスクを補助的に表示する', () => {
    renderHome();
    expect(screen.getByLabelText('明日以降')).toHaveTextContent('ジムに行く');
  });

  test('保管リストと設定をトップ操作として表示する', () => {
    renderHome();
    expect(screen.getByRole('button', { name: '保管リスト' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '設定' })).toBeInTheDocument();
  });

  test('保管済みタスク一覧をメイン画面に常時表示しない', () => {
    renderHome();
    expect(screen.queryByText('保管中のタスクはありません')).not.toBeInTheDocument();
  });

  test('通常タスクの操作メニューから完了できる', async () => {
    const onComplete = vi.fn();
    renderHome({ onComplete });
    await userEvent.click(screen.getByRole('button', { name: '企画書の構成を整えるの操作' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '完了' }));
    expect(onComplete.mock.calls[0][0].id).toBe('one');
  });

  test('通常タスクの操作メニューから後回しできる', async () => {
    const onPostpone = vi.fn();
    renderHome({ onPostpone });
    await userEvent.click(screen.getByRole('button', { name: 'メールの返信をするの操作' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '後回し' }));
    expect(onPostpone.mock.calls[0][0].id).toBe('two');
  });

  test('通常タスクの操作メニューから保管できる', async () => {
    const onArchive = vi.fn();
    renderHome({ onArchive });
    await userEvent.click(screen.getByRole('button', { name: '資料をまとめるの操作' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '保管' }));
    expect(onArchive.mock.calls[0][0].id).toBe('three');
  });

  test('期限切れタスクは後回しできない状態として表示する', () => {
    renderHome();
    expect(screen.getByRole('button', { name: '期限切れのため後回し不可' })).toBeDisabled();
  });
});
