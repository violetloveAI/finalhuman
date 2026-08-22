import { Zap } from 'lucide-react';
import type { TokenTier } from '../game/types';

interface Props {
  tokens: number;
  tier: TokenTier;
  lastSpend: number | null;
}

export function TokenHud({ tokens, tier, lastSpend }: Props) {
  return (
    <div className={`token-hud tier-${tier}`}>
      <Zap size={18} className="token-icon" />
      <span className="token-label">TOKEN</span>
      <span key={tokens} className="token-value">
        {tokens}
      </span>
      {lastSpend !== null && (
        <span key={`delta-${tokens}`} className="token-delta">
          -{lastSpend}
        </span>
      )}
    </div>
  );
}
