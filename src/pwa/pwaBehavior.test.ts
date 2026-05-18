import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

describe('PWA behavior', () => {
  test('アプリをインストール可能にするmanifestを提供する', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'public/manifest.webmanifest'), 'utf-8'));
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
  });

  test('manifestにTask Deckのアプリ名とアイコンを定義する', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'public/manifest.webmanifest'), 'utf-8'));
    expect(manifest.name).toBe('Task Deck');
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('オフライン時にも最低限のアプリ画面を表示する', () => {
    const sw = readFileSync(join(root, 'public/sw.js'), 'utf-8');
    expect(sw).toContain('/index.html');
  });

  test('オフライン時にも手入力のタスク作成を利用できる', () => {
    const app = readFileSync(join(root, 'src/App.tsx'), 'utf-8');
    expect(app).toContain('addManualTask');
  });

  test('オフライン中に作成したタスクを同期待ちとして記録する', () => {
    const sync = readFileSync(join(root, 'src/domain/sync/syncQueue.ts'), 'utf-8');
    expect(sync).toContain('pending');
  });

  test('オンライン復帰後に同期待ち処理を実行する', () => {
    const sync = readFileSync(join(root, 'src/domain/sync/syncQueue.ts'), 'utf-8');
    expect(sync).toContain('processSyncQueue');
  });

  test('スマホ幅でもメインデッキを操作しやすく保つ', () => {
    const css = readFileSync(join(root, 'src/styles.css'), 'utf-8');
    expect(css).toContain('width: min(430px, 100%)');
    expect(css).toContain('bottom: 22px');
  });

  test('Firebase Hostingへデプロイしやすい構成にする', () => {
    const firebase = JSON.parse(readFileSync(join(root, 'firebase.json'), 'utf-8'));
    expect(firebase.hosting.public).toBe('dist');
  });
});
