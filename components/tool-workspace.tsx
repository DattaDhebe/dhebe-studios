'use client';

import { useDeferredValue, useId, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { UiIcon, type IconName } from './ui-icon';
import { trackToolSelection } from '@/lib/analytics';

interface WorkspaceOption {
  id: string;
  label: string;
  description: string;
}

interface ToolWorkspaceProps {
  studio: string;
  studioHref: string;
  icon: IconName;
  tone: 'pdf' | 'image' | 'calculator' | 'code';
  title: string;
  description: string;
  activeId: string;
  groups: { label: string; options: readonly WorkspaceOption[] }[];
  onSelect: (id: string) => void;
  serverProcessing?: boolean;
  children: ReactNode;
}

export function ToolWorkspace({ studio, studioHref, icon, tone, title, description, activeId, groups, onSelect, serverProcessing = false, children }: ToolWorkspaceProps) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const navigationId = useId();
  const filteredGroups = groups.map(group => ({ ...group, options: group.options.filter(option => `${option.label} ${option.description}`.toLowerCase().includes(deferredQuery)) }));
  const resultCount = filteredGroups.reduce((total, group) => total + group.options.length, 0);

  return (
    <div className={`tool-workspace tone-${tone}`}>
      <div className="workspace-container">
        <nav className="workspace-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href={studioHref}>{studio}</Link><span>/</span><span aria-current="page">{title}</span>
        </nav>
        <div className="workspace-grid">
          <aside className="tool-sidebar">
            <button type="button" className="tool-sidebar-toggle" aria-expanded={expanded} aria-controls={navigationId} onClick={() => setExpanded(!expanded)}>
              <UiIcon name={icon} /><span>Browse {studio} tools</span><UiIcon name="chevron" className={expanded ? 'rotate-180' : ''} />
            </button>
            <div id={navigationId} className={`tool-sidebar-body ${expanded ? 'is-expanded' : ''}`}>
              <div className="sidebar-title"><span className="studio-icon"><UiIcon name={icon} /></span><div><p>{studio}</p><span>Your everyday toolkit</span></div></div>
              <label className="tool-search"><UiIcon name="search" /><input type="search" aria-label={`Search ${studio} tools`} placeholder="Find a tool..." value={query} onChange={event => setQuery(event.target.value)} /></label>
              <nav aria-label={`${studio} tools`} className="tool-nav">
                {filteredGroups.map(group => group.options.length > 0 && <div className="tool-nav-group" key={group.label}>
                  <p className="tool-group-label">{group.label}</p>
                  {group.options.map(option => <button type="button" key={option.id} aria-label={`Open ${option.label}`} aria-current={activeId === option.id ? 'page' : undefined} className={`tool-nav-item ${activeId === option.id ? 'is-active' : ''}`} onClick={() => { trackToolSelection(option.id, tone); onSelect(option.id); setExpanded(false); }}><span>{option.label}</span>{activeId === option.id && <UiIcon name="arrow" width="16" height="16" />}</button>)}
                </div>)}
                {resultCount === 0 && <div className="tool-empty"><p>No matching tools.</p><button type="button" onClick={() => setQuery('')}>Clear search</button></div>}
              </nav>
              <Link href="/support/" className="sidebar-help">Need a hand?<span>Visit the help center <UiIcon name="arrow" width="15" height="15" /></span></Link>
            </div>
          </aside>
          <section className="workspace-main" aria-label={title} data-active-tool={`${tone}:${activeId}`}>
            <div className="workspace-heading">
              <div className="workspace-eyebrow"><span>{studio}</span><span className="processing-badge"><span />{serverProcessing ? 'Temporary server processing' : 'Runs on your device'}</span></div>
              <h1>{title}</h1><p>{description}</p>
            </div>
            <div className="workspace-canvas">
              <div className="workspace-canvas-bar"><span><UiIcon name={icon} width="16" height="16" />Your workspace</span><span>No account needed <UiIcon name="check" width="15" height="15" /></span></div>
              <div className="workspace-tool">{children}</div>
            </div>
            <div className="workspace-privacy"><UiIcon name="shield" /><p>{serverProcessing ? 'Only the file you select is uploaded. Source files are deleted after conversion.' : 'Your files and inputs are processed in your browser. No server upload is needed.'}</p></div>
          </section>
        </div>
      </div>
    </div>
  );
}
