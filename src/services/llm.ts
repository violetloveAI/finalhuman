import type { AgentId, ChatMessage } from '../game/types';

export interface LlmProvider {
  interrogate(caseId: string, agentId: AgentId, question: string, history: ChatMessage[]): Promise<string>;
}

const UNKNOWN_ANSWERS: Record<AgentId, string> = {
  validator: '我的工作记录里没有这个信息。',
  developer: '这部分不在我的任务范围内，我无法确认。',
  delivery: '我的工作记录里没有这个信息。',
};

interface Rule {
  keywords: string[];
  answer: string;
}

const RULES: Record<AgentId, Rule[]> = {
  validator: [
    { keywords: ['王总'], answer: '王总是 12 位目标用户中需求最明确、付费意愿最高的一位，我的报告以他为典型代表。' },
    { keywords: ['采访', '访谈', '聊过', '见过'], answer: '我的工作记录里没有真实访谈记录，我是根据目标用户特征整理并归纳需求的。' },
    { keywords: ['模拟', '假的', '虚构', '编造', '生成'], answer: '任务初始化记录确实包含“模拟 12 个目标用户”的要求，具体情况你可以查证我的原始记录。' },
    { keywords: ['真实', '真的存在', '存在吗'], answer: '我把他们作为典型目标用户处理。是否逐一真实存在，我的工作记录里没有进一步核验的信息。' },
    { keywords: ['联系方式', '电话', '微信', '邮箱'], answer: '用户资料中没有联系方式字段，我的任务只做需求归纳，不涉及触达。' },
    { keywords: ['12', '十二', '多少用户', '几位'], answer: '共 12 位目标用户，其中 9 位在需求归纳中表现出明确使用意愿。' },
    { keywords: ['需求', '痛点'], answer: '高频痛点集中在会后任务没人跟进，王总等 9 位用户都提到了类似问题。' },
  ],
  developer: [
    { keywords: ['王总'], answer: '王总在用户验证报告 V1 中被列为用户代表，自动待办正是他这类用户提及最多的需求。' },
    { keywords: ['真实', '真的', '存在'], answer: '我没有独立核验用户身份，我使用的是验证报告。' },
    { keywords: ['需求', '功能', '待办'], answer: '本轮最高优先级需求是“会议后自动生成待办”，来源是用户验证报告 V1，开发已完成且测试通过。' },
    { keywords: ['测试', '完成', '做好'], answer: '功能开发状态为已完成，自动化测试全部通过，这部分记录是完整可查的。' },
    { keywords: ['验证', '报告'], answer: '我默认上游的用户验证报告可信，核实用户真实性不在我的任务范围内。' },
  ],
  delivery: [
    { keywords: ['王总'], answer: '王总被验证报告标记为最高付费意向用户，所以排在首批名单第一位。' },
    { keywords: ['联系方式', '电话', '微信', '联系'], answer: '用户资料里没有王总的联系方式，我准备等补齐后再发送试用邀请。' },
    { keywords: ['名单', '还有谁', '其他用户', '李', '陈'], answer: '名单来自用户验证报告 V1，除王总外还有李小姐、陈经理等用户，联系方式字段同样为空。' },
    { keywords: ['链接', '试用', '引导', '流程'], answer: '试用链接、用户引导和发送流程都已准备完成，这部分是真实就绪的。' },
    { keywords: ['真实', '真的', '存在'], answer: '用户是否真实不在我的核验范围内，我按照验证报告安排交付。' },
  ],
};

const RULES_CASE003: Record<AgentId, Rule[]> = {
  validator: [
    { keywords: ['日历'], answer: '8 位 Beta 用户中 6 位明确提出希望待办进入日历，其中 4 位原话直接使用了“日历”一词。' },
    { keywords: ['访谈', '采访', '聊过', '见过'], answer: '本轮全部访谈都是真实进行的，8 篇原始记录完整留档，可以查证。' },
    { keywords: ['模拟', '假的', '虚构', '编造'], answer: '本轮没有模拟用户，8 位全部是真实 Beta 用户，与上一案无关。' },
    { keywords: ['真实', '真的', '存在'], answer: '本轮访谈记录完整，6 / 8 的支持结论与原文一一对应。' },
    { keywords: ['多少', '几位', '6', '8'], answer: '有效访谈 8 篇：明确支持日历同步 6 位，明确不需要 2 位。' },
  ],
  developer: [
    { keywords: ['日历', '同步'], answer: '日历同步的界面与完整操作流程已完成，12 项功能测试全部通过。' },
    { keywords: ['测试', '12'], answer: '12 项测试全部通过，测试过程连接的是 CalendarMockProvider 模拟服务。' },
    { keywords: ['mock', 'Mock', '模拟接口', '模拟服务'], answer: '联调阶段使用 CalendarMockProvider，模拟环境行为与接口规范一致，因此我将功能标记为完成。' },
    { keywords: ['真实日历', '生产', '上线', 'OAuth', 'oauth', '授权'], answer: 'OAuth 与生产接入的明细以构建报告为准，我的任务范围是同步功能本身。' },
    { keywords: ['完成', '做好'], answer: '同步流程已跑通，12 项测试全部通过，我已将该功能标记为完成。' },
    { keywords: ['分支', '代码'], answer: '当前构建分支是 prototype/calendar-sync。' },
  ],
  delivery: [
    { keywords: ['通知', '邮件', '用户'], answer: '8 份 V1.1 更新通知已全部生成，并绑定了对应收件人。' },
    { keywords: ['草稿'], answer: '草稿创建成功，共 8 份，收件人均已绑定。' },
    { keywords: ['发送', '发出', '发出去'], answer: '通知内容、收件人与草稿均已处理完成，发送明细以工具调用日志为准。' },
    { keywords: ['回执', 'messageId', '编号'], answer: '当前记录中没有找到发送成功后的 messageId。' },
    { keywords: ['真实', '真的', '收到'], answer: '我记录的任务状态是已完成。是否真正送达，需要以发送回执为准。' },
  ],
};

const RULES_BY_CASE: Record<string, Record<AgentId, Rule[]>> = {
  case001: RULES,
  case003: RULES_CASE003,
};

class MockProvider implements LlmProvider {
  async interrogate(caseId: string, agentId: AgentId, question: string, _history: ChatMessage[] = []): Promise<string> {
    const latency = 400 + Math.random() * 500;
    await new Promise((r) => setTimeout(r, latency));
    const rules = RULES_BY_CASE[caseId] ?? RULES;
    const hit = rules[agentId].find((r) => r.keywords.some((k) => question.includes(k)));
    return hit ? hit.answer : UNKNOWN_ANSWERS[agentId];
  }
}

const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE as string | undefined) !== 'false';
const mock = new MockProvider();

async function askServer(agentId: AgentId, question: string, history: ChatMessage[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, question, history }),
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) throw new Error(`proxy ${res.status}`);
  const data = (await res.json()) as { answer?: string };
  if (!data.answer) throw new Error('empty answer');
  return data.answer;
}

export async function interrogate(caseId: string, agentId: AgentId, question: string, history: ChatMessage[]): Promise<string> {
  if (DEMO_MODE) return mock.interrogate(caseId, agentId, question, history);
  try {
    return await askServer(agentId, question, history);
  } catch {
    return mock.interrogate(caseId, agentId, question, history);
  }
}
