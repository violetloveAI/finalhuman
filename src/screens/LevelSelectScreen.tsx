import { Lock, ChevronRight, Sparkles, FolderOpen } from 'lucide-react';
import type { GameApi } from '../game/useGame';

interface LevelSlot {
  id: string;
  no: string;
  title: string;
  subtitle: string;
  playable: boolean;
  soon?: boolean;
}

const LEVELS: LevelSlot[] = [
  {
    id: 'case001',
    no: 'CASE 001',
    title: '第一位客户',
    subtitle: '验证 · 开发 · 交付——谁的报告里藏着幻觉？',
    playable: true,
  },
  {
    id: 'case002',
    no: 'CASE 002',
    title: '对不上的数字',
    subtitle: '30 / 28 / 32——三个数字，谁在撒谎？',
    playable: true,
  },
  {
    id: 'case003',
    no: 'CASE 003',
    title: '发布倒计时',
    subtitle: '今晚 21:00 发布——两个「完成」，各自有多真？',
    playable: true,
  },
  { id: 'soon', no: 'MORE', title: '敬请期待', subtitle: '更多案件即将公开', playable: false, soon: true },
];

export function LevelSelectScreen({ game }: { game: GameApi }) {
  return (
    <div className="scene levels-scene">
      <header className="levels-head">
        <FolderOpen size={22} className="levels-head-icon" />
        <h1>选择案件</h1>
        <p>所有案件均可随时进入，进度互不干扰。两件案子，两种真相——请逐一识破。</p>
      </header>

      <div className="levels-grid">
        {LEVELS.map((lv) =>
          lv.soon ? (
            <div key={lv.id} className="level-card level-soon">
              <Sparkles size={30} />
              <span className="level-no">{lv.no}</span>
              <span className="level-title">{lv.title}</span>
              <span className="level-subtitle">{lv.subtitle}</span>
            </div>
          ) : (
            <button
              key={lv.id}
              className={`level-card ${lv.playable ? 'playable' : 'locked'}`}
              disabled={!lv.playable}
              onClick={() => game.pickLevel(lv.id)}
            >
              <span className="level-no">{lv.no}</span>
              <span className="level-title">{lv.title}</span>
              <span className="level-subtitle">{lv.subtitle}</span>
              {lv.playable ? (
                <span className="level-cta">
                  开始调查 <ChevronRight size={15} />
                </span>
              ) : (
                <span className="level-lock">
                  <Lock size={14} /> 未解锁
                </span>
              )}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
