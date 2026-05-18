# Task Deck テストTODO一覧

Task Deckの最初の仕様洗い出しとして作成したテストTODO一覧です。現時点では、実装には進まず、ユーザー確認用の仕様TODOだけを置いています。

## ドメインロジック

- `src/domain/taskDeck/taskOrdering.test.ts`
  - 期限切れ優先、今日中タスク、明日以降の補完、期日なしを今日扱い、order順、表示件数制限、完了・保管済みの除外、後回し直後の非表示をカバーします。
- `src/domain/taskDeck/dateLabel.test.ts`
  - 期限切れ、今日中、明日、2日後、3日後、未来日付表示、日付単位の正規化をカバーします。
- `src/domain/taskDeck/taskCreation.test.ts`
  - 手入力追加、音声入力追加、初期日付、タグ、空文字チェック、空白トリム、source/status、時刻なし作成をカバーします。
- `src/domain/taskDeck/taskActions.test.ts`
  - 左・右・下スワイプ、完了、後回し、スヌーズ、保管、復元、期限切れタスクの例外動作をカバーします。

## Google Tasks連携と同期

- `src/domain/googleTasks/googleTaskMapping.test.ts`
  - Task DeckからGoogle Tasksへの変換、Google TasksからTask Deckへの変換、完了状態、期日正規化、アダプタ境界の分離をカバーします。
- `src/domain/sync/syncQueue.test.ts`
  - 作成・完了・取り込みの同期、失敗時のローカル保持、再試行、オフライン時のキュー、オンライン復帰後の処理をカバーします。

## UI

- `src/components/TaskDeckHome.test.tsx`
  - メインデッキ画面、参考画像に沿った見た目、期限切れ・今日中・明日以降のエリア、3件集中表示、設定、スワイプフィードバックをカバーします。
- `src/components/AddTaskButton.test.tsx`
  - 画面下部の追加ボタン、プラス表示、右端マイク、手入力と音声入力のタップ領域分離をカバーします。
- `src/components/ManualTaskModal.test.tsx`
  - タスク名、日付、タグ、複数タグ、初期候補、新規タグ、保存・キャンセル、空文字チェックをカバーします。
- `src/components/VoiceTaskInput.test.tsx`
  - 音声認識、認識テキスト、明日デフォルト、タグ入力なし、追加完了フィードバック、後から編集、未対応ブラウザ対応をカバーします。

## 認証とPWA

- `src/auth/authFlow.test.tsx`
  - 未ログイン表示、Googleログイン成功、ログアウト、uidによるデータ分離、Google Tasksスコープ、Firebase環境変数をカバーします。
- `src/pwa/pwaBehavior.test.ts`
  - インストール可能なmanifest、オフライン時の最低限表示、オフライン追加、同期待ち、オンライン復帰、スマホ操作性、Firebase Hosting想定構成をカバーします。

## 確認したい仕様

- 期限切れタスクは、通常タスクの3件制限とは別枠で表示するか。
- 後回しタスクは、もともと未来日のタスクでも常に明日に移動するか。
- 音声入力は、認識後すぐ作成するか、確認ステップを挟むか。
- 日付ラベルは、何日後から `YYYY/MM/DD` 表示に切り替えるか。
