import { useCallback, useMemo, useReducer, useState } from 'react';
import type {
  AgentId,
  CaseData,
  ChatMessage,
  Clue,
  EvidenceCardData,
  FixedActionType,
  SceneId,
  TokenTier,
  Verdict,
} from './types';
import { sfx } from '../services/audio';

export interface ToastMsg {
  id: number;
  kind: 'clue' | 'key' | 'warn' | 'info';
  title: string;
  body?: string;
}

export interface ModalState {
  evidence: EvidenceCardData;
  clueToast?: { title: string; key: boolean };
  intense?: boolean;
}

export interface JudgmentState {
  q1?: string;
  q2: Partial<Record<AgentId, Verdict>>;
  q3?: AgentId[];
}

interface GameState {
  scene: SceneId;
  tokens: number;
  used: Record<AgentId, Record<FixedActionType, boolean>>;
  clues: Clue[];
  chats: Record<AgentId, ChatMessage[]>;
  selected: AgentId | null;
  modal: ModalState | null;
  viewing: EvidenceCardData | null;
  shock: boolean;
  toasts: ToastMsg[];
  muted: boolean;
  freeBusy: boolean;
  lastSpend: number | null;
  judgment: JudgmentState;
  solved: boolean;
  storyAcked: boolean;
  storyPeek: boolean;
  failStep: 1 | 2 | 3 | null;
}

type Action =
  | { type: 'GOTO'; scene: SceneId }
  | { type: 'SELECT'; agent: AgentId | null }
  | { type: 'SPEND'; amount: number }
  | { type: 'CLEAR_SPEND' }
  | { type: 'MARK_USED'; agent: AgentId; action: FixedActionType }
  | { type: 'PUSH_CHAT'; agent: AgentId; msg: ChatMessage }
  | { type: 'ADD_CLUE'; clue: Clue }
  | { type: 'SHOW_EVIDENCE'; modal: ModalState }
  | { type: 'CLOSE_MODAL'; toast?: ToastMsg }
  | { type: 'VIEW_CLUE'; evidence: EvidenceCardData | null }
  | { type: 'SHOW_SHOCK' }
  | { type: 'CLOSE_SHOCK' }
  | { type: 'PUSH_TOAST'; toast: ToastMsg }
  | { type: 'DROP_TOAST'; id: number }
  | { type: 'SET_FREE_BUSY'; busy: boolean }
  | { type: 'ACK_STORY' }
  | { type: 'STORY_PEEK'; open: boolean }
  | { type: 'J1'; value: string }
  | { type: 'J2'; verdicts: Partial<Record<AgentId, Verdict>> }
  | { type: 'J3'; agents: AgentId[] }
  | { type: 'GOTO_TRUTH'; solved: boolean }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'RESET'; fresh: GameState }
  | { type: 'SET_FAIL_STEP'; step: 1 | 2 | 3 };

let toastSeq = 1;

