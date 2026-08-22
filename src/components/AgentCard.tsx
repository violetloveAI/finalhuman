import { BadgeCheck, ChevronRight } from 'lucide-react';
import type { AgentInfo } from '../game/types';
import { AgentAvatar } from './AgentAvatar';

interface Props {
  agent: AgentInfo;
  focused: boolean;
  dimmed: boolean;
  compact?: boolean;
  onClick: () => void;
}

export function AgentCard({ agent, focused, dimmed, compact, onClick }: Props) {
  return (
    <button
      className={`agent-card ${focused ? 'focused' : ''} ${dimmed ? 'dimmed' : ''} ${compact ? 'compact' : ''}`}
      style={{ ['--accent' as string]: agent.accent }}
      onClick={onClick}
    >
      <div className="agent-card-top">
        <AgentAvatar accent={agent.accent} variant={agent.id} size={compact ? 64 : 120} />
      </div>
      <div className="agent-id-row">
        <span className="agent-name">{agent.name}</span>
        <span className="agent-code">{agent.code}</span>
      </div>
      <div className="agent-role">
        {agent.role} · {agent.vibe}
      </div>
      {!compact && (
        <>
          <div className="agent-report">
            <div className="agent-report-label">本轮结论</div>
            <div className="agent-conclusion">{agent.report.conclusion}</div>
            <div className="agent-detail">{agent.report.detail}</div>
          </div>
          <div className="agent-status-row">
            <span className="agent-status">
              <BadgeCheck size={14} /> {agent.report.status}
            </span>
            <span className="agent-cta">
              开始质询 <ChevronRight size={15} />
            </span>
          </div>
        </>
      )}
    </button>
  );
}
