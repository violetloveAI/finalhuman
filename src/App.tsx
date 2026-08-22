import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useGame } from './game/useGame';
import { case001 } from './data/cases/case001';
import { case002 } from './data/cases/case002';
import { case003 } from './data/cases/case003';

const CASES = { case001, case002, case003 };
import { TitleScreen } from './screens/TitleScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { StoryScreen, StoryContent } from './screens/StoryScreen';
import { InvestigateScreen } from './screens/InvestigateScreen';
import { JudgmentScreen } from './screens/JudgmentScreen';
import { TruthScreen } from './screens/TruthScreen';
import { FailScreen } from './screens/FailScreen';
import { EvidenceModal } from './components/EvidenceModal';
import { ShockModal } from './components/ShockModal';
import { Toasts } from './components/Toasts';
import { bgm, sfx } from './services/audio';

export default function App() {
  const game = useGame(case001, CASES);
  const { state, tokenTier } = game;

  useEffect(() => {
    if (state.scene === 'title' || state.scene === 'levels') bgm.play('opening');
    else if (state.scene === 'story' || state.scene === 'investigate' || state.scene === 'judgment') bgm.play('game');
    else if (state.scene === 'truth') bgm.play(state.solved ? 'win' : 'defeat');
    else if (state.scene === 'failure') bgm.play('defeat');
  }, [state.scene, state.solved]);

  const modalKey = state.modal ? state.modal.evidence.title : null;
  useEffect(() => {
    if (!modalKey || state.modal?.intense) return;
    const timer = window.setTimeout(() => game.closeModal(), 3000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalKey]);

  // Shock 弹窗出现时播放一次性「震惊」音效（不覆盖背景音乐）
  useEffect(() => {
    if (state.shock) sfx.clip('shock');
  }, [state.shock]);

  return (
    <div className={`app tier-${tokenTier} scene-${state.scene}`}>
      <div className="ambience" />
      <div className="grid-bg" />

      {state.scene === 'title' && <TitleScreen game={game} />}
      {state.scene === 'levels' && <LevelSelectScreen game={game} />}
      {state.scene === 'story' && <StoryScreen game={game} />}
      {state.scene === 'investigate' && <InvestigateScreen game={game} />}
      {state.scene === 'judgment' && <JudgmentScreen game={game} />}
      {state.scene === 'truth' && <TruthScreen game={game} />}
      {state.scene === 'failure' && <FailScreen game={game} />}

      {state.storyPeek && (
        <div className="story-peek-backdrop" onClick={() => game.toggleStoryPeek(false)}>
          <div className="story-peek-card" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn story-peek-close" onClick={() => game.toggleStoryPeek(false)} aria-label="关闭">
              <X size={18} />
            </button>
            <StoryContent game={game} />
          </div>
        </div>
      )}

      {state.modal && (
        <EvidenceModal
          key={state.modal.evidence.title}
          evidence={state.modal.evidence}
          onClose={game.closeModal}
          autoCloseMs={state.modal.intense ? undefined : 3000}
        />
      )}
      {state.viewing && <EvidenceModal evidence={state.viewing} onClose={game.closeViewing} />}
      {state.shock && <ShockModal onClose={game.closeShock} />}
      <Toasts toasts={state.toasts} />
    </div>
  );
}
