import { UiIcon } from './ui-icon';

export function AiTradingSection() {
  return (
    <section className="trading-app-section content-container" aria-labelledby="ai-trading-title">
      <a className="trading-app-card" href="https://trade.dhebe.com/" target="_blank" rel="noopener noreferrer" aria-labelledby="ai-trading-title ai-trading-action">
        <div className="trading-app-copy">
          <p className="eyebrow">FROM OUR APP WORKSHOP</p>
          <div className="trading-app-identity"><span className="trading-app-icon"><UiIcon name="grid" width="24" height="24" /></span><h2 id="ai-trading-title">AI Trading</h2><span className="trading-access">Private access</span></div>
          <p className="trading-app-tagline">Research first.<br />Trade on paper.</p>
          <p className="trading-app-description">A private workspace for market research and paper trading. Review NSE and BSE screening, understand recorded decisions, and follow a simulated portfolio in one place.</p>
          <ul className="trading-app-features"><li><UiIcon name="check" width="15" height="15" />Market screening &amp; research</li><li><UiIcon name="check" width="15" height="15" />Decision journal &amp; paper trades</li><li><UiIcon name="check" width="15" height="15" />System health &amp; risk checks</li></ul>
          <span id="ai-trading-action" className="trading-app-action">Open trading dashboard <UiIcon name="arrow" width="19" height="19" /><small>Sign-in required. Opens in a new tab.</small></span>
        </div>
        <div className="trading-app-preview" aria-hidden="true">
          <div className="trading-preview-top"><span className="status-dot" /><span>THE RESEARCH WORKSPACE</span><span className="trading-preview-badge">PAPER ONLY</span></div>
          <div className="trading-preview-flow"><div><span>01 / OBSERVE</span><strong>Market research</strong><p>Screening &amp; recorded evidence</p></div><span className="trading-flow-line" /><div><span>02 / UNDERSTAND</span><strong>Decision journal</strong><p>Reasoning, limits &amp; data gates</p></div><span className="trading-flow-line" /><div><span>03 / REVIEW</span><strong>Paper portfolio</strong><p>Simulated trades &amp; their history</p></div></div>
          <div className="trading-preview-bottom"><UiIcon name="shield" width="18" height="18" /><span>Private dashboard. No live broker orders.</span></div>
        </div>
      </a>
      <p className="trading-app-disclaimer">Research and simulation only, not investment advice. Screening scores are not profit probabilities; paper results do not establish future returns. The dashboard is private, not an open-signup trading service.</p>
    </section>
  );
}
