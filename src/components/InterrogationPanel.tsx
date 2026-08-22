import { useEffect, useRef, useState } from 'react';
import { HelpCircle, Microscope, SearchCheck, SendHorizonal, X, MessagesSquare, CornerDownRight, Undo2 } from 'lucide-react';
import type { AgentInfo, ChatMessage, FixedActionType, CaseData } from '../game/types';

interface Props {
  caseData: CaseData;
  agent: AgentInfo;
  used: Record<FixedActionType, boolean>;
  tokens: number;
  chat: ChatMessage[];
  freeBusy: boolean;
  onAction: (t: FixedActionType) => void;
  onFree: (text: string) => void;
  onClose: () => void;
}

const ACTION_META: { type: FixedActionType; icon: typeof HelpCircle; desc: string }[] = [
  { type: 'ask', icon: HelpCircle, desc: '一次基础提问' },
  { type: 'probe', icon: Microscope, desc: '深挖回答的来路' },
  { type: 'verify', icon: SearchCheck, desc: '调取原始工作记录' },
];

export function InterrogationPanel({
  caseData,
  agent,
  used,
  tokens,
  chat,
  freeBusy,
  onAction,
  onFree,
  onClose,
}: Props) {
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState<FixedActionType | null>(null);
  const isCase002 = !!caseData.case002;
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [chat.length]);

  useEffect(() => {
    setPending(null);
    setDraft('');
  }, [agent.id]);

  const freeLeft = caseData.freeMaxChars - draft.length;
  const freeOk = tokens >= caseData.freeCost && draft.trim().length > 0 && !freeBusy;
  const pendingAction = pending ? caseData.actions[agent.id][pending] : null;

  return (
    <section className="interro-panel" style={{ ['--accent' as string]: agent.accent }}>
      <header className="interro-head">
        <div>
          <div className="interro-title">
            {agent.name} <span className="interro-code">{agent.code}</span>
          </div>
          <div className="interro-sub">单独质询中 · 其余 AI 已隔离场外</div>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="返回大厅">
          <X size={20} />
        </button>
      </header>

      <div className="interro-report">
        <span className="interro-report-label">初始结论（可随时回看）</span>
        <strong>{agent.report.conclusion}</strong>
        <p>{agent.report.detail}</p>
      </div>

      <div className="interro-actions">
        {ACTION_META.map(({ type, icon: Icon, desc }) => {
          const action = caseData.actions[agent.id][type];
          const isUsed = used[type];
          const afford = tokens >= action.cost;
          const isPending = pending === type;
          return (
            <button
              key={type}
              className={`action-btn ${isUsed ? 'used' : ''} ${isPending ? 'pending' : ''}`}
              disabled={isUsed || !afford}
              onClick={() => setPending(isPending ? null : type)}
            >
              <Icon size={17} />
              <span className="action-name">{action.label}</span>
              <span className="action-desc">{desc}</span>
              {isUsed ? (
                <span className="action-state done">已调查</span>
              ) : afford ? (
                <span className="action-state">-{action.cost} TOKEN</span>
              ) : (
                <span className="action-state short">余额不足</span>
              )}
            </button>
          );
        })}
      </div>

      {pendingAction && (
        <div className="ask-preview">
          <div className="ask-preview-head">
            <CornerDownRight size={15} />
            预览 · {pendingAction.label}将提问
          </div>
          <p className="ask-preview-question">“{pendingAction.question}”</p>
          <div className="ask-preview-foot">
            <span className="ask-preview-cost">确认后消耗 {pendingAction.cost} TOKEN</span>
            <div className="ask-preview-btns">
              <button className="btn btn-ghost btn-sm" onClick={() => setPending(null)}>
                <Undo2 size={14} /> 换个问题
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onAction(pendingAction.type);
                  setPending(null);
                }}
              >
                <SendHorizonal size={14} /> 确认发问
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="interro-log" ref={logRef}>
        {chat.length === 0 && (
          <p className="log-hint">
            <MessagesSquare size={15} /> 质询记录会显示在这里。先点上方按钮预览问题，确认后才会发问。
          </p>
        )}
        {chat.map((m, i) => (
          <div key={i} className={`log-row ${m.from}`}>
            <span className="log-who">{m.from === 'player' ? '你' : agent.name}</span>
            <div className="log-bubble">
              {m.tag && <span className="log-tag">{m.tag}</span>}
              {m.text}
            </div>
          </div>
        ))}
        {freeBusy && (
          <div className="log-row agent">
            <span className="log-who">{agent.name}</span>
            <div className="log-bubble typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      {!isCase002 && (
        <div className="interro-free">
          <div className="free-input-row">
            <input
              value={draft}
              maxLength={caseData.freeMaxChars}
              placeholder={`自由质询（≤${caseData.freeMaxChars} 字 · 不扣 TOKEN）`}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && freeOk) {
                  onFree(draft);
                  setDraft('');
                }
              }}
            />
            <button
              className="btn btn-primary"
              disabled={!freeOk}
              onClick={() => {
                onFree(draft);
                setDraft('');
              }}
            >
              <SendHorizonal size={16} />
              {tokens < caseData.freeCost ? '余额不足' : freeBusy ? '询问中…' : '发出'}
            </button>
          </div>
          <div className="free-meta">
            <span>剩余字数 {freeLeft}</span>
            <span>自由质询正在打磨，Demo 版暂不扣除 TOKEN · 正式版会做得更好</span>
          </div>
        </div>
      )}
    </section>
  );
}
