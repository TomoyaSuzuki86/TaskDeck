import { useState } from 'react';
import { Calendar, Tag, X } from 'lucide-react';

const defaultTags = ['仕事', '家庭', '買い物', '勉強', '手続き', 'その他'];

type ManualTaskModalProps = {
  today: string;
  onSave: (input: { title: string; dueDate: string | null; tags: string[] }) => void;
  onClose: () => void;
};

export function ManualTaskModal({ today, onSave, onClose }: ManualTaskModalProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(defaultTags);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const addTag = () => {
    const value = newTag.trim();
    if (!value || tags.includes(value)) return;
    setTags((current) => [...current, value]);
    setSelectedTags((current) => [...current, value]);
    setNewTag('');
  };

  const save = () => {
    if (!title.trim()) return;
    onSave({ title, dueDate: dueDate || today, tags: selectedTags });
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-sheet" role="dialog" aria-modal="true" aria-label="新しいタスク">
        <header className="modal-header">
          <button className="ghost-button" type="button" onClick={onClose} aria-label="キャンセル">
            <X size={20} aria-hidden="true" />
          </button>
          <h2>新しいタスク</h2>
          <button className="text-button" type="button" onClick={save} disabled={!title.trim()}>
            保存
          </button>
        </header>

        <label className="field-label">
          <span>タスク名</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="タスク名を入力" />
        </label>

        <label className="field-row">
          <Calendar size={19} aria-hidden="true" />
          <span>日付</span>
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>

        <div className="tag-section">
          <div className="tag-title">
            <Tag size={18} aria-hidden="true" />
            <span>タグ</span>
          </div>
          <div className="tag-list">
            {tags.map((tag) => (
              <button
                key={tag}
                className={selectedTags.includes(tag) ? 'tag-chip selected' : 'tag-chip'}
                type="button"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="new-tag-row">
            <input value={newTag} onChange={(event) => setNewTag(event.target.value)} placeholder="タグを追加" />
            <button type="button" onClick={addTag}>
              追加
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
