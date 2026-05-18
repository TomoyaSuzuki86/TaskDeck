import { useState } from 'react';
import { Mic, X } from 'lucide-react';

type VoiceTaskInputProps = {
  onCreate: (title: string) => void;
  onClose: () => void;
};

export function VoiceTaskInput({ onCreate, onClose }: VoiceTaskInputProps) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const speechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const save = () => {
    if (!text.trim()) return;
    onCreate(text);
    setDone(true);
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="voice-sheet" role="dialog" aria-modal="true" aria-label="音声入力">
        <button className="voice-close" type="button" onClick={onClose} aria-label="閉じる">
          <X size={20} aria-hidden="true" />
        </button>
        <div className="voice-orb">
          <Mic size={54} aria-hidden="true" />
        </div>
        <h2>{done ? '追加しました' : '話してください'}</h2>
        {!speechSupported && <p className="support-note">このブラウザでは音声認識が使えないため、テキスト入力で代用できます。</p>}
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="認識中テキスト"
          aria-label="認識中テキスト"
        />
        <p className="voice-note">明日のタスクとして追加されます。タグは後から編集できます。</p>
        <button className="primary-button" type="button" onClick={save} disabled={!text.trim()}>
          明日のタスクに追加
        </button>
      </section>
    </div>
  );
}
