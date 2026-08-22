import { BadgeCheck, KeyRound, AlertTriangle } from 'lucide-react';
import type { ToastMsg } from '../game/useGame';

export function Toasts({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          {t.kind === 'key' ? <KeyRound size={18} /> : t.kind === 'warn' ? <AlertTriangle size={18} /> : <BadgeCheck size={18} />}
          <div>
            <div className="toast-title">{t.title}</div>
            {t.body && <div className="toast-body">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
