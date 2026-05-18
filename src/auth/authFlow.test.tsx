import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { AuthProvider } from './AuthProvider';
import { App } from '../App';
import { firebaseEnv, googleTasksScopes } from '../config/firebase';

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );
}

describe('Authentication flow', () => {
  test('未ログイン時はGoogleログイン画面を表示する', () => {
    renderApp();
    expect(screen.getByRole('button', { name: 'Googleでログイン' })).toBeInTheDocument();
  });

  test('Googleログイン成功後にTask Deckのメイン画面を表示する', async () => {
    renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Googleでログイン' }));
    expect(screen.getByRole('heading', { name: 'Task Deck' })).toBeInTheDocument();
  });

  test('ログアウト後はログイン画面に戻る', async () => {
    renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Googleでログイン' }));
    await userEvent.click(screen.getByRole('button', { name: /ログアウト/ }));
    expect(screen.getByRole('button', { name: 'Googleでログイン' })).toBeInTheDocument();
  });

  test('ログイン中ユーザーのuidを使って保存データを分離する', async () => {
    renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Googleでログイン' }));
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  test('タスク同期のためにGoogle Tasksのアクセススコープを要求する', () => {
    expect(googleTasksScopes).toContain('https://www.googleapis.com/auth/tasks');
  });

  test('Firebase設定値をコードに直接埋め込まない', () => {
    expect(JSON.stringify(firebaseEnv)).not.toContain('AIza');
  });

  test('Firebase設定値を環境変数から読み込む', () => {
    expect(Object.keys(firebaseEnv)).toContain('apiKey');
  });
});
