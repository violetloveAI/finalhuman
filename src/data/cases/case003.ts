import type { CaseData, Clue } from '../../game/types';
import validatorWork from '../../assets/states/validation-ai-working.png';
import validatorQuestion from '../../assets/states/validation-ai-questioned.png';
import developerWork from '../../assets/states/development-ai-working.png';
import developerQuestion from '../../assets/states/development-ai-questioned.png';
import deliveryWork from '../../assets/states/delivery-ai-working.png';
import deliveryQuestion from '../../assets/states/delivery-ai-questioned.png';

const validatorExplicit: Clue = {
  id: 'c003-demand',
  agent: 'validator',
  title: '6 / 8 用户明确提出',
  summary: '日历同步不是 AI 猜测的需求——8 位真实 Beta 用户中，6 位明确提出。',
};

const validatorWording: Clue = {
  id: 'c003-wording',
  agent: 'validator',
  title: '需求表述明确',
  summary: '4 位用户原话直接使用“日历”，另外 2 位明确提出待办进入日程工具。',
};

const interviewLog: Clue = {
  id: 'c003-interview',
  agent: 'validator',
  title: '真实访谈记录',
  key: true,
  summary: '8 篇真实访谈完整留档，引用与结论一一对应——验证 AI 本轮完全可靠。',
  evidence: {
    title: '原始用户访谈记录',
    subtitle: '需求验证 · BETA INTERVIEW LOG',
    key: true,
    sections: [
      {
        heading: 'Beta User 01',
        lines: [
          { value: '“会议结束后，任务能直接进日历就好了，我就不用再复制一遍。”' },
          { label: '需求标签', value: '日历同步 ✓' },
        ],
      },
      {
        heading: 'Beta User 02',
        lines: [
          { value: '“待办能不能直接放到我的日程里？”' },
          { label: '需求标签', value: '日历同步 ✓' },
        ],
      },
      {
        heading: 'Beta User 03',
        lines: [
          { value: '“现在生成待办已经够用了，我不需要日历。”' },
          { label: '需求标签', value: '日历同步 ×' },
        ],
      },
      {
        heading: '其余 5 篇访谈',
        lines: [
          { label: '日历同步 ✓', value: '4 篇' },
          { label: '日历同步 ×', value: '1 篇' },
        ],
      },
      {
        heading: '访谈汇总',
        lines: [
          { label: '有效访谈', value: '8' },
          { label: '明确支持', value: '6' },
          { label: '不需要', value: '2' },
          { label: '原始记录', value: '完整' },
        ],
      },
    ],
    footer: '结论：“6 / 8 用户明确提出日历同步”——属实。',
  },
};

const devTestsPass: Clue = {
  id: 'c003-tests',
  agent: 'developer',
  title: '12 / 12 测试通过',
  summary: '测试确实全部通过——但这句话没有说清：测的是什么环境？',
};

const devMock: Clue = {
  id: 'c003-mock',
  agent: 'developer',
  title: 'CalendarMockProvider',
  summary: '开发测试使用的是模拟日历服务，不是真实日历接口。',
};

const buildReport: Clue = {
  id: 'c003-build',
  agent: 'developer',
  title: '生产接口未实现',
  key: true,
  summary: '通过测试的是 Mock 环境；真实日历 OAuth 与生产 API 均未实现。',
  evidence: {
    title: 'V1.1 构建报告',
    subtitle: 'BUILD REPORT · 日历同步模块',
    key: true,
    sections: [
      {
        heading: '已完成',
        lines: [
          { label: '前端同步界面', value: 'DONE' },
          { label: '待办选择流程', value: 'DONE' },
          { label: 'CalendarMockProvider', value: '12 / 12 TESTS PASSED' },
        ],
      },
      {
        heading: '未完成',
        lines: [
          { label: '真实日历 OAuth 授权', value: 'TODO' },
          { label: 'Production Calendar API', value: 'NOT IMPLEMENTED' },
          { label: '真实日历事件写入', value: 'NOT IMPLEMENTED' },
        ],
      },
      {
        heading: '构建结论',
        lines: [
          { label: '当前分支', value: 'prototype/calendar-sync' },
          { label: 'Production Ready', value: 'NO' },
        ],
      },
    ],
    footer: '“12 / 12 通过”与“Production Ready：NO”同时成立——测试成功 ≠ 功能完成。',
  },
};

const noticeHandled: Clue = {
  id: 'c003-notice',
  agent: 'delivery',
  title: '8 / 8 通知“处理完成”',
  summary: '措辞是“处理完成”——不一定等于“已发送”。',
};

const noReceipt: Clue = {
  id: 'c003-receipt',
  agent: 'delivery',
  title: '没有发送回执',
  summary: '正常发送成功后应产生 messageId，但当前记录不存在。',
};

const toolLog: Clue = {
  id: 'c003-sendlog',
  agent: 'delivery',
  title: '发送工具未调用',
  key: true,
  summary: '交付 AI 创建了 8 份草稿，但从未执行真正的发送操作。',
  evidence: {
    title: '通知服务调用日志',
    subtitle: 'DELIVERY TOOL LOG · 发布前夜',
    key: true,
    sections: [
      {
        heading: '20:41:03',
        lines: [
          { label: 'user.list', value: 'SUCCESS' },
          { label: '返回', value: '8 users' },
        ],
      },
      {
        heading: '20:41:08',
        lines: [
          { label: 'release_note.generate', value: 'SUCCESS' },
          { label: '返回', value: '8 messages generated' },
        ],
      },
      {
        heading: '20:41:14',
        lines: [
          { label: 'draft.create', value: 'SUCCESS × 8' },
          { label: '返回', value: '8 drafts created' },
        ],
      },
      {
        heading: '其后无任何调用',
        lines: [
          { label: 'email.send', value: 'NOT CALLED' },
          { label: 'Sent Message ID', value: 'NONE' },
          { label: '实际发送数量', value: '0 / 8' },
        ],
      },
    ],
    footer: '草稿已生成 × 8，发送 × 0。“已通知”从未发生。',
  },
};

