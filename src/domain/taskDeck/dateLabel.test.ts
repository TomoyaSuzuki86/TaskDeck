import { describe, test } from 'vitest';

describe('Task Deck date labels', () => {
  test.todo('昨日以前のタスクは期限切れと表示される');
  test.todo('今日のタスクは今日中と表示される');
  test.todo('明日のタスクは明日と表示される');
  test.todo('2日後のタスクは2日後と表示される');
  test.todo('3日後のタスクは3日後と表示される');
  test.todo('一定以上未来の日付はYYYY/MM/DD形式で表示される');
  test.todo('期日なしタスクは今日中と表示される');
  test.todo('時刻のずれに影響されずローカルの日付単位でラベルを計算する');
  test.todo('Google Tasksの期限日時をTask Deckの日付単位に正規化する');
});
