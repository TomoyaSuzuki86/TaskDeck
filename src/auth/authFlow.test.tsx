import { describe, test } from 'vitest';

describe('Authentication flow', () => {
  test.todo('未ログイン時はGoogleログイン画面を表示する');
  test.todo('Googleログイン成功後にTask Deckのメイン画面を表示する');
  test.todo('ログアウト後はログイン画面に戻る');
  test.todo('ログイン中ユーザーのuidを使って保存データを分離する');
  test.todo('タスク同期のためにGoogle Tasksのアクセススコープを要求する');
  test.todo('Firebase設定値をコードに直接埋め込まない');
  test.todo('Firebase設定値を環境変数から読み込む');
});
