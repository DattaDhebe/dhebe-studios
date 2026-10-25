import Link from 'next/link';
import { toolDirectory } from '@/lib/tool-directory';
import { siteRoute } from '@/lib/site';

export function ToolDirectorySection() {
  const categories = [...new Set(toolDirectory.map(tool => tool.category))];
  const structuredData = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'DHEBE Studios tool directory', itemListElement: toolDirectory.map((tool, index) => ({ '@type': 'ListItem', position: index + 1, name: tool.label, url: siteRoute(tool.href) })) };
  return <section id="tool-directory" className="content-container full-tool-directory" aria-labelledby="tool-directory-title"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><p className="eyebrow">THE WHOLE TOOLBOX</p><h2 id="tool-directory-title">Find your next shortcut.</h2><details><summary>Browse all {toolDirectory.length} tools</summary><div className="directory-groups">{categories.map(category => <section key={category}><h3>{category}</h3><ul>{toolDirectory.filter(tool => tool.category === category).map(tool => <li key={tool.href}><Link href={tool.href} data-tool-id={tool.href.replace(/^\/|\/$/g, '').replace(/\//g, ':')} data-tool-workspace={tool.workspace} prefetch={false}>{tool.label}</Link></li>)}</ul></section>)}</div></details></section>;
}
