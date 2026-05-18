import { describe, expect, test } from 'vitest';
import { createManualTask, createVoiceTask } from './taskCreation';

const now = new Date('2026-05-19T09:00:00+09:00');

describe('Task Deck task creation', () => {
  test('手入力でタスク名を指定してタスクを作成できる', () => {
    expect(createManualTask({ title: '資料を読む', now }).title).toBe('資料を読む');
  });

  test('手入力で日付を選ばなかった場合は今日中のタスクとして作成される', () => {
    expect(createManualTask({ title: '資料を読む', now }).dueDate).toBe('2026-05-19');
  });

  test('手入力で1つのタグを設定して作成できる', () => {
    expect(createManualTask({ title: '資料を読む', tags: ['仕事'], now }).tags).toEqual(['仕事']);
  });

  test('手入力で複数タグを設定して作成できる', () => {
    expect(createManualTask({ title: '資料を読む', tags: ['仕事', '勉強'], now }).tags).toEqual(['仕事', '勉強']);
  });

  test('音声入力では認識した文章をタスク名として作成できる', () => {
    expect(createVoiceTask({ title: '牛乳を買う', now }).title).toBe('牛乳を買う');
  });

  test('音声入力で作成したタスクは初期状態で明日の期日になる', () => {
    expect(createVoiceTask({ title: '牛乳を買う', now }).dueDate).toBe('2026-05-20');
  });

  test('音声入力で作成したタスクにはタグが設定されない', () => {
    expect(createVoiceTask({ title: '牛乳を買う', now }).tags).toEqual([]);
  });

  test('空文字のタスク名では作成できない', () => {
    expect(() => createManualTask({ title: '   ', now })).toThrow('タスク名');
  });

  test('タスク名の前後の空白はトリムされる', () => {
    expect(createManualTask({ title: '  メールする  ', now }).title).toBe('メールする');
  });

  test('新規Task Deckタスクはactiveステータスで作成される', () => {
    expect(createManualTask({ title: '資料を読む', now }).status).toBe('active');
  });

  test('新規Task DeckタスクはsourceがtaskDeckになる', () => {
    expect(createManualTask({ title: '資料を読む', now }).source).toBe('taskDeck');
  });

  test('タスク作成時にcreatedAtとupdatedAtが設定される', () => {
    const task = createManualTask({ title: '資料を読む', now });
    expect(task.createdAt).toBe(now.toISOString());
    expect(task.updatedAt).toBe(now.toISOString());
  });

  test('タスク作成時に時刻の入力は不要である', () => {
    expect(createManualTask({ title: '資料を読む', dueDate: '2026-05-21', now }).dueDate).toBe('2026-05-21');
  });
});
