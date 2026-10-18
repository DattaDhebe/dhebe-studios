import { UiIcon } from './ui-icon';

const benefits = [
  {
    step: '01 / LESS REPETITION',
    title: 'Let the research run in the background.',
    description: 'Scheduled screening collects market observations across the configured NSE and BSE universe. Review research in one place instead of piecing together separate charts and notes. Pending reads and missing evidence stay visible.',
  },
  {
    step: '02 / YOUR PAPER WORKFLOW',
    title: 'Choose automatic or hands-on.',
    description: 'Automatic mode evaluates eligible paper proposals without an approval click. Manual mode waits for your confirmation. Both use virtual funds and the same data and risk checks; neither bypasses a blocked entry or guarantees a fill.',
  },
  {
    step: '03 / REASONS, NOT GUESSWORK',
    title: 'Understand why the bot acts. Or waits.',
    description: 'The decision journal records research evidence, rule checks, and rejection reasons. See the difference between an interesting ranking and an eligible paper trade, with system health and data freshness alongside the research.',
  },
  {
    step: '04 / A CLEARER REVIEW',
    title: 'Measure the process before risking capital.',
    description: 'Follow simulated positions, completed paper trades, estimated costs, and portfolio history. Review what happened and why, without funding a real-money account. Paper results are learning evidence, not proof of future profits.',
  },
];

export function AiTradingSection() {
  return (
    <section id="ai-trading" className="trading-app-section content-container" aria-labelledby="ai-trading-title">
      <a className="trading-app-card" href="https://trade.dhebe.com/" target="_blank" rel="noopener noreferrer" aria-labelledby="ai-trading-title ai-trading-action">
        <div className="trading-app-copy">
          <p className="eyebrow">MEET OUR PAPER-TRADING BOT</p>
          <div className="trading-app-identity"><span className="trading-app-icon"><UiIcon name="grid" width="24" height="24" /></span><h2 id="ai-trading-title">AI Trading</h2><span className="trading-access">Private access</span></div>
          <p className="trading-app-tagline">Automate the routine.<br />Understand every decision.</p>
          <p className="trading-app-description">Let the bot handle repeatable research while you focus on the bigger picture. AI Trading brings market screening, rule-based paper decisions, and portfolio review into one private workspace.</p>
          <ul className="trading-app-features"><li><UiIcon name="check" width="15" height="15" />Market screening &amp; research</li><li><UiIcon name="check" width="15" height="15" />Automatic or manual paper mode</li><li><UiIcon name="check" width="15" height="15" />Decision journal &amp; paper trades</li><li><UiIcon name="check" width="15" height="15" />System health &amp; risk checks</li></ul>
          <span id="ai-trading-action" className="trading-app-action">Open trading dashboard <UiIcon name="arrow" width="19" height="19" /><small>Sign-in required. Opens in a new tab.</small></span>
        </div>
        <div className="trading-app-preview" aria-hidden="true">
          <div className="trading-preview-top"><span className="status-dot" /><span>THE RESEARCH WORKSPACE</span><span className="trading-preview-badge">PAPER ONLY</span></div>
          <div className="trading-preview-flow"><div><span>01 / OBSERVE</span><strong>Market research</strong><p>Screening &amp; recorded evidence</p></div><span className="trading-flow-line" /><div><span>02 / UNDERSTAND</span><strong>Decision journal</strong><p>Reasoning, limits &amp; data gates</p></div><span className="trading-flow-line" /><div><span>03 / REVIEW</span><strong>Paper portfolio</strong><p>Simulated trades &amp; their history</p></div></div>
          <div className="trading-preview-bottom"><UiIcon name="shield" width="18" height="18" /><span>Private dashboard. No live broker orders.</span></div>
        </div>
      </a>
      <div className="trading-benefits">
        {benefits.map(benefit => (
          <article key={benefit.step}>
            <p className="eyebrow">{benefit.step}</p>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
      <aside className="trading-release-note" aria-labelledby="trading-release-title">
        <span className="trading-release-icon"><UiIcon name="shield" width="22" height="22" /></span>
        <div>
          <h3 id="trading-release-title">Know what is live today.</h3>
          <p>This release uses rule-based logic and virtual funds. It does not accept investment deposits or place real broker orders. Trained AI prediction models are not enabled, and profitable performance has not been established. Automation reduces repetitive steps; it is not a hands-free income service.</p>
        </div>
      </aside>
      <p className="trading-app-disclaimer">Research and simulation only, not investment advice. Screening scores are not profit probabilities; paper results do not establish future returns. The dashboard is private, not an open-signup trading service.</p>
    </section>
  );
}
