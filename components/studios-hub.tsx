'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useState, type ReactNode } from 'react';
import type { DirectoryTool } from '@/lib/tool-directory';
import { UiIcon, type IconName } from './ui-icon';
import { utilityTools } from '@/lib/utility-tools';
import { trackToolSelection } from '@/lib/analytics';
import { testerApps } from '@/lib/tester-apps';
import { AppPlayLinks } from './app-play-links';
import { marriageWebsite } from '@/lib/featured-websites';
import { pdfTools } from '@/lib/pdf-tools';
import { calculatorTools } from '@/lib/calculator-tools';

const studios: { id: string; name: string; category: string; description: string; href: string; icon: IconName; tone: string; count: string; external?: boolean }[] = [
  { id: 'pdf', name: 'PDF Studio', category: 'Documents', description: 'Smaller files. Neater pages. Convert, combine, and get your documents ready to go.', href: '/pdf-studio/', icon: 'pdf', tone: 'pdf', count: `${pdfTools.length} tools` },
  { id: 'image', name: 'Image Studio', category: 'Images', description: 'Give every image the right size, format, and finishing touch. No heavy software needed.', href: '/image-studio/', icon: 'image', tone: 'image', count: '7 tools' },
  { id: 'calculator', name: 'Calculator Studio', category: 'Everyday math', description: 'From monthly payments to important dates. Make the numbers make sense.', href: '/calculator-studio/', icon: 'calculator', tone: 'calculator', count: `${calculatorTools.length} calculators` },
  { id: 'base64', name: 'Base64 Studio', category: 'For developers', description: 'Encode, decode, and get back to building. Text, files, images, and everything in between.', href: '/base64-converter/', icon: 'code', tone: 'code', count: '18 tools' },
  { id: 'email', name: 'Email Editor', category: 'Create & send', description: 'Turn a good idea into a great email. Build visually, preview, and export your HTML.', href: '/email-template-editor/', icon: 'mail', tone: 'email', count: 'Visual builder' },
  { id: 'milan', name: 'Marriage Biodata', category: 'Create & send', description: 'Create a marriage biodata on Milan. Choose from 30 templates and download a free PDF or PNG, without a watermark.', href: marriageWebsite.href, icon: 'heart', tone: 'email', count: 'Free PDF & PNG / New tab', external: true },
];

const androidAppCards = [
  { id: 'dhebevoice', href: '/dhebevoice/#early-access', signupHref: '/dhebevoice/#tester-signup', name: 'DhebeVoice', label: 'Reading, out loud', description: 'Turn text, books, and readable web pages into listening time. Help shape our Android reading companion.', tone: 'voice', icon: testerApps.dhebevoice.icon },
  { id: 'rivetprep', href: '/apps/rivetprep/#early-access', signupHref: '/apps/rivetprep/#tester-signup', name: 'RivetPrep', label: 'Offline EPA 608 study', description: 'Learn with offline lessons, practice questions, flashcards, and focused review. Volunteer to test the study experience.', tone: 'rivet', icon: testerApps.rivetprep.icon },
  { id: 'rostercairn', href: '/apps/rostercairn/#early-access', signupHref: '/apps/rostercairn/#tester-signup', name: 'RosterCairn', label: 'Shifts & Pay', description: 'Plan shifts, record actual hours, and understand your pay estimate. Help test an Android ledger built around working life.', tone: 'roster', icon: testerApps.rostercairn.icon },
] as const;

const shortcuts: { label: string; note: string; href: string; icon: IconName; tone: string }[] = [
  { label: 'Compress PDF', note: 'Make room for the important stuff', href: '/compress-pdf/', icon: 'pdf', tone: 'pdf' },
  { label: 'Remove background', note: 'A clean cut, without the effort', href: '/image-tools/background-remover/', icon: 'image', tone: 'image' },
  { label: 'Text to Base64', note: 'A quick encode, then back to it', href: '/tools/text-to-base64/', icon: 'code', tone: 'code' },
];

