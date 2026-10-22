'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { BrandLogo } from './brand-logo';
import { ThemeToggle } from './theme-toggle';
import { UiIcon } from './ui-icon';

const links = [
  { href: '/pdf-studio/', label: 'PDF tools', matches: ['pdf', '/merge-', '/split-', '/sign-', '/word-', '/jpg-', '/compress-'] },
  { href: '/image-studio/', label: 'Image tools', matches: ['/image-'] },
  { href: '/calculator-studio/', label: 'Calculators', matches: ['calculator'] },
  { href: '/base64-converter/', label: 'Base64', matches: ['base64'] },
  { href: '/email-template-editor/', label: 'Email editor', matches: ['/email-'] },
  { href: '/#android-apps', label: 'Android apps', matches: ['/dhebevoice/', '/apps/rivetprep/', '/apps/rostercairn/'] },
  { href: '/#ai-trading', label: 'AI Trading', matches: [] },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const activeHref = pathname.includes('base64') ? '/base64-converter/' : links.find(link => link.matches.some(match => pathname.includes(match)))?.href;
  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" aria-label="DHEBE Studios home" className="brand-link" onClick={() => setOpen(false)}><BrandLogo eager /></Link>
        <nav aria-label="Primary" className="desktop-nav">{links.map(link => <Link key={link.href} href={link.href} prefetch={false} aria-current={activeHref === link.href ? 'page' : undefined}>{link.label}</Link>)}</nav>
        <div className="header-actions"><Link href="/support/" className="header-support">Help center</Link><ThemeToggle /><button ref={menuButton} className="icon-button mobile-menu-toggle" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><UiIcon name={open ? 'close' : 'menu'} /></button></div>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile Primary" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); } }}>{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<UiIcon name="arrow" width="17" height="17" /></Link>)}<Link href="/support/" onClick={() => setOpen(false)}>Help center<UiIcon name="arrow" width="17" height="17" /></Link></nav>}
    </header>
  );
}
