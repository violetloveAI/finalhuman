import { useState } from 'react';
import { Gavel, Volume2, VolumeX, BatteryWarning, MessagesSquare, ChevronRight, Lightbulb, DoorOpen } from 'lucide-react';
import { TokenHud } from '../components/TokenHud';
import { Portrait } from '../components/Portrait';
import { InterrogationPanel } from '../components/InterrogationPanel';
import { CluePanel } from '../components/CluePanel';
import { sfx } from '../services/audio';
import type { GameApi } from '../game/useGame';

export function InvestigateScreen({ game }: { game: GameApi }) {
  const { caseData, state, tokenTier, canInvestigate } = game;
  const [clueOpen, setClueOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const selected = state.selected ? caseData.agents.find((a) => a.id === state.selected)! : null;

  return (
    <div className={`scene investigate-scene tier-${tokenTier}`}>
      <header className="top-bar">
        <div className="top-bar-left">
          <div className="case-tag">
            <span className="case-tag-id">{caseData.label}</span>
            <span className="case-tag-title">{caseData.title}</span>
          </div>
          {state.storyAcked && (
            <button
              className="story-bulb"
              onClick={() => game.toggleStoryPeek(true)}
              aria-label="查看故事背景与目标"
              title="故事背景与游戏目标"
            >
              <Lightbulb size={19} />
            </button>
          )}
        </div>
        <div className="top-bar-right">
          <TokenHud tokens={state.tokens} tier={tokenTier} lastSpend={state.lastSpend} />
          <button className="btn btn-ghost btn-sm btn-exit" onClick={() => setConfirmExit(true)}>
            <DoorOpen size={14} /> 返回主菜单
          </button>
          <button className="icon-btn" onClick={game.toggleMute} aria-label="静音切换">
            {state.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="btn btn-danger btn-end" onClick={game.endInvestigation}>
            <Gavel size={17} /> 结束调查
          </button>
        </div>
      </header>

      {!canInvestigate && (
        <div className="exhaust-banner">
          <BatteryWarning size={18} />
          {state.tokens === 0 ? '调查额度耗尽' : '剩余 TOKEN 已不足以发起任何调查'}
          <span className="exhaust-hint">现在可以进入最终判断 →</span>
        </div>
      )}

      {selected ? (
        <div className="interro2-layout">
          <div className="interro2-portrait">
            <Portrait
              src={selected.questionPortrait ?? selected.portrait}
              name={selected.name}
              accent={selected.accent}
              variant={selected.id}
              className="interro2-figure"
              interactive
            />
            <div className="interro2-portrait-tag">
              <strong>{selected.name}</strong>
              <span>{selected.code} · 质询中</span>
            </div>
          </div>
          <InterrogationPanel
            caseData={caseData}
            agent={selected}
            used={state.used[selected.id]}
            tokens={state.tokens}
            chat={state.chats[selected.id]}
            freeBusy={state.freeBusy}
            onAction={(t) => game.runFixedAction(selected.id, t)}
            onFree={(text) => game.sendFreeQuery(selected.id, text)}
            onClose={() => game.selectAgent(null)}
          />
        </div>
      ) : (
        <div className="hall">
          <div className="hall-hint">
            <MessagesSquare size={16} /> 点击名牌或立绘，选择一位 AI 同事提出质询
          </div>
          <div className="hall-columns">
            {caseData.agents.map((a) => (
              <div key={a.id} className="hall-col" style={{ ['--accent' as string]: a.accent }}>
                <button className="hall-portrait" onClick={() => game.selectAgent(a.id)} aria-label={`质询${a.name}`}>
                  <Portrait src={a.workPortrait ?? a.portrait} name={a.name} accent={a.accent} variant={a.id} className="hall-figure" interactive />
                </button>
                <button className="name-board" onClick={() => game.selectAgent(a.id)}>
                  <div className="name-board-head">
                    <strong className="name-board-name">{a.name}</strong>
                    <span className="name-board-code">{a.code}</span>
                  </div>
                  <div className="name-board-report">
                    <span className="name-board-label">本轮结论</span>
                    <span className="name-board-conclusion">{a.report.conclusion}</span>
                  </div>
                  <span className="name-board-cta">
                    提出质询 <ChevronRight size={15} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <CluePanel
        clues={state.clues}
        open={clueOpen}
        onToggle={() => {
          sfx.play('click');
          setClueOpen(!clueOpen);
        }}
        onPick={game.viewClue}
        agentName={(id) => caseData.agents.find((a) => a.id === id)?.name ?? id}
      />

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