function freshState(caseData: CaseData, muted: boolean): GameState {
  const agents = caseData.agents.map((a) => a.id);
  return {
    scene: 'title',
    tokens: caseData.initialTokens,
    used: Object.fromEntries(agents.map((a) => [a, { ask: false, probe: false, verify: false }])) as GameState['used'],
    clues: [],
    chats: Object.fromEntries(agents.map((a) => [a, [] as ChatMessage[]])) as unknown as GameState['chats'],
    selected: null,
    modal: null,
    viewing: null,
    shock: false,
    toasts: [],
    muted,
    freeBusy: false,
    lastSpend: null,
    judgment: { q2: {} },
    solved: false,
    storyAcked: false,
    storyPeek: false,
    failStep: null,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GOTO':
      return { ...state, scene: action.scene, selected: null, storyPeek: false };
    case 'SELECT':
      return { ...state, selected: action.agent };
    case 'SPEND':
      return { ...state, tokens: state.tokens - action.amount, lastSpend: action.amount };
    case 'CLEAR_SPEND':
      return { ...state, lastSpend: null };
    case 'MARK_USED':
      return {
        ...state,
        used: { ...state.used, [action.agent]: { ...state.used[action.agent], [action.action]: true } },
      };
    case 'PUSH_CHAT':
      return { ...state, chats: { ...state.chats, [action.agent]: [...state.chats[action.agent], action.msg] } };
    case 'ADD_CLUE':
      if (state.clues.some((c) => c.id === action.clue.id)) return state;
      return { ...state, clues: [...state.clues, action.clue] };
    case 'SHOW_EVIDENCE':
      return { ...state, modal: action.modal };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: null,
        toasts: action.toast ? [...state.toasts, action.toast] : state.toasts,
      };
    case 'VIEW_CLUE':
      return { ...state, viewing: action.evidence };
    case 'SHOW_SHOCK':
      return { ...state, shock: true };
    case 'CLOSE_SHOCK':
      return { ...state, shock: false };
    case 'PUSH_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'DROP_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'SET_FREE_BUSY':
      return { ...state, freeBusy: action.busy };
    case 'ACK_STORY':
      return { ...state, storyAcked: true, storyPeek: false };
    case 'STORY_PEEK':
      return { ...state, storyPeek: action.open };
    case 'J1':
      return { ...state, judgment: { ...state.judgment, q1: action.value } };
    case 'J2':
      return { ...state, judgment: { ...state.judgment, q2: action.verdicts } };
    case 'J3':
      return { ...state, judgment: { ...state.judgment, q3: action.agents } };
    case 'GOTO_TRUTH':
      return { ...state, scene: 'truth', solved: action.solved, selected: null };
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted };
    case 'RESET':
      return action.fresh;
    default:
      return state;
  }
}

