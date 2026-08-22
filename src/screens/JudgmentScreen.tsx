import { useEffect, useState } from 'react';
import { Gavel, Check, X as XIcon, CircleCheckBig, Send, Lightbulb, DoorOpen } from 'lucide-react';
import { Portrait } from '../components/Portrait';
import type { GameApi } from '../game/useGame';
import type { AgentId, Verdict } from '../game/types';
import case1VictoryCg from '../assets/cg/case1-victory.jpg';
import case23VictoryCg from '../assets/cg/victory-bg-flash.jpg';

const STEP_TITLES = ['环节一 · 幻觉存在性', '环节二 · 结论可信度', '环节三 · 指认幻觉源头'];

export function JudgmentScreen({ game }: { game: GameApi }) {
  const { caseData, state } = game;
  const [step, setStep] = useState(0);
  const [sel1, setSel1] = useState<string | null>(null);
  const [sel2, setSel2] = useState<Partial<Record<AgentId, Verdict>>>({});
  const [sel3, setSel3] = useState<Set<AgentId>>(new Set());
  const [correctStep, setCorrectStep] = useState<number | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [case002Win, setCase002Win] = useState(false);
  const [case1Victory, setCase1Victory] = useState(false);
  const [victoryFlash, setVictoryFlash] = useState(false);
  const isCase002 = !!caseData.case002;
  const isCase001 = caseData.id === 'case001';
  const isCase003 = caseData.id === 'case003';
  const agentOf = (id: AgentId) => caseData.agents.find((a) => a.id === id)!;

  useEffect(() => {
    if (correctStep === null) return;
    const timer = window.setTimeout(() => {
      setCorrectStep(null);
      if (correctStep >= 2) {
        if (isCase001) {
          setCase1Victory(true);
          window.setTimeout(() => game.winCase(), 1000);
        } else if (isCase003) {
          setVictoryFlash(true);
          window.setTimeout(() => game.winCase(), 2000);
        } else {
          game.winCase();
        }
      } else {
        setStep(correctStep + 1);
      }
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [correctStep]);

  const submitQ1 = () => {
    if (!sel1) return;
    const ok = game.submitQ1(sel1);
    if (!ok) return;
    if (isCase002) {
      setCase002Win(true);
      window.setTimeout(() => game.winCase(), 2000);
    } else {
      setCorrectStep(0);
    }
  };

  const submitQ2 = () => {
    if (caseData.judgment.q2.items.some((i) => !sel2[i.agent])) return;
    if (game.submitQ2(sel2)) setCorrectStep(1);
  };

  const submitQ3 = () => {
    if (isCase002) {
      if (game.submitQ3([])) setCorrectStep(2);
      return;
    }
    if (sel3.size === 0) return;
    if (game.submitQ3([...sel3])) setCorrectStep(2);
  };

  const toggleQ3 = (id: AgentId) => {
    setSel3((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="scene judgment-scene">
      <div className="judgment-top-row">
        {state.storyAcked && (
          <button
            className="story-bulb story-bulb-fixed"
            onClick={() => game.toggleStoryPeek(true)}
            aria-label="查看故事背景与目标"
            title="故事背景与游戏目标"
          >
            <Lightbulb size={22} />
          </button>
        )}
        <button className="btn btn-ghost btn-sm btn-exit-corner" onClick={() => setConfirmExit(true)}>
          <DoorOpen size={14} /> 返回主菜单
        </button>
      </div>
      <div className="judgment-head">
        <Gavel size={26} />
        <h1>调查结束</h1>
        <p>做出最终判断。每个环节提交前可反复修改，提交后不可撤回——答错，幻觉就会进入产品。</p>
        <div className="judgment-progress">
          {STEP_TITLES.map((t, i) => (
            <span key={t} className={`jp-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              {i < step ? <Check size={13} /> : null}
              {t}
            </span>
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="judgment-step">
          <h2 className="judgment-question">{caseData.judgment.q1.title}</h2>
          <div className="judgment-options">
            {caseData.judgment.q1.options.map((o) => (
              <button
                key={o.id}
                className={`btn btn-verdict ${o.id === 'yes' ? 'btn-warn' : ''} ${sel1 === o.id ? 'picked' : ''}`}
                onClick={() => setSel1(o.id)}
              >
                {sel1 === o.id && <Check size={16} />}
                {o.label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-xl judge-submit" disabled={!sel1} onClick={submitQ1}>
            <Send size={17} /> 提交本环节判断
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="judgment-step">
          <h2 className="judgment-question">{caseData.judgment.q2.title}</h2>
          <div className="verdict-grid">
            {caseData.judgment.q2.items.map((item) => {
              const agent = agentOf(item.agent);
              const picked = sel2[item.agent];
              return (
                <div key={item.agent} className="verdict-card" style={{ ['--accent' as string]: agent.accent }}>
                  <div className="verdict-avatar">
                    <Portrait
  src={agent.questionPortrait ?? agent.workPortrait ?? agent.portrait}
  name={agent.name}
  accent={agent.accent}
  variant={agent.id}
  className="verdict-figure"
  face
/>
                  </div>
                  <div className="verdict-agent">{agent.name}</div>
                  <p className="verdict-statement">{item.statement}</p>
                  <div className="verdict-btns">
                    <button
                      className={`btn btn-ok ${picked === 'reliable' ? 'picked' : ''}`}
                      onClick={() => setSel2({ ...sel2, [item.agent]: 'reliable' })}
                    >
                      {picked === 'reliable' && <Check size={14} />} 可靠
                    </button>
                    <button
                      className={`btn btn-warn ${picked === 'unreliable' ? 'picked' : ''}`}
                      onClick={() => setSel2({ ...sel2, [item.agent]: 'unreliable' })}
                    >
                      {picked === 'unreliable' && <XIcon size={14} />} 不可靠
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-primary btn-xl judge-submit"
            disabled={caseData.judgment.q2.items.some((i) => !sel2[i.agent])}
            onClick={submitQ2}
          >
            <Send size={17} /> 提交本环节判断
          </button>
        </div>
      )}

      {step === 2 && !isCase002 && (
        <div className="judgment-step">
          <h2 className="judgment-question">{caseData.judgment.q3.title}</h2>
          <p className="judgment-note">可点选多位 AI，再次点击取消勾选，确认无误后提交。</p>
          <div className="accuse-grid">
            {caseData.agents.map((agent) => {
              const picked = sel3.has(agent.id);
              return (
                <button
                  key={agent.id}
                  className={`accuse-card ${picked ? 'picked' : ''}`}
                  style={{ ['--accent' as string]: agent.accent }}
                  onClick={() => toggleQ3(agent.id)}
                >
                  <div className="accuse-avatar">
                    <Portrait
  src={agent.questionPortrait ?? agent.workPortrait ?? agent.portrait}
  name={agent.name}
  accent={agent.accent}
  variant={agent.id}
  className="accuse-figure"
  face
/>
                  </div>
                  <span className="accuse-name">{agent.name}</span>
                  <span className="accuse-role">{agent.role}</span>
                  <span className={`accuse-check ${picked ? 'on' : ''}`}>
                    {picked ? <Check size={15} /> : null}
                    {picked ? '已指认' : '指认 TA'}
                  </span>
                </button>
              );
            })}
          </div>
          <button className="btn btn-primary btn-xl judge-submit" disabled={isCase002 ? false : sel3.size === 0} onClick={submitQ3}>
            <Send size={17} /> {isCase002 ? '确认三位 AI 均可靠' : '提交本环节判断'}
          </button>
        </div>
      )}

      {correctStep !== null && (
        <div className="judge-correct-backdrop">
          <div className="judge-correct-pop">
            <span className="judge-correct-ring" />
            <CircleCheckBig size={64} />
            <strong>判断正确！</strong>
            <span className="judge-correct-sub">
              {correctStep < 2 ? '推理成立，进入下一环节' : '全部判断成立，正在揭晓真相…'}
            </span>
          </div>
        </div>
      )}

      {case002Win && (
        <div className="judge-correct-backdrop">
          <div className="judge-correct-pop case002-win">
            <span className="judge-correct-ring" />
            <CircleCheckBig size={72} />
            <strong className="case002-win-title">本案不存在 AI 幻觉</strong>
            <span className="judge-correct-sub">三个数字统计口径不同，数据全部真实。已确认三位 AI 均可靠。</span>
          </div>
        </div>
      )}

      {case1Victory && (
        <div className="case1-victory-backdrop">
          <img className="case1-victory-img" src={case1VictoryCg} alt="CASE 001 胜利 CG" />
        </div>
      )}

      {victoryFlash && (
        <div className="case1-victory-backdrop">
          <img className="case1-victory-img" src={case23VictoryCg} alt="胜利 CG" />
        </div>
      )}

      {confirmExit && (
        <div className="confirm-backdrop">
          <div className="confirm-card">
            <h3 className="confirm-title">退出当前调查？</h3>
            <p className="confirm-desc">返回主菜单后，本局收集的线索与进度都会丢失。</p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmExit(false)}>
                取消
              </button>
              <button className="btn btn-danger" onClick={() => { setConfirmExit(false); game.backToTitle(); }}>
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
