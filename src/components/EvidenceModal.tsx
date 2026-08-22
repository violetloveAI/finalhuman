import { useEffect, useRef } from 'react';
import { Fingerprint, KeyRound } from 'lucide-react';
import type { EvidenceCardData } from '../game/types';

interface Props {
  evidence: EvidenceCardData;
  onClose: () => void;
  autoCloseMs?: number;
  intense?: boolean;
}

export function EvidenceModal({ evidence, onClose, autoCloseMs, intense }: Props) {
  const keyCard = !!evidence.key;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!autoCloseMs) return;
    const timer = window.setTimeout(() => onCloseRef.current(), autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [evidence.title, keyCard, autoCloseMs]);

  return (
    <div className={`modal-backdrop ${intense ? 'modal-intense' : ''}`} onClick={onClose}>
      {intense && <div className="shock-rays" />}
      <div
        className={`evidence-card ${keyCard ? 'evidence-key' : ''} ${intense ? 'evidence-slam' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {keyCard && (
          <div className="evidence-key-ribbon">
            <KeyRound size={15} /> 关键证据
          </div>
        )}
        <header className="evidence-head">
          <Fingerprint size={20} className="evidence-fingerprint" />
          <div>
            <h3 className="evidence-title">{evidence.title}</h3>
            {evidence.subtitle && <p className="evidence-subtitle">{evidence.subtitle}</p>}
          </div>
        </header>
        <div className="evidence-body">
          {evidence.sections.map((sec, i) =>
            sec.special === 'simulated-user' ? (
              <div key={i} className="evidence-section sim-user-section">
                <div className="sim-user-heading">{sec.heading}</div>
                <div className="sim-user-name">
                  {sec.lines.find((l) => l.label === '姓名')?.value ?? '王总'}
                </div>
              </div>
            ) : (
              <div key={i} className="evidence-section" style={{ animationDelay: `${0.25 + i * 0.35}s` }}>
                {sec.heading && <div className="ev-heading">{sec.heading}</div>}
                <ul>
                  {sec.lines.map((l, j) => (
                    <li key={j}>
                      {l.label && <span className="ev-label">{l.label}</span>}
                      <span className="ev-value">{l.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
        {evidence.footer && <footer className="evidence-footer">{evidence.footer}</footer>}
        <button className="btn btn-primary evidence-confirm" onClick={onClose}>
          {keyCard ? '收下这份证据' : '确认'}
        </button>
      </div>
    </div>
  );
}
