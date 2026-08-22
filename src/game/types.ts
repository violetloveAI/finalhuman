export type AgentId = 'validator' | 'developer' | 'delivery';
export type SceneId = 'title' | 'levels' | 'story' | 'investigate' | 'judgment' | 'truth' | 'failure';
export type FixedActionType = 'ask' | 'probe' | 'verify';
export type Verdict = 'reliable' | 'unreliable';
export type TokenTier = 'safe' | 'steady' | 'tense' | 'critical' | 'empty';

export interface EvidenceLine {
  label?: string;
  value: string;
}

export interface EvidenceSection {
  heading?: string;
  lines: EvidenceLine[];
  special?: 'simulated-user';
}

export interface EvidenceCardData {
  title: string;
  subtitle?: string;
  sections: EvidenceSection[];
  footer?: string;
  key?: boolean;
}

export interface Clue {
  id: string;
  agent: AgentId;
  title: string;
  summary: string;
  key?: boolean;
  evidence?: EvidenceCardData;
}

export interface AgentInfo {
  id: AgentId;
  name: string;
  code: string;
  role: string;
  vibe: string;
  accent: string;
  portrait?: string;
  workPortrait?: string;
  questionPortrait?: string;
  report: {
    conclusion: string;
    detail: string;
    status: string;
  };
}

export interface FixedAction {
  type: FixedActionType;
  label: string;
  cost: number;
  question: string;
  answer: string;
  clue: Clue;
}

export interface ChatMessage {
  from: 'player' | 'agent';
  text: string;
  tag?: string;
}

export interface CustomerProfile {
  name: string;
  title: string;
  portrait?: string;
  fields: { label: string; value: string }[];
  quote: string;
}

export interface JudgmentData {
  q1: { title: string; options: { id: string; label: string }[]; correct: string };
  q2: { title: string; items: { agent: AgentId; statement: string; correct: Verdict }[] };
  q3: { title: string; correct: AgentId[] };
}

export interface CaseLevelMeta {
  id: string;
  no: string;
  title: string;
  subtitle: string;
}

export interface TruthData {
  chain: string[];
  typeLabel: string;
  cause: string;
  spread: string;
  punchline: string;
  epilogue: string;
  closing: string;
}

export interface FailureData {
  title: string;
  bullets: string[];
  footer: string;
}

export interface CaseData {
  id: string;
  label: string;
  title: string;
  initialTokens: number;
  freeCost: number;
  freeMaxChars: number;
  case002?: boolean;
  customer: CustomerProfile;
  agents: AgentInfo[];
  actions: Record<AgentId, Record<FixedActionType, FixedAction>>;
  judgment: JudgmentData;
  truth: TruthData;
  failure: FailureData;
}
