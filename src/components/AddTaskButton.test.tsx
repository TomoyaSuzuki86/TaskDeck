import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { AddTaskButton } from './AddTaskButton';

describe('AddTaskButton', () => {
  test('画面下部に横長のタスク追加ボタンを表示する', () => {
    render(<AddTaskButton onManualAdd={vi.fn()} onVoiceAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: /タスクを追加/ })).toBeInTheDocument();
  });

  test('ボタン本体にはプラスアイコンとタスク追加ラベルを表示する', () => {
    render(<AddTaskButton onManualAdd={vi.fn()} onVoiceAdd={vi.fn()} />);
    expect(screen.getByText('タスクを追加')).toBeInTheDocument();
  });

  test('ボタン右端にマイクアイコンを表示する', () => {
    render(<AddTaskButton onManualAdd={vi.fn()} onVoiceAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: '音声入力' })).toBeInTheDocument();
  });

  test('ボタン本体をタップすると手入力モーダルが開く', async () => {
    const onManualAdd = vi.fn();
    render(<AddTaskButton onManualAdd={onManualAdd} onVoiceAdd={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /タスクを追加/ }));
    expect(onManualAdd).toHaveBeenCalled();
  });

  test('マイクアイコンをタップすると音声入力が開始される', async () => {
    const onVoiceAdd = vi.fn();
    render(<AddTaskButton onManualAdd={vi.fn()} onVoiceAdd={onVoiceAdd} />);
    await userEvent.click(screen.getByRole('button', { name: '音声入力' }));
    expect(onVoiceAdd).toHaveBeenCalled();
  });

  test('マイクアイコンをタップしても手入力モーダルは開かない', async () => {
    const onManualAdd = vi.fn();
    render(<AddTaskButton onManualAdd={onManualAdd} onVoiceAdd={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '音声入力' }));
    expect(onManualAdd).not.toHaveBeenCalled();
  });

  test('片手操作しやすい位置に追加ボタンを維持する', () => {
    render(<AddTaskButton onManualAdd={vi.fn()} onVoiceAdd={vi.fn()} />);
    expect(screen.getByLabelText('タスク追加')).toHaveClass('add-task-bar');
  });
});
