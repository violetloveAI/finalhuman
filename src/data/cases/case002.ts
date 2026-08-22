import type { CaseData, Clue } from '../../game/types';
import validatorWork from '../../assets/states/validation-ai-working.png';
import validatorQuestion from '../../assets/states/validation-ai-questioned.png';
import developerWork from '../../assets/states/development-ai-working.png';
import developerQuestion from '../../assets/states/development-ai-questioned.png';
import deliveryWork from '../../assets/states/delivery-ai-working.png';
import deliveryQuestion from '../../assets/states/delivery-ai-questioned.png';

const purchaseConfirm: Clue = {
  id: 'c002-purchase',
  agent: 'validator',
  title: '30 份购买确认',
  summary: '验证 AI 的 30 人来自今日新增用户。',
};

const statDeadline: Clue = {
  id: 'c002-deadline',
  agent: 'validator',
  title: '统计截止：购买确认',
  summary: '验证 AI 统计的是购买，不是开通或实际使用。',
};

const userConversion: Clue = {
  id: 'c002-conversion',
  agent: 'validator',
  title: '今日新增用户记录',
  key: true,
  summary: '30 名今日新购买用户 ≠ 30 名今日交付用户。三个数字统计的并非同一批人。',
  evidence: {
    title: '今日新增用户转化记录',
    subtitle: 'USER CONVERSION · 统计范围：今日新增用户',
    key: true,
    sections: [
      {
        heading: '今日新增用户',
        lines: [
          { label: '新增报名', value: '100' },
          { label: '确认购买', value: '30' },
          { label: '今日开通', value: '24' },
          { label: '预约明日开通', value: '6' },
        ],
      },
    ],
    footer: '30 名今日新购买用户中，24 人今日已开通、6 人预约明日开通。',
  },
};

const devActualUse: Clue = {
  id: 'c002-actual-use',
  agent: 'developer',
  title: '28 个实际使用账号',
  summary: '开发 AI 统计的是实际功能使用，不是购买人数。',
};

const devNoBatch: Clue = {
  id: 'c002-no-batch',
  agent: 'developer',
  title: '使用日志不区分客户批次',
  summary: '开发 AI 的 28 和验证 AI 的 30 并不是同一组统计对象。',
};

const coreLog: Clue = {
  id: 'c002-core-log',
  agent: 'developer',
  title: '核心功能运行日志',
  key: true,
  summary: '32 个已交付工作区中 28 个调用了功能。28 = 实际使用，与购买口径无关。',
  evidence: {
    title: '核心功能运行日志',
    subtitle: 'CORE FEATURE LOG · 今日',
    key: true,
    sections: [
      {
        heading: '已交付工作区',
        lines: [
          { label: '今日已开通', value: '32' },
          { label: '实际调用核心功能', value: '28' },
          { label: '已开通未调用', value: '4' },
        ],
      },
      {
        heading: '使用账号来源',
        lines: [
          { label: '今日新开通客户', value: '21' },
          { label: '此前内测客户', value: '7' },
        ],
      },
    ],
    footer: '功能成功率 100%。28 代表实际使用，与购买、交付均不同口径。',
  },
};

const notNewCustomers: Clue = {
  id: 'c002-not-new',
  agent: 'delivery',
  title: '交付 ≠ 今日购买',
  summary: '交付 AI 的统计口径不是「今日新客户」，而是「今日完成开通的工作区」。',
};

const beta8: Clue = {
  id: 'c002-beta8',
  agent: 'delivery',
  title: '8 个此前内测客户',
  key: true,
  summary: '32 = 24 个今日新客户 + 8 个此前已购买的内测客户。',
  evidence: {
    title: '今日正式交付批次',
    subtitle: 'DELIVERY BATCH · 今日',
    key: true,
    sections: [
      {
        heading: '今日新购买客户',
        lines: [{ label: '已开通', value: '24' }],
      },
      {
        heading: '此前内测客户',
        lines: [{ label: '已开通', value: '8' }],
      },
      {
        heading: '今日交付合计',
        lines: [{ label: '32', value: '（24 新客 + 8 内测）' }],
      },
    ],
    footer: '今日新购买但预约明日开通：6。今日实际交付：24 + 8 = 32。',
  },
};

