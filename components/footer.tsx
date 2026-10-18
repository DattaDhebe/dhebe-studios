import Link from 'next/link';
import { BrandLogo } from './brand-logo';
import { UiIcon } from './ui-icon';
import { AnalyticsPreferencesButton } from './analytics';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top"><div className="footer-brand"><Link href="/" aria-label="DHEBE Studios home"><BrandLogo /></Link><p>A little less busywork.<br />A lot more room for what matters.</p></div>
          <div className="footer-links"><h2>The toolkit</h2><Link href="/pdf-studio/">PDF tools</Link><Link href="/image-studio/">Image tools</Link><Link href="/calculator-studio/">Calculators</Link></div>
          <div className="footer-links"><h2>Make something</h2><Link href="/base64-converter/" prefetch={false}>Base64 converter</Link><Link href="/email-template-editor/" prefetch={false}>Email editor</Link><Link href="/qr-code-generator/" prefetch={false}>QR code generator</Link><Link href="/word-counter/" prefetch={false}>Word counter</Link><Link href="/image-size-reducer/" prefetch={false}>Reduce image size in KB</Link><Link href="/dhebevoice/" prefetch={false}>DhebeVoice</Link><a href="https://trade.dhebe.com/" target="_blank" rel="noopener noreferrer">AI Trading <span className="sr-only">(opens in a new tab)</span><UiIcon name="arrow" width="14" height="14" /></a></div>
          <div className="footer-links"><h2>We're here to help</h2><Link href="/support/">Help center <UiIcon name="arrow" width="14" height="14" /></Link><a href="mailto:support@dhebe.com">support@dhebe.com</a><Link href="/dhebevoice/privacy-policy/">DhebeVoice privacy</Link></div>
        </div>
        <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} DHEBE Studios</p><Link href="/privacy/">Website privacy</Link><AnalyticsPreferencesButton /><a href="/sitemap.xml">Sitemap</a></div>
      </div>
    </footer>
  );
}
