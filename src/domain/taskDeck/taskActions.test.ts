import { describe, test } from 'vitest';

describe('Task Deck card actions', () => {
  test.todo('左スワイプでタスクが完了になる');
  test.todo('完了したタスクはメインデッキから消える');
  test.todo('完了後に次のタスクが最上部に上がる');
  test.todo('右スワイプでタスクが後回しになる');
  test.todo('後回ししたタスクの期日は明日になる');
  test.todo('後回ししたタスクにはpostponedAtが設定される');
  test.todo('後回ししたタスクがすぐ再表示されないようにsnoozedUntilが設定される');
  test.todo('後回ししたタスクは同じ表示セッション内では再表示されない');
  test.todo('下スワイプでタスクが保管される');
  test.todo('保管したタスクはメインデッキから消える');
  test.todo('保管したタスクは保管リストに表示される');
  test.todo('保管したタスクをアクティブなデッキに復元できる');
  test.todo('タスクを保管しても期日は変更されない');
  test.todo('復元した期限切れタスクは期限切れかつ最優先として表示される');
  test.todo('期限切れタスクは後回しできない');
  test.todo('期限切れタスクは完了できる');
  test.todo('期限切れタスクは保管できる');
  test.todo('保管した期限切れタスクはメインデッキから消える');
  test.todo('保管リストから戻した期限切れタスクは再び最優先で表示される');
});
