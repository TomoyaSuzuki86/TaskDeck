import { Mic, Plus } from 'lucide-react';

type AddTaskButtonProps = {
  onManualAdd: () => void;
  onVoiceAdd: () => void;
};

export function AddTaskButton({ onManualAdd, onVoiceAdd }: AddTaskButtonProps) {
  return (
    <div className="add-task-bar" aria-label="タスク追加">
      <button className="add-task-main" type="button" onClick={onManualAdd}>
        <Plus size={25} aria-hidden="true" />
        <span>タスクを追加</span>
      </button>
      <button className="add-task-mic" type="button" aria-label="音声入力" onClick={onVoiceAdd}>
        <Mic size={24} aria-hidden="true" />
      </button>
    </div>
  );
}
