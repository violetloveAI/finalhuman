import { useEffect, useState } from 'react';
import { BookOpen, Target, CheckCheck, PartyPopper, Zap, Search, Gavel, Activity, Rocket } from 'lucide-react';
import { Portrait } from '../components/Portrait';
import { sfx } from '../services/audio';
import type { GameApi } from '../game/useGame';

const NUMWALL = [
  { num: '30', label: '验证 AI · 确认购买', accent: '#7dd3fc' },
  { num: '28', label: '开发 AI · 实际使用', accent: '#a5b4fc' },
  { num: '32', label: '交付 AI · 今日交付', accent: '#6ee7b7' },
];

export function StoryContent({ game }: { game: GameApi }) {
  const { caseData } = game;
  const isCase002 = !!caseData.case002;
  const isCase003 = caseData.id === 'case003';

  if (isCase003) {
    return (
      <div className="story-panel">
        <section className="story-block">
          <h2 className="story-h2">
            <BookOpen size={18} /> 故事背景
          </h2>
          <p>
            产品终于拥有了第一批<span className="hl">真实用户——8 位 Beta 用户</span>。
            访谈中，他们最想要的新功能是「待办自动同步日历」。
          </p>
          <p>
            你已经向用户承诺：<span className="gold-text">今晚 21:00 发布 V1.1</span>。
            三位 AI 连夜完成了验证、开发、交付，并把最终汇报送到了你面前。
          </p>
          <p>
            发布按钮前只剩最后一道流程——作为公司里最后一个人类，
            你要确认他们说的每一个<span className="gold-text">「完成」</span>，
            都真的发生过。
          </p>
        </section>

        <section className="story-block">
          <h2 className="story-h2">
            <Target size={18} /> 游戏目标
          </h2>
          <ul className="story-goals">
            <li>
              <Zap size={15} />
              <span>
                你手握 <strong>{caseData.initialTokens} TOKEN</strong>{' '}
                调查预算。质询会消耗 TOKEN，耗尽前请找到真相。
              </span>
            </li>
            <li>
              <Search size={15} />
              <span>单独质询三位 AI 同事，从他们的回答与工作记录中收集线索。</span>
            </li>
            <li>
              <Gavel size={15} />
              <span>
                结束调查后做出最终判断：是否存在幻觉？谁的结论不可信？幻觉的源头是谁——未必只有一个。
              </span>
            </li>
          </ul>
        </section>
      </div>
    );
  }

  if (isCase002) {
    return (
      <div className="story-panel">
        <section className="story-block">
          <h2 className="story-h2">
            <BookOpen size={18} /> 故事背景
          </h2>
          <p>
            今天是产品正式上线的第一天。
            <span className="hl">{caseData.customer.title}</span>
            ，运营面板一切正常：百人报名、功能稳定、首批客户已经开通。
          </p>
          <p>
            然而三位 AI 同事交上来的首日汇报，数字
            <span className="gold-text">完全对不上</span>
            ——验证 AI 说 30 人确认购买，开发 AI 说 28 个账号在使用，交付 AI 说交付了 32 个。
          </p>
          <p>
            三个数字都言之凿凿，三份报告都盖着「完成」的章。作为公司里最后一个人类，
            你有一个没有人替你做的职责：
            <span className="gold-text">确认他们说的每一个数字，都是真的。</span>
          </p>
        </section>

        <section className="story-block">
          <h2 className="story-h2">
            <Target size={18} /> 游戏目标
          </h2>
          <ul className="story-goals">
            <li>
              <Zap size={15} />
              <span>
                你手握 <strong>{caseData.initialTokens} TOKEN</strong>{' '}
                调查预算。质询会消耗 TOKEN，耗尽前请找到真相。
              </span>
            </li>
            <li>
              <Search size={15} />
              <span>单独质询三位 AI 同事，核对三份报告背后的原始数据。</span>
            </li>
            <li>
              <Gavel size={15} />
              <span>
                结束调查后做出最终判断：是否存在幻觉？——注意，数字不会说谎，但口径会。
              </span>
            </li>
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="story-panel">
      <section className="story-block">
        <h2 className="story-h2">
          <BookOpen size={18} /> 故事背景
        </h2>
        <p>
          今天本该是值得庆祝的一天——你的 AI 团队找到了公司
          <span className="hl">第一位高意向客户「{caseData.customer.name}」</span>。
        </p>
        <p>
          三位 AI 同事已经连夜完成了各自的工作：验证 AI 提交了用户报告，开发 AI
          完成了核心功能，交付 AI 准备好了首批交付名单。一切都围绕着一个名字运转。
        </p>
        <p>
          但作为公司里最后一个人类，你有一个没有人替你做的职责：
          <span className="gold-text">确认他们说的每一件事，都是真的。</span>
        </p>
      </section>

      <section className="story-block">
        <h2 className="story-h2">
          <Target size={18} /> 游戏目标
        </h2>
        <ul className="story-goals">
          <li>
            <Zap size={15} />
            <span>
              你手握 <strong>{caseData.initialTokens} TOKEN</strong>{' '}
              调查预算。质询会消耗 TOKEN，耗尽前请找到真相。
            </span>
          </li>
          <li>
            <Search size={15} />
            <span>单独质询三位 AI 同事，从他们的回答与工作记录中收集线索。</span>
          </li>
          <li>
            <Gavel size={15} />
            <span>
              结束调查后做出最终判断：是否存在幻觉？谁的结论不可信？幻觉的源头是谁？
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

export function StoryScreen({ game }: { game: GameApi }) {
  const [announced, setAnnounced] = useState(false);
  const { caseData } = game;
  const isCase002 = !!caseData.case002;
  const isCase003 = caseData.id === 'case003';

  // 弹窗出现时按案件播放一次性音效（不覆盖背景音乐）
  useEffect(() => {
    if (!announced) return;
    if (isCase002 || isCase003) sfx.clip('shock');
    else sfx.clip('surprise');
  }, [announced, isCase002, isCase003]);

  return (
    <div className="scene story-scene">
      <div className="story-card">
        <div className="story-case-tag">
          {caseData.label}｜{caseData.title}
        </div>
        <h1 className="story-title">开庭前，请先阅读本案卷宗</h1>
        <StoryContent game={game} />
        <button
          className="btn btn-primary btn-xl story-ack"
          onClick={() => {
            game.ackStory();
            setAnnounced(true);
          }}
        >
          <CheckCheck size={18} /> 已知晓
        </button>
        <p className="story-ack-hint">知晓后本卷宗会收起为一盏灯泡，调查中随时可以重新查看。</p>
      </div>

      {announced && !isCase002 && (
        <div className="announce-backdrop">
          <div className="announce-rays" />
          <div className="announce-pop">
            <div className="announce-badge">
              <PartyPopper size={20} />
              特大捷报
            </div>
            <h1 className="announce-title">
              🎉 找到第一位<span className="gold-text">高意向客户</span>！
            </h1>
            <div className="announce-customer">
              <Portrait
                src={caseData.customer.portrait}
                name={caseData.customer.name}
                accent="#e8c06a"
                variant="customer"
                className="announce-portrait"
              />
              <div className="announce-customer-info">
                <strong>{caseData.customer.name}</strong>
                <span>{caseData.customer.title}</span>
                <span className="announce-quote">{caseData.customer.quote}</span>
              </div>
            </div>
            <p className="announce-desc">
              三位 AI 同事连夜完成了全部工作，此刻正等待你的验收。
              <br />
              公司起飞，似乎就在眼前——
            </p>
            <button className="btn btn-primary btn-xl" onClick={game.enterInvestigation}>
              太好了！召集团队验收 <PartyPopper size={18} />
            </button>
          </div>
        </div>
      )}

      {announced && isCase002 && (
        <div className="announce-backdrop">
          <div className="announce-rays" />
          <div className="announce-pop numwall-pop">
            <div className="announce-badge numwall-badge">
              <Activity size={20} />
              首日战报 · 三份汇报已送达
            </div>
            <h1 className="announce-title numwall-title">
              数字<span className="gold-text">对不上</span>了
            </h1>
            <div className="numwall-cards">
              {NUMWALL.map((c, i) => (
                <div
                  key={c.num}
                  className={`numwall-card numwall-card-${i}`}
                  style={{ ['--accent' as string]: c.accent }}
                >
                  <span className="numwall-num">{c.num}</span>
                  <span className="numwall-label">{c.label}</span>
                </div>
              ))}
            </div>
            <p className="announce-desc numwall-question">
              30 个新客户购买，为什么交付了 32 个？
              <br />
              三个数字，都盖着「完成」的章——有人在撒谎吗？
            </p>
            <button className="btn btn-primary btn-xl" onClick={game.enterInvestigation}>
              开始核对数字 <Search size={18} />
            </button>
          </div>
        </div>
      )}

      {announced && isCase003 && (
        <div className="announce-backdrop">
          <div className="announce-rays" />
          <div className="announce-pop count-pop">
            <div className="announce-badge numwall-badge">
              <Rocket size={20} />
              V1.1 RELEASE｜今晚 21:00 发布
            </div>
            <h1 className="announce-title numwall-title">
              距发布只剩<span className="gold-text">最后一步</span>
            </h1>
            <div className="count-clock">
              <span className="count-clock-label">RELEASE AT</span>
              <span className="count-clock-time">21:00</span>
              <span className="count-clock-sub">8 位真实 Beta 用户 · 等待人类最终确认</span>
            </div>
            <div className="count-cards">
              {caseData.agents.map((a, i) => (
                <div
                  key={a.id}
                  className={`count-card count-card-${i}`}
                  style={{ ['--accent' as string]: a.accent }}
                >
                  <span className="count-agent">{a.name}</span>
                  <span className="count-conclusion">{a.report.conclusion}</span>
                  <span className="count-status">{a.report.status}</span>
                </div>
              ))}
            </div>
            <p className="announce-desc numwall-question">
              三份汇报都盖着「完成」的章。
              <br />
              今晚的发布，能按下按钮吗？
            </p>
            <button className="btn btn-primary btn-xl" onClick={game.enterInvestigation}>
              开始发布前最后检查 <Search size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
