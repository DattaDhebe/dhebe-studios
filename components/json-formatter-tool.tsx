'use client';

import { useState } from 'react';
import { formatJson } from '@/lib/utility-operations';
import { downloadBlob } from '@/lib/download';
import { useUtilityTask, UtilityTaskFeedback } from './utility-task';

export function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState<'2' | '4' | 'tab' | 'minify'>('2');
  const [copied, setCopied] = useState(false);
  const task = useUtilityTask<string>('json-formatter');
  const reset = () => { task.reset(); setCopied(false); };
  return <div className="utility-workspace">
    <div className="utility-two-fields"><div><label className="utility-label" htmlFor="json-input">JSON input</label><textarea id="json-input" className="utility-code" rows={14} maxLength={1000000} spellCheck={false} value={input} onChange={event => { reset(); setInput(event.target.value); }} placeholder={'{"hello": "world"}'} /></div><div><label className="utility-label" htmlFor="json-output">Formatted JSON</label><textarea id="json-output" className="utility-code" rows={14} readOnly spellCheck={false} value={task.result ?? ''} placeholder="Validated output appears here." /></div></div>
    <label className="utility-label" htmlFor="json-indent">Output style</label><select id="json-indent" value={indent} onChange={event => { reset(); setIndent(event.target.value as typeof indent); }}><option value="2">2-space indentation</option><option value="4">4-space indentation</option><option value="tab">Tabs</option><option value="minify">Minified JSON</option></select>
    <div className="utility-actions"><button className="button-primary" type="button" disabled={task.busy} onClick={() => task.run(() => formatJson(input, indent))}>Validate and format JSON</button><button className="utility-secondary" type="button" onClick={() => { reset(); setInput(''); }}>Clear JSON</button>{task.result !== null && <><button className="utility-secondary" type="button" onClick={async () => { try { await navigator.clipboard.writeText(task.result!); setCopied(true); } catch { setCopied(false); } }}>{copied ? 'Copied' : 'Copy JSON'}</button><button className="utility-secondary" type="button" onClick={() => downloadBlob(new Blob([task.result!], { type: 'application/json' }), 'formatted.json')}>Download JSON</button></>}</div>
    <UtilityTaskFeedback task={task} /><p className="utility-note">No uploads, saved drafts, or public sharing. Up to 1 million input characters and 100 formatting levels. Number literals are preserved, including large integers and exponent notation. Copying requires clipboard permission; you can also select the output manually.</p>
  </div>;
}
