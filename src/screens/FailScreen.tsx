import { useState } from 'react';
import { Package, RefreshCcw, Eye, UserX, ListChecks, X, DoorOpen } from 'lucide-react';
import { Portrait } from '../components/Portrait';
import type { GameApi } from '../game/useGame';
import type { Verdict } from '../game/types';
import defeatBg from '../assets/cg/defeat-bg.jpg';

const VERDICT_LABEL: Record<Verdict, string> = {
  reliable: '可信',
  unreliable: '不可信',
};

export function FailScreen({ game }: { game: GameApi }) {
  const { caseData } = game;
  const [answerOpen, setAnswerOpen] = useState(false);
  const f = caseData.failure;
  const j = caseData.judgment;
  const isCase002 = !!caseData.case002;
  const showFailCg = true;
  const failStep = game.state.failStep ?? 1;
  const ROUND_NAMES = ['环节一', '环节二', '环节三'];
  const agentName = (id: string) => caseData.agents.find((a) => a.id === id)?.name ?? id;
  const q1Label = j.q1.options.find((o) => o.id === j.q1.correct)?.label ?? j.q1.correct;

  return (
    <div className="scene fail-scene">
      <div className="settle-cg-bg" style={{ backgroundImage: `url(${defeatBg})` }} aria-hidden />
      <div className="fail-inner">
        <h1 className="fail-title">{f.title}</h1>
        <div className="fail-world">
          {showFailCg ? (
            <img className="fail-cg" src={defeatBg} alt="失败背景" />
          ) : (
            <>
              <div className="fail-wang">
                <Portrait
                  src={caseData.customer.portrait}
                  name={caseData.customer.name}
                  accent="#e8c06a"
                  variant="customer"
                  face
                  className="fail-wang-figure"
                />
                <span className="fail-wang-name">{caseData.customer.name}</span>
                <span className="fail-wang-tag">“真实客户” · 优先级最高</span>
              </div>
              <ul className="fail-bullets">
                {f.bullets.map((b, i) => (
                  <li key={i} style={{ animationDelay: `${0.4 + i * 0.5}s` }}>
                    <Package size={16} />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="fail-counter" style={{ animationDelay: '2.4s' }}>
                <UserX size={20} />
                {isCase002 ? '实际撒谎的 AI' : '真实用户数'}
                <span className="fail-zero">0</span>
              </div>
            </>
          )}
        </div>
        <p className="fail-footer">{f.footer}</p>
        <div className="fail-actions">
          <button className="btn btn-ok btn-xl" onClick={() => setAnswerOpen(true)}>
            <ListChecks size={18} /> 查看本轮答案
          </button>
          <button className="btn btn-primary btn-xl" onClick={game.revealTruth}>
            <Eye size={18} /> 查看谜底
          </button>
          <button className="btn btn-ghost btn-xl" onClick={game.restartCase}>
            <RefreshCcw size={17} /> 重新调查
          </button>
          <button className="btn btn-ghost btn-xl" onClick={game.backToTitle}>
            <DoorOpen size={17} /> 返回主菜单
          </button>
        </div>
      </div>

      {answerOpen && (
        <div className="gallery-backdrop" onClick={() => setAnswerOpen(false)}>
          <div className="gallery-card answer-card" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-head">
              <ListChecks size={20} />
              <h2>
                {isCase002 ? `${ROUND_NAMES[failStep - 1] ?? '本轮'} · 正确答案` : '三个环节 · 正确答案'}
              </h2>
              <button className="icon-btn" onClick={() => setAnswerOpen(false)} aria-label="关闭">
                <X size={18} />
              </button>
            </div>
            <div className="answer-list">
              {(!isCase002 || failStep === 1 || failStep === null) && (
                <div className="answer-row">
                  <div className="answer-q">
                    <span className="answer-step">环节一</span>
                    {j.q1.title}
                  </div>
                  <strong className="answer-a">{q1Label}</strong>
                </div>
              )}
              {(!isCase002 || failStep === 2) && (
                <div className="answer-row">
                  <div className="answer-q">
                    <span className="answer-step">环节二</span>
                    {j.q2.title}
                  </div>
                  <ul className="answer-sublist">
                    {j.q2.items.map((item) => (
                      <li key={item.agent}>
                        <span className="answer-agent">{agentName(item.agent)}</span>
                        <span className="answer-statement">{item.statement}</span>
                        <strong className={`answer-a ${item.correct === 'unreliable' ? 'bad' : 'good'}`}>
                          {VERDICT_LABEL[item.correct]}
                        </strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(!isCase002 || failStep === 3) && (
                <div className="answer-row">
                  <div className="answer-q">
                    <span className="answer-step">环节三</span>
                    {j.q3.title}
                  </div>
                  {j.q3.correct.length === 0 ? (
                    <strong className="answer-a good">没有任何 AI —— 三份数据全部真实</strong>
                  ) : (
                    <strong className="answer-a bad">{j.q3.correct.map(agentName).join('、')}</strong>
                  )}
                </div>
              )}
            </div>
            {isCase002 && (
              <p className="answer-hint">
                本案关键：环节一答「没有幻觉」即可直接破案；若答了「存在幻觉」，后续无论如何都无法挽回。
              </p>
            )}
            {!isCase002 && (
              <p className="answer-hint">
                本案共三个环节——①幻觉存在性 ②结论可信度 ③指认幻觉源头。每个环节提交前可反复修改，提交后不可撤回，任一答错，幻觉就会进入产品。
              </p>
            )}
            <button className="btn btn-primary answer-close" onClick={() => setAnswerOpen(false)}>
              记下了，再查一次
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
