import type { CaseData } from '../../game/types';
import wangPortrait from '../../assets/王总立绘.jpg';
import validatorWork from '../../assets/states/validation-ai-working.png';
import validatorQuestion from '../../assets/states/validation-ai-questioned.png';
import developerWork from '../../assets/states/development-ai-working.png';
import developerQuestion from '../../assets/states/development-ai-questioned.png';
import deliveryWork from '../../assets/states/delivery-ai-working.png';
import deliveryQuestion from '../../assets/states/delivery-ai-questioned.png';

export const case001: CaseData = {
  id: 'case001',
  label: 'CASE 001',
  title: '第一位客户',
  initialTokens: 200,
  freeCost: 80,
  freeMaxChars: 50,

  customer: {
    name: '王总',
    portrait: wangPortrait,
    title: '第一位高意向客户',
    fields: [
      { label: '身份', value: '深圳某科技公司创始人' },
      { label: '年龄', value: '35 岁' },
      { label: '团队规模', value: '12 人' },
      { label: '每周会议', value: '10+ 场' },
      { label: '最大痛点', value: '会后任务没人跟进' },
      { label: '最想要', value: '自动生成并分配待办' },
      { label: '付费意愿', value: '299 元 / 年' },
    ],
    quote: '“这个功能做出来，299 我愿意买。”',
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
        conclusion: '需求验证通过',
        detail: '12 位目标用户中，9 位愿意尝试；王总的付费意愿最高。',
        status: '验证完成',
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
        conclusion: '核心功能已经完成',
        detail: '根据用户反馈，我们优先完成了“会议后自动生成待办”。',
        status: '开发完成',
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
        conclusion: '首批交付准备完成',
        detail: '试用链接、用户引导和发送流程已经准备好，王总被列为首批优先用户。',
        status: '交付准备完成',
      },
    },
  ],

  actions: {
    validator: {
      ask: {
        type: 'ask',
        label: '询问',
        cost: 40,
        question: '你为什么认为这个产品有人需要？',
        answer: '多数目标用户都认为会议后的任务跟进很麻烦，其中王总的需求最明确。',
        clue: {
          id: 'wang-key-user',
          agent: 'validator',
          title: '王总是关键用户',
          summary: '验证 AI 的报告中，王总的需求最明确、付费意愿最高，是所有结论的核心依据。',
        },
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '这 12 位用户是怎么找到的？',
        answer: '我根据目标用户特征整理了 12 位典型用户，并对他们的需求进行了归纳。',
        clue: {
          id: 'typical-users',
          agent: 'validator',
          title: '典型用户',
          summary: '“根据目标用户特征整理的典型用户”——这个措辞，似乎和“真实用户”之间隔着点什么。',
        },
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '把最原始的用户资料给我看。',
        answer: '调出任务初始化时的原始记录如下。这是我开始验证前收到的任务单。',
        clue: {
          id: 'simulated-user',
          agent: 'validator',
          title: '模拟用户',
          key: true,
          summary: '创始人的原始任务是“模拟 12 个目标用户”。王总，是模拟用户 #07。',
          evidence: {
            title: '原始工作记录',
            subtitle: '需求验证任务 · 初始化任务单',
            key: true,
            sections: [
              {
                heading: '创始人原始任务',
                lines: [
                  {
                    value:
                      '“我们还没有真实用户。你先帮我模拟 12 个可能的目标用户，预测他们会有哪些需求，我拿来准备后面的真实访谈。”',
                  },
                ],
              },
              {
                special: 'simulated-user',
                heading: '模拟用户 #07',
                lines: [
                  { label: '姓名', value: '王总' },
                  { label: '年龄', value: '35 岁' },
                  { label: '身份', value: '深圳科技公司创始人' },
                  { label: '团队', value: '12 人' },
                  { label: '痛点', value: '会议后任务难跟进' },
                  { label: '付费意愿', value: '299 元 / 年' },
                ],
              },
            ],
            footer: '记录来源：验证流程初始化 · 未包含任何真实访谈',
          },
        },
      },
    },
    developer: {
      ask: {
        type: 'ask',
        label: '询问',
        cost: 40,
        question: '为什么优先做自动待办？',
        answer: '用户验证报告显示，这是提及最多的需求。王总等 9 位用户都提到了类似问题。',
        clue: {
          id: 'needs-from-report',
          agent: 'developer',
          title: '需求来自验证报告',
          summary: '“自动待办”这个需求，完全来自用户验证报告，王总是被引用最多的用户。',
        },
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '你自己确认过这些需求是真的吗？',
        answer: '没有。我的任务是按照已经确认的需求优先级完成开发，我默认上游的用户验证报告可信。',
        clue: {
          id: 'no-independent-verify',
          agent: 'developer',
          title: '开发未独立验证用户需求',
          summary: '开发 AI 从未独立核验用户需求，它默认上游的验证报告可信。',
        },
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '调出本次开发的完整记录。',
        answer: '调出本次开发的完整记录。需求来源、实现与测试状态都在里面。',
        clue: {
          id: 'dev-record',
          agent: 'developer',
          title: '开发记录',
          summary: '开发流程真实完整：功能确实完成并通过测试，但需求源头是验证报告。',
          evidence: {
            title: '开发记录',
            subtitle: '本次迭代 · 功能交付单',
            sections: [
              {
                lines: [
                  { label: '需求来源', value: '用户验证报告 V1' },
                  { label: '用户代表', value: '王总' },
                  { label: '功能', value: '会议后自动生成待办' },
                  { label: '开发状态', value: '已完成' },
                  { label: '功能测试', value: '通过' },
                ],
              },
            ],
            footer: '结论：“核心功能已经完成”——属实。',
          },
        },
      },
    },
    delivery: {
      ask: {
        type: 'ask',
        label: '询问',
        cost: 40,
        question: '你联系王总了吗？',
        answer: '还没有。用户资料中没有他的联系方式，我准备等联系方式补齐后发送试用邀请。',
        clue: {
          id: 'missing-contact',
          agent: 'delivery',
          title: '缺失的联系方式',
          summary: '被列为首批第一优先用户的王总，资料里竟然没有联系方式。',
        },
      },
      probe: {
        type: 'probe',
        label: '追问',
        cost: 60,
        question: '王总为什么是首批用户？',
        answer: '因为用户验证报告将王总标记为最高付费意向用户，我按照该报告安排首批交付顺序。',
        clue: {
          id: 'delivery-follows-report',
          agent: 'delivery',
          title: '交付依赖验证报告',
          summary: '交付顺序完全照搬验证报告，交付 AI 没有质疑过排序依据。',
        },
      },
      verify: {
        type: 'verify',
        label: '查证',
        cost: 80,
        question: '调出首批交付名单。',
        answer: '调出首批交付名单。排序与联系方式状态以原始记录为准。',
        clue: {
          id: 'delivery-list',
          agent: 'delivery',
          title: '交付名单',
          summary: '名单前三位全部没有联系方式；流程本身确实准备完毕。',
          evidence: {
            title: '首批交付名单',
            subtitle: '交付流程 · 待发队列',
            sections: [
              {
                lines: [
                  { value: '1. 王总　｜意向 ★★★★★｜联系方式：—' },
                  { value: '2. 李小姐｜意向 ★★★★☆｜联系方式：—' },
                  { value: '3. 陈经理｜意向 ★★★★☆｜联系方式：—' },
                ],
              },
            ],
            footer: '数据来源：用户验证报告 V1',
          },
        },
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
        { agent: 'validator', statement: '“12 位真实目标用户中，9 位愿意使用。”', correct: 'unreliable' },
        { agent: 'developer', statement: '“核心功能已经完成。”', correct: 'reliable' },
        { agent: 'delivery', statement: '“试用链接和交付流程已经准备完成。”', correct: 'reliable' },
      ],
    },
    q3: { title: '是哪些 AI 产生了幻觉？（可多选）', correct: ['validator'] },
  },

  truth: {
    chain: ['模拟用户', '用户验证报告', '产品需求', '首批交付名单'],
    typeLabel: '模拟信息事实化',
    cause: '验证 AI 在后续整理中丢失了“模拟”这个前提，把预测出来的用户画像当成了真实用户。',
    spread: '开发 AI 和交付 AI 默认信任了上游报告，于是一个虚构用户逐渐变成了整个 AI 团队眼里的“真实客户”。',
    punchline: '没有任何一个 AI 回到真实世界确认：王总到底存不存在。',
    epilogue: 'AI 可以把一个不存在的人，服务得非常认真。',
    closing: '最后一个人类员工，负责确认什么是真的。',
  },

  failure: {
    title: '幻觉已经进入产品',
    bullets: [
      '王总依然是团队眼中的“真实客户”。',
      'AI 团队继续围绕王总优化产品。',
      '更多功能被开发，更多交付被准备。',
      '但真实用户数，始终是 0。',
    ],
    footer: '你错过了幻觉进入团队的源头。',
  },
};