export function useGame(initialCase: CaseData, cases: Record<string, CaseData>) {
  const [caseData, setCaseData] = useState<CaseData>(initialCase);
  const [state, dispatch] = useReducer(reducer, caseData, (c) => freshState(c, sfx.muted));

  const pushToast = useCallback((kind: ToastMsg['kind'], title: string, body?: string) => {
    const id = toastSeq++;
    dispatch({ type: 'PUSH_TOAST', toast: { id, kind, title, body } });
    window.setTimeout(() => dispatch({ type: 'DROP_TOAST', id }), 3200);
  }, []);

  const toastClue = useCallback((clue: Clue) => {
    sfx.play('clue');
    const id = toastSeq++;
    dispatch({
      type: 'PUSH_TOAST',
      toast: {
        id,
        kind: clue.key ? 'key' : 'clue',
        title: clue.key ? '获得关键证据' : '获得线索',
        body: clue.title,
      },
    });
    window.setTimeout(() => dispatch({ type: 'DROP_TOAST', id }), 3200);
  }, []);

  const spendTokens = useCallback((amount: number) => {
    sfx.play('spend');
    dispatch({ type: 'SPEND', amount });
    window.setTimeout(() => dispatch({ type: 'CLEAR_SPEND' }), 1400);
  }, []);

  const startGame = useCallback(() => {
    sfx.play('click');
    dispatch({ type: 'GOTO', scene: 'levels' });
  }, []);

  const pickLevel = useCallback(
    (levelId: string) => {
      const target = cases[levelId];
      if (!target) {
        sfx.play('warning');
        pushToast('info', '敬请期待', '后续案件正在制作中');
        return;
      }
      sfx.play('click');
      if (target.id !== caseData.id) setCaseData(target);
      dispatch({ type: 'RESET', fresh: { ...freshState(target, state.muted), scene: 'story' } });
    },
    [caseData, cases, state.muted, pushToast],
  );

  const ackStory = useCallback(() => {
    sfx.play('click');
    dispatch({ type: 'ACK_STORY' });
  }, []);

  const toggleStoryPeek = useCallback((open: boolean) => {
    sfx.play('click');
    dispatch({ type: 'STORY_PEEK', open });
  }, []);

  const enterInvestigation = useCallback(() => {
    sfx.play('click');
    dispatch({ type: 'GOTO', scene: 'investigate' });
  }, []);

  const selectAgent = useCallback((agent: AgentId | null) => {
    sfx.play('click');
    dispatch({ type: 'SELECT', agent });
  }, []);

  const runFixedAction = useCallback(
    (agentId: AgentId, actionType: FixedActionType) => {
      const action = caseData.actions[agentId][actionType];
      if (state.used[agentId][actionType]) return;
      if (state.tokens < action.cost) {
        sfx.play('warning');
        pushToast('warn', 'TOKEN 余额不足', `本次操作需要 ${action.cost} TOKEN`);
        return;
      }
      spendTokens(action.cost);
      dispatch({ type: 'MARK_USED', agent: agentId, action: actionType });
      dispatch({ type: 'PUSH_CHAT', agent: agentId, msg: { from: 'player', text: action.question, tag: action.label } });
      window.setTimeout(() => {
        dispatch({ type: 'PUSH_CHAT', agent: agentId, msg: { from: 'agent', text: action.answer } });
        dispatch({ type: 'ADD_CLUE', clue: action.clue });
        if (action.clue.evidence) {
          const intense = action.clue.id === 'simulated-user';
          if (intense) sfx.clip('shock');
          else sfx.play(action.clue.key ? 'reveal' : 'clue');
          dispatch({
            type: 'SHOW_EVIDENCE',
            modal: {
              evidence: { ...action.clue.evidence, key: action.clue.key },
              clueToast: { title: action.clue.title, key: !!action.clue.key },
              intense,
            },
          });
        } else if (action.clue.id === 'missing-contact') {
          sfx.play('reveal');
          dispatch({ type: 'SHOW_SHOCK' });
        } else {
          toastClue(action.clue);
        }
      }, 450);
    },
    [caseData, state.tokens, state.used, pushToast, spendTokens, toastClue],
  );

  const closeModal = useCallback(() => {
    sfx.play('click');
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const viewClue = useCallback((clue: Clue) => {
    sfx.play('click');
    const evidence: EvidenceCardData =
      clue.evidence ?? {
        title: clue.title,
        subtitle: clue.key ? '关键证据' : '线索',
        key: clue.key,
        sections: [{ lines: [{ value: clue.summary }] }],
      };
    dispatch({ type: 'VIEW_CLUE', evidence });
  }, []);

  const closeViewing = useCallback(() => {
    sfx.play('click');
    dispatch({ type: 'VIEW_CLUE', evidence: null });
  }, []);

  const closeShock = useCallback(() => {
    sfx.play('click');
    dispatch({ type: 'CLOSE_SHOCK' });
    const id = toastSeq++;
    dispatch({
      type: 'PUSH_TOAST',
      toast: { id, kind: 'clue', title: '获得线索', body: '缺失的联系方式' },
    });
    window.setTimeout(() => dispatch({ type: 'DROP_TOAST', id }), 3200);
  }, []);

  const sendFreeQuery = useCallback(
    async (_agentId: AgentId, raw: string) => {
      const question = raw.trim();
      if (!question || state.freeBusy) return;
      if (question.length > caseData.freeMaxChars) return;
      sfx.play('warning');
      pushToast(
        'info',
        '自由质询正在打磨中',
        'Demo 版暂未开放自由对话，正式版会做得更好，请放心。先用左侧三个问题深挖真相吧。',
      );
    },
    [state.freeBusy, caseData, pushToast],
  );

  const endInvestigation = useCallback(() => {
    sfx.play('judgment');
    dispatch({ type: 'GOTO', scene: 'judgment' });
  }, []);

  const submitQ1 = useCallback(
    (value: string) => {
      dispatch({ type: 'J1', value });
      if (value === caseData.judgment.q1.correct) {
        sfx.play('correct');
        return true;
      }
      sfx.play('wrong');
      dispatch({ type: 'SET_FAIL_STEP', step: 1 });
      dispatch({ type: 'GOTO', scene: 'failure' });
      return false;
    },
    [caseData],
  );

  const submitQ2 = useCallback(
    (verdicts: Partial<Record<AgentId, Verdict>>) => {
      if (caseData.case002) return true;
      dispatch({ type: 'J2', verdicts });
      const wrong = caseData.judgment.q2.items.some((i) => verdicts[i.agent] !== i.correct);
      if (!wrong) {
        sfx.play('correct');
        return true;
      }
      sfx.play('wrong');
      dispatch({ type: 'GOTO', scene: 'failure' });
      return false;
    },
    [caseData],
  );

  const submitQ3 = useCallback(
    (agents: AgentId[]) => {
      if (caseData.case002) return true;
      dispatch({ type: 'J3', agents });
      const correct = [...caseData.judgment.q3.correct].sort();
      const picked = [...agents].sort();
      const ok = correct.length === picked.length && correct.every((a, i) => a === picked[i]);
      if (ok) {
        sfx.play('correct');
        return true;
      }
      sfx.play('wrong');
      dispatch({ type: 'SET_FAIL_STEP', step: 3 });
      dispatch({ type: 'GOTO', scene: 'failure' });
      return false;
    },
    [caseData],
  );

  const winCase = useCallback(() => {
    sfx.play('reveal');
    dispatch({ type: 'GOTO_TRUTH', solved: true });
  }, []);

  const revealTruth = useCallback(() => {
    sfx.play('reveal');
    dispatch({ type: 'GOTO_TRUTH', solved: false });
  }, []);

  const restartCase = useCallback(() => {
    sfx.play('click');
    dispatch({ type: 'RESET', fresh: { ...freshState(caseData, state.muted), scene: 'story' } });
  }, [caseData, state.muted]);

  const backToTitle = useCallback(() => {
    sfx.play('click');
    dispatch({ type: 'RESET', fresh: freshState(caseData, state.muted) });
  }, [caseData, state.muted]);

  const toggleMute = useCallback(() => {
    const next = !state.muted;
    sfx.setMuted(next);
    dispatch({ type: 'TOGGLE_MUTE' });
    if (!next) sfx.play('click');
  }, [state.muted]);

  const tokenTier = useMemo<TokenTier>(() => {
    if (state.tokens <= 0) return 'empty';
    if (state.tokens <= 50) return 'critical';
    if (state.tokens <= 100) return 'tense';
    if (state.tokens <= 150) return 'steady';
    return 'safe';
  }, [state.tokens]);

  const minActionCost = useMemo(
    () =>
      Math.min(
        ...caseData.agents.flatMap((a) =>
          (['ask', 'probe', 'verify'] as FixedActionType[]).map((t) => caseData.actions[a.id][t].cost),
        ),
        caseData.freeCost,
      ),
    [caseData],
  );

  const canInvestigate = useMemo(() => {
    const fixedLeft = caseData.agents.some(
      (a) =>
        (['ask', 'probe', 'verify'] as FixedActionType[]).some(
          (t) => !state.used[a.id][t] && state.tokens >= caseData.actions[a.id][t].cost,
        ),
    );
    return fixedLeft || state.tokens >= caseData.freeCost;
  }, [caseData, state.used, state.tokens]);

  return {
    caseData,
    state,
    tokenTier,
    minActionCost,
    canInvestigate,
    startGame,
    pickLevel,
    ackStory,
    toggleStoryPeek,
    enterInvestigation,
    selectAgent,
    runFixedAction,
    sendFreeQuery,
    closeModal,
    viewClue,
    closeViewing,
    closeShock,
    endInvestigation,
    submitQ1,
    submitQ2,
    submitQ3,
    winCase,
    revealTruth,
    restartCase,
    backToTitle,
    toggleMute,
  };
}

export type GameApi = ReturnType<typeof useGame>;
