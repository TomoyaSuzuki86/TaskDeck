import { useState } from 'react';
import { Calendar, Mic, Tag, X } from 'lucide-react';

const defaultTags = ['仕事', 'プライベート', '勉強', '運動', 'その他'];

type ManualTaskModalProps = {
  today: string;
  onSave: (input: { title: string; dueDate: string | null; tags: string[] }) => void;
  onClose: () => void;
  onVoiceOpen?: () => void;
};

export function ManualTaskModal({ today, onSave, onClose, onVoiceOpen }: ManualTaskModalProps) {
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
    onSave({ title: title.trim(), dueDate: dueDate || today, tags: selectedTags });
  };

  return (
    <div className="modal-backdrop modal-dark" role="presentation">
      <section className="modal-sheet" role="dialog" aria-modal="true" aria-label="タスクを追加">
        <header className="modal-header">
          <h2>タスクを追加</h2>
          <button className="modal-close" type="button" onClick={onClose} aria-label="閉じる">
            <X size={23} aria-hidden="true" />
          </button>
        </header>

        <label className="field-label">
          <span>タスク名</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例）企画書を仕上げる" />
        </label>

        <label className="field-row">
          <Calendar size={18} aria-hidden="true" />
          <span>日付</span>
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} aria-label="日付" />
        </label>

        <div className="tag-section">
          <div className="tag-title">
            <Tag size={17} aria-hidden="true" />
            <span>タグ（任意）</span>
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

        <div className="modal-footer">
          <button className="primary-button" type="button" onClick={save} disabled={!title.trim()}>
            追加する
          </button>
          {onVoiceOpen && (
            <button className="modal-mic-button" type="button" aria-label="音声入力" onClick={onVoiceOpen}>
              <Mic size={22} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
