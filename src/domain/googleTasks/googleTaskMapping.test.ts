import { describe, test } from 'vitest';

describe('Google Tasks mapping', () => {
  test.todo('Task Deckのタスク名をGoogle Tasksのtitleに変換できる');
  test.todo('Task DeckのdueDateをGoogle Tasksのdueに変換できる');
  test.todo('Task Deckの完了済みタスクをGoogle Tasksのcompletedステータスに変換できる');
  test.todo('Task DeckのアクティブタスクをGoogle TasksのneedsActionステータスに変換できる');
  test.todo('連携済みタスクを変換するときgoogleTaskIdを保持する');
  test.todo('連携済みタスクを変換するときgoogleTaskListIdを保持する');
  test.todo('Google TasksのタスクをTask Deckのタスクに変換できる');
  test.todo('Google TasksのcompletedステータスをTask Deckのcompletedステータスに反映できる');
  test.todo('Google TasksのneedsActionステータスをTask Deckのactiveステータスに反映できる');
  test.todo('Google側に期日がないタスクはTask Deckでは今日中として扱う');
  test.todo('Google側の期限日時をYYYY-MM-DDの日付に正規化する');
  test.todo('Google Tasks APIのデータ形式をアダプタ層の外へ漏らさない');
});
