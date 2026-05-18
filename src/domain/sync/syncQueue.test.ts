import { describe, test } from 'vitest';

describe('Task Deck sync queue', () => {
  test.todo('Task Deckでタスクを作成したときGoogle Tasks作成操作をキューに積む');
  test.todo('Task Deckでタスクを完了したときGoogle Tasks完了操作をキューに積む');
  test.todo('Google TasksのタスクをTask Deckに取り込める');
  test.todo('Google Tasks同期に失敗してもローカルタスクを保持する');
  test.todo('失敗した同期操作を再試行待ちとして記録する');
  test.todo('再試行待ちの同期操作を再実行できる');
  test.todo('再試行時にGoogle連携済みタスクを重複作成しない');
  test.todo('オフライン中もユーザー操作を受け付けられる');
  test.todo('オフライン中のタスク作成を後続同期用にキューへ積む');
  test.todo('オンライン復帰後にキュー済み同期操作を処理する');
  test.todo('同期状態をUI表示状態とは分離して保持する');
});