export function StudiosHub({ tools, featuredApp, toolIndex }: { tools: DirectoryTool[]; featuredApp?: ReactNode; toolIndex?: ReactNode }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All studios');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  useEffect(() => { const initialQuery = new URLSearchParams(window.location.search).get('q'); if (initialQuery) setQuery(initialQuery); }, []);
  const results: (DirectoryTool & { external?: boolean })[] = deferredQuery ? [
    ...tools.filter(tool => (tool.label + ' ' + tool.description + ' ' + tool.category).toLowerCase().includes(deferredQuery)),
    ...(marriageWebsite.searchTerms.includes(deferredQuery) || marriageWebsite.label.toLowerCase().includes(deferredQuery) ? [{ ...marriageWebsite, category: 'Separate website', external: true }] : []),
  ] : [];
  const visibleStudios = category === 'All studios' ? studios : studios.filter(studio => studio.category === category);
  return (
    <div className="home-page" onClickCapture={event => { const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-tool-id]'); if (link?.dataset.toolId) trackToolSelection(link.dataset.toolId, 'home'); }}>
      <section className="home-hero content-container">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span className="status-dot" />A simpler way to get things done</p>
          <h1>Free online tools.<br /><span>Less busywork.</span></h1>
          <p className="hero-description">Convert a PDF, polish an image, run the numbers, or discover Milan for marriage biodata. Find your tool and keep moving.</p>
          <div className="home-search-wrap">
            <label className="home-search"><UiIcon name="search" width="22" height="22" /><input aria-label="Search all tools" placeholder="What do you need to do?" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') setQuery(''); }} />{query ? <button type="button" aria-label="Clear tool search" onClick={() => setQuery('')}><UiIcon name="close" width="18" height="18" /></button> : <span className="search-hint">Find a tool</span>}</label>
            {deferredQuery && <div className="home-search-results" role="region" aria-label="Tool search results"><p className="search-result-count" role="status">{results.length} {results.length === 1 ? 'tool' : 'tools'} found{results.length > 12 ? ' / showing first 12' : ''}</p>{results.slice(0, 12).map(tool => <Link key={tool.href} href={tool.href} target={tool.external ? '_blank' : undefined} rel={tool.external ? 'noopener noreferrer' : undefined} data-tool-id={tool.external ? undefined : tool.href.replace(/^\/|\/$/g, '').replace(/\//g, ':')} data-website-id={tool.external ? 'milan' : undefined} data-website-placement={tool.external ? 'search' : undefined}><div><strong>{tool.label}</strong><span>{tool.category}{tool.external ? ' / Opens in a new tab' : ''}</span></div><UiIcon name="arrow" width="17" height="17" /></Link>)}{results.length === 0 && <div className="home-search-empty">Try "PDF", "resize", "biodata", or "calculator".</div>}</div>}
          </div>
          <div className="hero-popular"><span>Popular:</span><Link href="/compress-pdf/">Compress PDF</Link><Link href="/pdf-to-word/">PDF to Word</Link><Link href="/image-tools/image-resizer/">Resize image</Link></div>
          <div className="hero-assurances"><span><UiIcon name="check" width="15" height="15" />Free to use</span><span><UiIcon name="check" width="15" height="15" />No sign-up</span><span><UiIcon name="check" width="15" height="15" />Made to be simple</span></div>
        </div>
        <div className="hero-shelf reveal">
          <div className="shelf-caption"><span>LESS FRICTION. MORE FLOW.</span><span aria-hidden="true">01 / 03</span></div>
          <div className="shelf-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-file art-file-back"><UiIcon name="image" width="44" height="44" /></div><div className="art-file art-file-front"><UiIcon name="pdf" width="36" height="36" /><div /><div /><div /></div><span className="art-check"><UiIcon name="check" width="24" height="24" /></span><span className="art-spark spark-one">+</span><span className="art-spark spark-two">+</span></div>
          <div className="shortcut-list"><p>A good place to start</p>{shortcuts.map(shortcut => <Link key={shortcut.href} href={shortcut.href} className={'shortcut-item tone-' + shortcut.tone}><span className="shortcut-icon"><UiIcon name={shortcut.icon} /></span><span><strong>{shortcut.label}</strong><small>{shortcut.note}</small></span><UiIcon name="arrow" width="18" height="18" /></Link>)}</div>
        </div>
      </section>
      <section id="all-studios" className="studio-section content-container">
        <div className="section-heading"><div><p className="eyebrow">THE RIGHT TOOL, RIGHT HERE</p><h2>A toolkit for your kind of day.</h2></div><p>Less searching. More doing.<br />Choose a studio and make it happen.</p></div>
        <div className="category-tabs" aria-label="Filter studios">{['All studios', 'Documents', 'Images', 'Everyday math', 'For developers', 'Create & send'].map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="studio-grid">{visibleStudios.map((studio, index) => <Link key={studio.id} id={studio.id === 'milan' ? 'marriage-biodata' : undefined} href={studio.href} target={studio.external ? '_blank' : undefined} rel={studio.external ? 'noopener noreferrer' : undefined} data-website-id={studio.external ? 'milan' : undefined} data-website-placement={studio.external ? 'featured' : undefined} className={'studio-card tone-' + studio.tone} prefetch={false}><div className="studio-card-top"><span className="studio-icon"><UiIcon name={studio.icon} width="25" height="25" /></span><span className="card-index">{String(index + 1).padStart(2, '0')}</span></div><p className="studio-category">{studio.category}</p><h3>{studio.name}</h3><p className="studio-description">{studio.description}</p><div className="studio-card-bottom"><span>{studio.count}</span><span className="card-arrow"><UiIcon name="arrow" width="19" height="19" /></span></div>{studio.external && <span className="sr-only">Opens Milan at shaadi.dhebe.com in a new tab.</span>}</Link>)}</div>
      </section>
      <section id="android-apps" className="android-app-section content-container" aria-labelledby="android-apps-title">
        <div className="section-heading"><div><p className="eyebrow">FROM OUR ANDROID WORKBENCH</p><h2 id="android-apps-title">Try what we're building.</h2></div><p>Three apps in closed testing.<br />Join your invited app, or request access.</p></div>
        <p className="android-test-access-note">Invited testers: join the closed test before installing. Use the same eligible Google account in your browser and the Play Store. New visitors can request an invitation on each app's page.</p>
        <div className="studio-grid">{androidAppCards.map(app => <article key={app.id} className={`studio-card android-app-card tone-${app.tone}`}>
          <Link href={app.href} className="android-app-card-summary" prefetch={false}><div className="studio-card-top"><span className="studio-icon"><img src={app.icon} alt={app.name + ' app logo'} width={54} height={54} /></span><span className="studio-category">Android / Closed testing</span></div><p className="studio-category">{app.label}</p><h3>{app.name}</h3><p className="studio-description">{app.description}</p></Link>
          <AppPlayLinks appId={app.id} compact />
          <Link href={app.signupHref} className="android-request-link" prefetch={false}>Not invited? Request access <UiIcon name="arrow" width="15" height="15" /></Link>
        </article>)}</div>
      </section>
      <section className="content-container new-tools-section"><div className="section-heading"><div><p className="eyebrow">MORE EVERYDAY SHORTCUTS</p><h2>Small tasks. Sorted.</h2></div><p>Prepare a photo. Extract the words.<br />Make a document. Get back to your day.</p></div><div className="new-tools-grid">{Object.entries(utilityTools).map(([id, tool], index) => <Link key={tool.path} href={tool.path} prefetch={false} data-tool-id={id}><span className="eyebrow">{String(index + 1).padStart(2, '0')} / {tool.category}</span><h3>{tool.label}</h3><p>{tool.description}</p><span className="new-tool-link">Open the tool <UiIcon name="arrow" width="18" height="18" /></span></Link>)}</div></section>
      {featuredApp}
      {toolIndex}
      <section className="trust-section content-container"><div className="trust-intro"><p className="eyebrow">BUILT AROUND YOU</p><h2>Useful tools.<br />Nothing in the way.</h2></div><div className="trust-item"><UiIcon name="shield" /><h3>Your files, handled with care.</h3><p>Most tools run on your device. Server conversions are clearly marked, with source files deleted after processing.</p></div><div className="trust-item"><UiIcon name="bolt" /><h3>Open it. Use it. Carry on.</h3><p>No installs or accounts to get started. Just practical tools that fit into the way you already work.</p></div></section>
      <section className="home-help content-container"><div><p className="eyebrow">A LITTLE GUIDANCE GOES A LONG WAY</p><h2>Not sure where to start?</h2><p>Our help center can point you in the right direction.</p></div><Link href="/support/" className="button-primary">Visit the help center <UiIcon name="arrow" width="18" height="18" /></Link></section>
    </div>
  );
}
