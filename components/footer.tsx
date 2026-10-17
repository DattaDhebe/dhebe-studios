import Link from 'next/link';
import { BrandLogo } from './brand-logo';
import { UiIcon } from './ui-icon';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top"><div className="footer-brand"><Link href="/" aria-label="DHEBE Studios home"><BrandLogo /></Link><p>A little less busywork.<br />A lot more room for what matters.</p></div>
          <div className="footer-links"><h2>The toolkit</h2><Link href="/pdf-studio/">PDF tools</Link><Link href="/image-studio/">Image tools</Link><Link href="/calculator-studio/">Calculators</Link></div>
          <div className="footer-links"><h2>Make something</h2><Link href="/base64-converter/">Base64 converter</Link><Link href="/email-template-editor/">Email editor</Link><Link href="/dhebevoice/">DhebeVoice</Link></div>
          <div className="footer-links"><h2>We're here to help</h2><Link href="/support/">Help center <UiIcon name="arrow" width="14" height="14" /></Link><a href="mailto:support@dhebe.com">support@dhebe.com</a><Link href="/dhebevoice/privacy-policy/">DhebeVoice privacy</Link></div>
        </div>
        <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} DHEBE Studios</p><p>Made for your everyday.</p><Link href="/sitemap.xml">Sitemap</Link></div>
      </div>
    </footer>
  );
}
