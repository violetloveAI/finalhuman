import { KeyRound, ScrollText, X } from 'lucide-react';
import type { Clue } from '../game/types';

interface Props {
  clues: Clue[];
  open: boolean;
  onToggle: () => void;
  onPick: (clue: Clue) => void;
  agentName: (id: Clue['agent']) => string;
}

export function CluePanel({ clues, open, onToggle, onPick, agentName }: Props) {
  return (
    <>
      <button className="clue-toggle" onClick={onToggle}>
        <ScrollText size={18} />
        <span>线索栏</span>
        <span className="clue-count">{clues.length}</span>
      </button>
      <aside className={`clue-panel ${open ? 'open' : ''}`}>
        <header className="clue-panel-head">
          <h3>线索栏</h3>
          <span className="clue-panel-sub">{clues.length} 条已收集</span>
          <button className="icon-btn" onClick={onToggle} aria-label="收起线索栏">
            <X size={18} />
          </button>
        </header>
        <div className="clue-list">
          {clues.length === 0 && <p className="clue-empty">还没有线索。选择一个 AI 同事开始调查。</p>}
          {clues.map((c) => (
            <button key={c.id} className={`clue-item ${c.key ? 'clue-item-key' : ''}`} onClick={() => onPick(c)}>
              <div className="clue-item-top">
                {c.key && <KeyRound size={14} className="clue-key-icon" />}
                <span className="clue-title">{c.title}</span>
              </div>
              <div className="clue-from">来源：{agentName(c.agent)}</div>
              <div className="clue-summary">{c.summary}</div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
