import { useEffect, useRef } from 'react';
import type { GameApi } from '../game/useGame';
import openingCg from '../assets/cg/opening.jpg';

export function TitleScreen({ game }: { game: GameApi }) {
  const startedRef = useRef(false);

  useEffect(() => {
    const go = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      game.startGame();
    };
    const onKey = () => go();
    const onPointer = () => go();
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [game]);

  return (
    <div className="title-cg-scene">
      <img className="title-cg-img" src={openingCg} alt="开场 CG" />
    </div>
  );
}