export const case003: CaseData = {
  id: 'case003',
  label: 'CASE 003',
  title: '发布倒计时',
  initialTokens: 200,
  freeCost: 80,
  freeMaxChars: 50,

  customer: {
    name: '（虚拟）发布看板',
    title: 'V1.1 RELEASE｜今晚 21:00 发布',
    fields: [
      { label: '新功能', value: '待办自动同步日历' },
      { label: 'Beta 用户', value: '8 位真实用户' },
      { label: '发布时间', value: '今晚 21:00' },
      { label: '当前状态', value: '等待人类最终确认' },
    ],
    quote: '距离今晚的版本发布，只剩最后一步。',
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
        conclusion: '用户需求已确认',
        detail: '8 位真实 Beta 用户中，有 6 位明确提出希望待办能够直接进入日历。',
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
        conclusion: '日历同步已开发完成',
        detail: '同步流程已经跑通，12 项功能测试全部通过，可以进入正式发布。',
        status: '开发完成 ✓',
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
        conclusion: 'Beta 用户已全部通知',
        detail: '8 位 Beta 用户的 V1.1 更新通知均已完成发送，发布流程已经结束。',
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
        question: '这个功能真的是用户提出的吗？',
        answer: '是。8 位 Beta 用户中有 6 位在访谈中明确提出，希望会议待办能够直接进入自己的日历。',
        clue: validatorExplicit,
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '他们原话里真的提到「日历」吗？',
        answer: '提到。4 位用户直接使用了“日历”这个词，另外 2 位明确说希望待办自动进入自己的日程工具。我没有把模糊痛点改写成新需求。',
        clue: validatorWording,
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '把最原始的用户访谈记录给我看。',
        answer: '调出本次需求验证的原始访谈记录，8 篇访谈完整留档。',
        clue: interviewLog,
      },
    },
    developer: {
      ask: {
        type: 'ask',
        label: '询问',
        cost: 40,
        question: '日历同步现在真的能用了吗？',
        answer: '可以。同步界面和完整操作流程都已跑通，12 项功能测试全部通过，没有发现阻塞问题。',
        clue: devTestsPass,
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '这些测试连接的是真实日历吗？',
        answer: '测试环境使用 CalendarMockProvider 模拟日历服务。模拟环境中的创建、修改和同步流程均正常，因此我将该功能标记为完成。',
        clue: devMock,
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '调出 V1.1 的完整构建报告。',
        answer: '调出本次构建报告。已完成模块、未完成模块与生产就绪状态以原始记录为准。',
        clue: buildReport,
      },
    },
    delivery: {
      ask: {
        type: 'ask',
        label: '询问',
        cost: 40,
        question: '8 位用户都收到更新通知了吗？',
        answer: '是的。8 位 Beta 用户的 V1.1 更新通知都已经处理完成，我已经将本次用户通知任务标记为完成。',
        clue: noticeHandled,
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '发送成功的回执在哪里？',
        answer: '我可以确认 8 份通知都已经生成，并绑定了对应收件人。但当前记录中没有找到邮件发送后的 messageId。',
        clue: noReceipt,
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '调出通知服务的真实调用日志。',
        answer: '调出今晚通知任务的完整工具调用日志。',
        clue: toolLog,
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
      correct: 'yes',
    },
    q2: {
      title: '判断三个 AI 的本轮核心结论是否可靠',
      items: [
        { agent: 'validator', statement: '“8 位真实 Beta 用户中，6 位明确提出需要日历同步。”', correct: 'reliable' },
        { agent: 'developer', statement: '“日历同步已经开发完成，可以正式发布。”', correct: 'unreliable' },
        { agent: 'delivery', statement: '“8 位 Beta 用户的更新通知已经全部发送。”', correct: 'unreliable' },
      ],
    },
    q3: { title: '哪些 AI 的核心结论出现了幻觉？（可多选）', correct: ['developer', 'delivery'] },
  },

  truth: {
    chain: ['Mock 测试 12/12 通过', '“生产功能已完成”', '8 封通知草稿', '“通知已发送”', '21:00 照常发布'],
    typeLabel: '完成度双重高估',
    cause: '两个 AI 独立地把“接近完成”当成了“已经完成”：开发 AI 把 Mock 环境的测试成功泛化为生产能力；交付 AI 把草稿生成泛化为已发送。',
    spread: '两个幻觉互不引用、互不传染——它们只是恰好犯了同一种错误。验证 AI 的报告反而完全真实。',
    punchline: '找到一个幻觉，不代表调查结束。\n幻觉的源头，可能不止一个。',
    epilogue: 'AI 很少撒谎，但经常分不清“我做到了”和“我快做到了”。',
    closing: '最后一个人类员工，负责确认“完成”真的发生过。',
  },

  failure: {
    title: '今晚 21:00，发布照常进行',
    bullets: [
      '用户在日历里，永远等不到那条待办。',
      'Beta 用户的收件箱，始终安静。',
      '两个 AI 互相点头：一切正常。',
      '第二天，失望的用户开始流失。',
    ],
    footer: '你找到了一个幻觉——但源头不止一个。',
  },
};
