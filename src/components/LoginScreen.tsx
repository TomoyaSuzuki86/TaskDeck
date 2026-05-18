import { CheckCircle2 } from 'lucide-react';

type LoginScreenProps = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <main className="login-screen">
      <section className="login-panel" aria-label="Googleログイン">
        <div className="app-mark">
          <CheckCircle2 size={30} aria-hidden="true" />
        </div>
        <h1>Task Deck</h1>
        <p>今日やることを3つだけ。迷わず、上から片づけるためのタスクデッキ。</p>
        <button className="google-login" type="button" onClick={onLogin}>
          Googleでログイン
        </button>
      </section>
    </main>
  );
}
