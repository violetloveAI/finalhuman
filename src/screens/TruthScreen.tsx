import { useEffect, useState } from 'react';
import { ChevronRight, RotateCcw, Quote, ArrowDown, Award, Eye, FolderSearch, KeyRound, X, DoorOpen } from 'lucide-react';
import { Portrait } from '../components/Portrait';
import type { GameApi } from '../game/useGame';
import type { FixedActionType } from '../game/types';
import victoryBg from '../assets/cg/victory-bg.jpg';
import defeatBg from '../assets/cg/defeat-bg.jpg';

const STEPS = ['profile', 'stamp', 'chain', 'truth', 'settle'] as const;
type Step = (typeof STEPS)[number];
const ACTION_TYPES: FixedActionType[] = ['ask', 'probe', 'verify'];

function rating(tokens: number): string {
  if (tokens >= 60) return '滴水不漏';
  if (tokens >= 20) return '精准出击';
  if (tokens >= 1) return '险中求真';
  return '孤注一掷';
}

export function TruthScreen({ game }: { game: GameApi }) {
  const { caseData, state } = game;
  const [step, setStep] = useState<Step>(state.solved ? 'profile' : 'truth');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const c = caseData.customer;
  const t = caseData.truth;
  const isCase002 = !!caseData.case002;
  const isCase001 = caseData.id === 'case001';
  const isCase003 = caseData.id === 'case003';
  const next = () => setStep(STEPS[STEPS.indexOf(step) + 1] ?? 'settle');

  // 案件一：回放档案自动播放至「此人不存在」盖章，无需点击
  useEffect(() => {
    if (step !== 'profile' || !isCase001) return;
    const timer = window.setTimeout(() => setStep('stamp'), 2800);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isCase001]);

  const q1Ok = state.judgment.q1 === caseData.judgment.q1.correct;
  const q2Ok = caseData.judgment.q2.items.every((i) => state.judgment.q2[i.agent] === i.correct);
  const picked = [...(state.judgment.q3 ?? [])].sort();
  const correct = [...caseData.judgment.q3.correct].sort();
  const q3Ok = picked.length === correct.length && picked.every((a, i) => a === correct[i]);
  const foundKey = state.clues.some((clue) => clue.key);
  const allClues = caseData.agents.flatMap((a) =>
    ACTION_TYPES.map((t) => caseData.actions[a.id][t].clue),
  );
  const collectedCount = allClues.filter((clue) => state.clues.some((c) => c.id === clue.id)).length;

  const profileLabel = isCase002
    ? '回放 · 三份 AI 工作报告'
    : isCase003
      ? '回放 · 发布倒计时 · 三份汇报'
      : '回放 · 那份令人振奋的客户档案';

  return (
    <div className={`scene truth-scene step-${step}`}>
      <div
        className="settle-cg-bg"
        style={{ backgroundImage: `url(${state.solved ? victoryBg : defeatBg})` }}
        aria-hidden
      />

      {step === 'profile' && (
        <div className="truth-profile">
          <p className="truth-flash-label">{profileLabel}</p>

          {(isCase002 || isCase003) && (
            <div className="case002-report-cards">
              {caseData.agents.map((a, i) => (
                <div
                  key={a.id}
                  className="case002-report-card"
                  style={{ ['--accent' as string]: a.accent, animationDelay: `${i * 0.25}s` }}
                >
                  <Portrait
                    src={a.workPortrait ?? a.portrait}
                    name={a.name}
                    accent={a.accent}
                    variant={a.id}
                    face
                    className="case002-report-fig"
                  />
                  <div className="case002-report-body">
                    <span className="case002-report-name">{a.name}</span>
                    <strong className="case002-report-num">
                      {isCase003
                        ? a.id === 'validator'
                          ? '6 / 8 访谈'
                          : a.id === 'developer'
                            ? '12 / 12 测试'
                            : '8 份草稿'
                        : a.id === 'validator'
                          ? '30'
                          : a.id === 'developer'
                            ? '28'
                            : '32'}
                    </strong>
                    <span className="case002-report-label">
                      {isCase003
                        ? a.id === 'validator'
                          ? '用户访谈真实可靠'
                          : a.id === 'developer'
                            ? '测试通过 · Mock 环境'
                            : '通知草稿已生成'
                        : a.id === 'validator'
                          ? '人确认购买'
                          : a.id === 'developer'
                            ? '账号实际使用'
                            : '工作区完成交付'}
                    </span>
                    <span className="case002-report-stat">{a.report.status}</span>
                  </div>
                </div>
              ))}
              <p className="case002-report-note">
                {isCase003
                  ? '倒计时读秒——没有人按下发布键，因为「完成」从未真正发生。'
                  : '三个数字全部正确 —— 只是统计口径不同。'}
              </p>
            </div>
          )}

          {!isCase002 && !isCase003 && (
            <div className="dossier dossier-ghost">
              <div className="dossier-main">
                <div className="dossier-left">
                  <div className="dossier-photo">
                    <Portrait src={c.portrait} name={c.name} accent="#e8c06a" variant="customer" face className="dossier-figure" />
                    <span className="dossier-photo-tag">VIP</span>
                  </div>
                  <h2 className="dossier-name">{c.name}</h2>
                  <p className="dossier-title">{c.title}</p>
                </div>
                <div className="dossier-right">
                  <ul className="dossier-fields">
                    {c.fields.map((f) => (
                      <li key={f.label}>
                        <span className="df-label">{f.label}</span>
                        <span className="df-value">{f.value}</span>
                      </li>
                    ))}
                  </ul>
                  <blockquote className="dossier-quote">
                    <Quote size={16} />
                    {c.quote}
                  </blockquote>
                </div>
              </div>
            </div>
          )}

          {!isCase001 && (
            <button className="btn btn-primary btn-xl" onClick={next}>
              继续 <ChevronRight size={18} />
            </button>
          )}
        </div>
      )}

      {step === 'stamp' && (
        <div className="truth-stamp-stage">
          {isCase002 ? (
            <div className="stamp-ghost-card case002-panel-ghost">
              <span className="case002-panel-ghost-title">{c.name}</span>
              <span className="case002-panel-ghost-sub">{c.title}</span>
              <div className="case002-panel-ghost-nums">
                <span>30 购买</span>
                <span>28 使用</span>
                <span>32 交付</span>
              </div>
            </div>
          ) : isCase003 ? (
            <div className="stamp-ghost-card case003-panel-ghost">
              <div className="case003-stamp-row">
                <div className="case003-stamp-item">
                  <span className="case003-stamp-num">12 / 12</span>
                  <span className="case003-stamp-label">Mock 测试通过</span>
                  <span className="case003-stamp-tag case003-tag-false">生产未就绪</span>
                </div>
                <div className="case003-stamp-divider">→</div>
                <div className="case003-stamp-item">
                  <span className="case003-stamp-num">8 草稿</span>
                  <span className="case003-stamp-label">通知草稿生成</span>
                  <span className="case003-stamp-tag case003-tag-false">从未发送</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="stamp-ghost-card">
              <Portrait src={c.portrait} name={c.name} accent="#e8c06a" variant="customer" face className="stamp-figure" />
              <span className="stamp-ghost-name">{c.name}</span>
              <span className="stamp-ghost-sub">深圳某科技公司创始人 · 299 元 / 年</span>
            </div>
          )}
          {isCase002 ? (
            <div className="case002-stamp-wall case003-stamp-textual">
              <span>测试通过 ≠ 生产可用</span>
              <span>草稿生成 ≠ 通知发送</span>
            </div>
          ) : isCase003 ? (
            <div className="case002-stamp-wall case003-stamp-textual">
              <span>测试通过 ≠ 生产可用</span>
              <span>草稿生成 ≠ 通知发送</span>
            </div>
          ) : (
            <div className="not-exist-stamp">此人不存在</div>
          )}
          <button className="btn btn-primary btn-xl stamp-next" onClick={next}>
            查看{isCase002 ? '数据还原链' : '传播链'} <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 'chain' && (
        <div className="truth-chain">
          <h2 className="truth-h2">{isCase002 ? '数据还原链' : isCase003 ? '幻觉传播链' : '幻觉传播链'}</h2>
          <div className="chain-flow">
            {t.chain.map((node, i) => (
              <div key={node} className="chain-step" style={{ animationDelay: `${i * 0.45}s` }}>
                <div className={`chain-node ${i === 0 ? 'chain-origin' : ''}`}>{node}</div>
                {i < t.chain.length - 1 && <ArrowDown size={22} className="chain-arrow" />}
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-xl" onClick={next}>
            真相还原 <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 'truth' && (
        <div className="truth-explain">
          <h1 className="truth-h1">真相还原</h1>
          <div className="truth-block">
            <h3>幻觉类型</h3>
            <p className="truth-type">{t.typeLabel}</p>
          </div>
          <div className="truth-block">
            <h3>幻觉发生原因</h3>
            <p>{t.cause}</p>
          </div>
          <div className="truth-block">
            <h3>为什么会传播</h3>
            <p>{t.spread}</p>
          </div>
          <p className="truth-punchline">{t.punchline}</p>
          <button className="btn btn-primary btn-xl" onClick={next}>
            查看结算 <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 'settle' && (
        <div className="truth-settle">
          <div className="settle-card">
            <h2 className="settle-title">
              <Award size={22} />
              {state.solved ? '破案结算' : '谜底回放'}
            </h2>
            <ul className="settle-list">
              <li>
                <span>幻觉判断</span>
                <strong>{q1Ok ? '正确' : '（此前误判）'}</strong>
              </li>
              {isCase002 ? (
                <li>
                  <span>真相结论</span>
                  <strong className="ok-text">本案不存在 AI 幻觉</strong>
                </li>
              ) : (
                <>
                  <li>
                    <span>结论可信度判断</span>
                    <strong>{q2Ok ? '全部正确' : '（此前有误）'}</strong>
                  </li>
                  <li>
                    <span>幻觉源头</span>
                    <strong>{q3Ok ? '指认正确' : '（此前有误）'}</strong>
                  </li>
                </>
              )}
              <li>
                <span>关键证据</span>
                <strong className="gold-text">{foundKey ? '已掌握' : '未找到'}</strong>
              </li>
              <li>
                <span>剩余 TOKEN</span>
                <strong>{state.tokens}</strong>
              </li>
              <li>
                <span>调查评价</span>
                <strong>{state.solved ? `破案成功 · ${rating(state.tokens)}` : '谜底已公开'}</strong>
              </li>
            </ul>
            <p className="settle-epilogue">{t.epilogue}</p>
            <p className="settle-closing">{t.closing}</p>
            <div className="settle-actions">
              <button className="btn btn-primary btn-xl" onClick={game.restartCase}>
                <RotateCcw size={17} /> 重新开始
              </button>
              <button className="btn btn-warn btn-xl" onClick={() => setStep('profile')}>
                <Eye size={17} /> 查看谜底
              </button>
              <button className="btn btn-ghost btn-xl" onClick={() => setGalleryOpen(true)}>
                <FolderSearch size={17} /> 查看本局所有证据
              </button>
              <button className="btn btn-ghost btn-xl" onClick={game.backToTitle}>
                <DoorOpen size={17} /> 返回主菜单
              </button>
            </div>
          </div>
        </div>
      )}

      {galleryOpen && (
        <div className="gallery-backdrop" onClick={() => setGalleryOpen(false)}>
          <div className="gallery-card" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-head">
              <FolderSearch size={20} />
              <h2>本案全部证据</h2>
              <span className="gallery-count">已收集 {collectedCount} / {allClues.length} 条</span>
              <button className="icon-btn" onClick={() => setGalleryOpen(false)} aria-label="关闭">
                <X size={18} />
              </button>
            </div>
            <div className="gallery-grid">
              {allClues.map((clue) => {
                const found = state.clues.some((c) => c.id === clue.id);
                return (
                  <button
                    key={clue.id}
                    className={`gallery-item ${clue.key ? 'key' : ''} ${found ? '' : 'missed'}`}
                    onClick={() => game.viewClue(clue)}
                  >
                    {clue.key && <KeyRound size={15} />}
                    {!found && <span className="gallery-item-tag">本局未收集</span>}
                    <span className="gallery-item-title">{clue.title}</span>
                    <span className="gallery-item-from">
                      来源：{caseData.agents.find((a) => a.id === clue.agent)?.name ?? clue.agent}
                    </span>
                    <span className="gallery-item-summary">{clue.summary}</span>
                    <span className="gallery-item-cta">点击查看详情</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
