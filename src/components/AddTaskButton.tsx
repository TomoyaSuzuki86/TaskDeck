import { Archive, CheckCircle2, Plus } from 'lucide-react';

type AddTaskButtonProps = {
  onManualAdd: () => void;
  onOpenArchive: () => void;
  onOpenCompleted: () => void;
};

export function AddTaskButton({ onManualAdd, onOpenArchive, onOpenCompleted }: AddTaskButtonProps) {
  return (
    <nav className="bottom-dock" aria-label="下部ナビゲーション">
      <button className="dock-side" type="button" onClick={onOpenArchive}>
        <Archive size={23} aria-hidden="true" />
        <span>保管リスト</span>
      </button>
      <button className="dock-add" type="button" onClick={onManualAdd} aria-label="タスクを追加">
        <Plus size={42} aria-hidden="true" />
        <span>タスクを追加</span>
      </button>
      <button className="dock-side" type="button" onClick={onOpenCompleted}>
        <CheckCircle2 size={23} aria-hidden="true" />
        <span>完了履歴</span>
      </button>
    </nav>
  );
}