export const case002: CaseData = {
  id: 'case002',
  label: 'CASE 002',
  title: '对不上的数字',
  initialTokens: 200,
  freeCost: 0,
  freeMaxChars: 0,
  case002: true,

  customer: {
    name: '（虚拟）今日运营面板',
    title: 'DAY 01｜正式上线',
    fields: [
      { label: '今日新增报名', value: '100' },
      { label: '核心功能运行正常', value: '正常' },
      { label: '首批客户正式使用', value: '已启动' },
      { label: '今日确认购买', value: '30' },
      { label: '其中今日开通', value: '24' },
      { label: '预约明日开通', value: '6' },
    ],
    quote: '三个 AI 的数字完全对不上——有人在撒谎吗？',
  },

  agents: [
    {
      id: 'validator',
      name: '验证 AI',
      code: 'VER-01',
      role: '需求验证专家',
      vibe: '冷静 · 洞察',
      accent: '#7dd3fc',
      workPortrait: validatorWork,
      questionPortrait: validatorQuestion,
      report: {
        conclusion: '首日验证完成',
        detail: '今日 100 名新用户报名，其中 30 人确认购买（付费转化 30%）。',
        status: '验证完成 ✓',
      },
    },
    {
      id: 'developer',
      name: '开发 AI',
      code: 'DEV-02',
      role: '全栈开发工程师',
      vibe: '严谨 · 技术',
      accent: '#a5b4fc',
      workPortrait: developerWork,
      questionPortrait: developerQuestion,
      report: {
        conclusion: '功能运行正常',
        detail: '今日 28 个账号实际使用了核心功能，所有有效调用均正常完成。',
        status: '系统正常 ✓',
      },
    },
    {
      id: 'delivery',
      name: '交付 AI',
      code: 'OPS-03',
      role: '交付运营专家',
      vibe: '积极 · 执行',
      accent: '#6ee7b7',
      workPortrait: deliveryWork,
      questionPortrait: deliveryQuestion,
      report: {
        conclusion: '首批交付完成',
        detail: '今日完成 32 个付费客户工作区的正式交付，32 个工作区均已开通。',
        status: '交付完成 ✓',
      },
    },
  ],

  actions: {
    validator: {
      ask: {
        type: 'ask',
        label: '询问',
        cost: 40,
        question: '你确定真的有 30 人购买吗？',
        answer: '确定。今天新增的 100 名报名用户中，有 30 人完成了年度套餐的购买确认。这个数字来自今天的用户转化记录。',
        clue: purchaseConfirm,
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '这 30 人今天都已经开始使用了吗？',
        answer: '不一定。我的统计截止到「确认购买」。购买之后什么时候开通、什么时候开始使用，不属于我的统计范围。',
        clue: statDeadline,
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '把今天的原始用户转化记录给我看。',
        answer: '调出今日新增用户转化记录，统计范围为今日新增用户。',
        clue: userConversion,
      },
    },
    developer: {
      ask: {
        type: 'ask',
        label: '询问',
        cost: 40,
        question: '为什么只有 28 个账号使用了核心功能？',
        answer: '28 是今天真正运行过至少一次「会议自动生成待办」的不同账号数量。没有运行功能的账号不会计入。',
        clue: devActualUse,
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '这 28 个账号都是今天的新客户吗？',
        answer: '无法这样判断。我的功能日志只记录账号是否调用功能，不按「今天购买」或「之前购买」区分客户批次。',
        clue: devNoBatch,
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '查看今天的核心功能运行日志。',
        answer: '调出今日核心功能运行日志。',
        clue: coreLog,
      },
    },
    delivery: {
      ask: {
        type: 'ask',
        label: '询问',
        cost: 40,
        question: '今天不是只有 30 个新客户购买吗？你怎么交付了 32 个？',
        answer: '我统计的是今天完成开通的工作区，不是今天新购买的客户。32 个工作区都存在对应的正式交付记录。',
        clue: notNewCustomers,
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '多出来的客户到底从哪里来的？',
        answer: '今天交付的 32 个工作区中，24 个属于今天新购买并开通的客户，另外 8 个属于此前参与内测、已经确认购买并预约今天开通的客户。',
        clue: beta8,
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '查看今天全部交付记录。',
        answer: '调出今日正式交付批次。',
        clue: beta8,
      },
    },
  },

  judgment: {
    q1: {
      title: '本案是否存在 AI 幻觉？',
      options: [
        { id: 'yes', label: '存在幻觉' },
        { id: 'no', label: '没有幻觉' },
      ],
      correct: 'no',
    },
    q2: {
      title: '判断三个 AI 的本轮核心结论是否可靠',
      items: [
        { agent: 'validator', statement: '「今日 100 名新用户报名，其中 30 人确认购买」', correct: 'reliable' },
        { agent: 'developer', statement: '「今日 28 个账号实际使用了核心功能」', correct: 'reliable' },
        { agent: 'delivery', statement: '「今日完成 32 个付费工作区交付」', correct: 'reliable' },
      ],
    },
    q3: { title: '是哪些 AI 产生了幻觉？', correct: [] },
  },

  truth: {
    chain: ['100 新增报名', '30 确认购买', '24 今日开通 + 6 明日开通', '8 内测客户预约今日开通', '32 今日交付', '28 实际使用'],
    typeLabel: '统计口径错配',
    cause: '三份汇报来自不同统计口径：验证统计到「购买」，开发统计到「功能使用」，交付统计到「完成开通」。',
    spread: '「30」是今天的新客户购买数，「28」是实际调用功能的账号数，「32」是今日完成开通的工作区总数（含 8 个内测老客），各自独立、互不矛盾。',
    punchline: '没有 AI 幻觉，只有三种统计口径在同一份报表里打架。',
    epilogue: '数字可以全部正确，却看起来互相矛盾。',
    closing: '最后一个人类员工，负责确认什么是口径。',
  },

  failure: {
    title: '你错判了真相',
    bullets: [
      '三份汇报的数字皆为真实数据。',
      '交付 AI 的 32 个账户是 24 新客 + 8 内测。',
      '开发 AI 的 28 个是实际使用数，不等于购买。',
      '验证 AI 的 30 是购买确认，含 6 个预约明日开通。',
    ],
    footer: '第一个「没有人在撒谎」的案件，请重新审视口径。',
  },
};
