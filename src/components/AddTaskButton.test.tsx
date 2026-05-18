import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { AddTaskButton } from './AddTaskButton';

function renderDock(overrides = {}) {
  const props = {
    onManualAdd: vi.fn(),
    onOpenArchive: vi.fn(),
    onOpenCompleted: vi.fn(),
    ...overrides,
  };

  render(<AddTaskButton {...props} />);
  return props;
}

describe('AddTaskButton', () => {
  test('画面下部にドック型ナビゲーションを表示する', () => {
    renderDock();
    expect(screen.getByLabelText('下部ナビゲーション')).toHaveClass('bottom-dock');
  });

  test('中央にタスク追加ボタンを表示する', () => {
    renderDock();
    expect(screen.getByRole('button', { name: 'タスクを追加' })).toBeInTheDocument();
  });

  test('左に保管リストボタンを表示する', () => {
    renderDock();
    expect(screen.getByRole('button', { name: '保管リスト' })).toBeInTheDocument();
  });

  test('右に完了履歴ボタンを表示する', () => {
    renderDock();
    expect(screen.getByRole('button', { name: '完了履歴' })).toBeInTheDocument();
  });

  test('中央ボタンをタップすると手入力モーダルを開く', async () => {
    const onManualAdd = vi.fn();
    renderDock({ onManualAdd });
    await userEvent.click(screen.getByRole('button', { name: 'タスクを追加' }));
    expect(onManualAdd).toHaveBeenCalled();
  });

  test('保管リストボタンをタップすると保管リストを開く', async () => {
    const onOpenArchive = vi.fn();
    renderDock({ onOpenArchive });
    await userEvent.click(screen.getByRole('button', { name: '保管リスト' }));
    expect(onOpenArchive).toHaveBeenCalled();
  });

  test('完了履歴ボタンをタップすると完了履歴を開く', async () => {
    const onOpenCompleted = vi.fn();
    renderDock({ onOpenCompleted });
    await userEvent.click(screen.getByRole('button', { name: '完了履歴' }));
    expect(onOpenCompleted).toHaveBeenCalled();
  });
});
