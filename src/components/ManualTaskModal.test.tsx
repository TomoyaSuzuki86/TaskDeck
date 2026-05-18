import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { ManualTaskModal } from './ManualTaskModal';

describe('ManualTaskModal', () => {
  test('タスク名入力欄を表示する', () => {
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText('例）企画書を仕上げる')).toBeInTheDocument();
  });

  test('時刻入力なしの日付セレクターを表示する', () => {
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByLabelText('日付')).toHaveAttribute('type', 'date');
  });

  test('任意のタグ選択UIを表示する', () => {
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('タグ（任意）')).toBeInTheDocument();
  });

  test('複数タグを選択できる', async () => {
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '仕事' }));
    await userEvent.click(screen.getByRole('button', { name: '勉強' }));
    expect(screen.getByRole('button', { name: '仕事' })).toHaveClass('selected');
    expect(screen.getByRole('button', { name: '勉強' })).toHaveClass('selected');
  });

  test('初期タグ候補を表示する', () => {
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'プライベート' })).toBeInTheDocument();
  });

  test('新しいタグ候補を追加できる', async () => {
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText('タグを追加'), '読書');
    await userEvent.click(screen.getByRole('button', { name: '追加' }));
    expect(screen.getByRole('button', { name: '読書' })).toBeInTheDocument();
  });

  test('タスク名、日付、タグを指定して保存できる', async () => {
    const onSave = vi.fn();
    render(<ManualTaskModal today="2026-05-19" onSave={onSave} onClose={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText('例）企画書を仕上げる'), '資料作成');
    await userEvent.type(screen.getByLabelText('日付'), '2026-05-21');
    await userEvent.click(screen.getByRole('button', { name: '仕事' }));
    await userEvent.click(screen.getByRole('button', { name: '追加する' }));
    expect(onSave).toHaveBeenCalledWith({ title: '資料作成', dueDate: '2026-05-21', tags: ['仕事'] });
  });

  test('日付を選ばない場合は今日中として保存する', async () => {
    const onSave = vi.fn();
    render(<ManualTaskModal today="2026-05-19" onSave={onSave} onClose={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText('例）企画書を仕上げる'), '資料作成');
    await userEvent.click(screen.getByRole('button', { name: '追加する' }));
    expect(onSave.mock.calls[0][0].dueDate).toBe('2026-05-19');
  });

  test('閉じるボタンを押すとタスクを作成せず閉じる', async () => {
    const onClose = vi.fn();
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(onClose).toHaveBeenCalled();
  });

  test('空のタスク名では保存できない', () => {
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: '追加する' })).toBeDisabled();
  });

  test('音声入力ボタンを任意で表示できる', async () => {
    const onVoiceOpen = vi.fn();
    render(<ManualTaskModal today="2026-05-19" onSave={vi.fn()} onClose={vi.fn()} onVoiceOpen={onVoiceOpen} />);
    await userEvent.click(screen.getByRole('button', { name: '音声入力' }));
    expect(onVoiceOpen).toHaveBeenCalled();
  });
});
