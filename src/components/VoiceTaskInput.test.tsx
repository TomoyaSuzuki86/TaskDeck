import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { VoiceTaskInput } from './VoiceTaskInput';

describe('VoiceTaskInput', () => {
  test('マイクボタンから開いたとき音声認識を開始する', () => {
    render(<VoiceTaskInput onCreate={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: '音声入力' })).toBeInTheDocument();
  });

  test('マイクを中心にした認識中UIを表示する', () => {
    render(<VoiceTaskInput onCreate={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('話してください')).toBeInTheDocument();
  });

  test('認識中に変換されたテキストを表示する', async () => {
    render(<VoiceTaskInput onCreate={vi.fn()} onClose={vi.fn()} />);
    await userEvent.type(screen.getByLabelText('認識中テキスト'), '銀行に行く');
    expect(screen.getByDisplayValue('銀行に行く')).toBeInTheDocument();
  });

  test('認識した音声テキストをタスク名として作成する', async () => {
    const onCreate = vi.fn();
    render(<VoiceTaskInput onCreate={onCreate} onClose={vi.fn()} />);
    await userEvent.type(screen.getByLabelText('認識中テキスト'), '銀行に行く');
    await userEvent.click(screen.getByRole('button', { name: '明日のタスクに追加' }));
    expect(onCreate).toHaveBeenCalledWith('銀行に行く');
  });

  test('音声入力タスクは明日の期日で作成する', () => {
    render(<VoiceTaskInput onCreate={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText(/明日のタスクとして追加されます/)).toBeInTheDocument();
  });

  test('音声入力中はタグ入力を求めない', () => {
    render(<VoiceTaskInput onCreate={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByText('タグ')).not.toBeInTheDocument();
  });

  test('音声タスク追加後に完了フィードバックを表示する', async () => {
    render(<VoiceTaskInput onCreate={vi.fn()} onClose={vi.fn()} />);
    await userEvent.type(screen.getByLabelText('認識中テキスト'), '銀行に行く');
    await userEvent.click(screen.getByRole('button', { name: '明日のタスクに追加' }));
    expect(screen.getByText('追加しました')).toBeInTheDocument();
  });

  test('作成した音声タスクの日付とタグを後から編集できる', () => {
    render(<VoiceTaskInput onCreate={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText(/タグは後から編集できます/)).toBeInTheDocument();
  });

  test('ブラウザが音声認識に未対応でも破綻しない', () => {
    render(<VoiceTaskInput onCreate={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText(/テキスト入力で代用できます/)).toBeInTheDocument();
  });
});
