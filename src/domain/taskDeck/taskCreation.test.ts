import { describe, test } from 'vitest';

describe('Task Deck task creation', () => {
  test.todo('手入力でタスク名を指定してタスクを作成できる');
  test.todo('手入力で日付を選ばなかった場合は今日中のタスクとして作成される');
  test.todo('手入力で1つのタグを設定して作成できる');
  test.todo('手入力で複数タグを設定して作成できる');
  test.todo('音声入力では認識した文章をタスク名として作成できる');
  test.todo('音声入力で作成したタスクは初期状態で明日の期日になる');
  test.todo('音声入力で作成したタスクにはタグが設定されない');
  test.todo('空文字のタスク名では作成できない');
  test.todo('タスク名の前後の空白はトリムされる');
  test.todo('新規Task Deckタスクはactiveステータスで作成される');
  test.todo('新規Task DeckタスクはsourceがtaskDeckになる');
  test.todo('タスク作成時にcreatedAtとupdatedAtが設定される');
  test.todo('タスク作成時に時刻の入力は不要である');
});
