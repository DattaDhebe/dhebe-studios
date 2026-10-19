'use client';

import { useState } from 'react';
import { compareText, type DiffLine } from '@/lib/utility-operations';
import { downloadBlob } from '@/lib/download';
import { useUtilityTask, UtilityTaskFeedback } from './utility-task';

export function TextDiffTool() {
  const [before, setBefore] = useState(''); const [after, setAfter] = useState('');
  const task = useUtilityTask<DiffLine[]>('text-diff-checker');
  return <div className="utility-workspace">
    <div className="utility-two-fields"><div><label className="utility-label" htmlFor="diff-before">Original text</label><textarea id="diff-before" rows={10} maxLength={100000} spellCheck={false} value={before} onChange={event => { task.reset(); setBefore(event.target.value); }} /></div><div><label className="utility-label" htmlFor="diff-after">Updated text</label><textarea id="diff-after" rows={10} maxLength={100000} spellCheck={false} value={after} onChange={event => { task.reset(); setAfter(event.target.value); }} /></div></div>
    <div className="utility-actions"><button className="button-primary" type="button" disabled={task.busy} onClick={() => task.run(() => compareText(before, after))}>Compare texts</button><button className="utility-secondary" type="button" onClick={() => { task.reset(); setBefore(''); setAfter(''); }}>Clear both texts</button></div>
    <UtilityTaskFeedback task={task} />
    {task.result && <section className="diff-result" aria-label="Text comparison result"><p className="utility-note">{task.result.filter(line => line.kind === 'added').length} added / {task.result.filter(line => line.kind === 'removed').length} removed lines. Line endings are normalized; spaces and letter case are compared exactly.</p><div className="diff-lines">{task.result.map((line, index) => <div key={index} className={`diff-${line.kind}`}><span className="diff-marker">{line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : '='}<span className="sr-only"> {line.kind}: </span></span><code>{line.text || ' '}</code></div>)}</div><button className="utility-secondary mt-4" type="button" onClick={() => downloadBlob(new Blob([task.result!.map(line => `${line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '} ${line.text}`).join('\n')], { type: 'text/plain' }), 'text-comparison.txt')}>Download comparison</button></section>}
    <p className="utility-note">Line-by-line comparison, not plagiarism detection or semantic analysis. Text stays in this tab and is cleared on reload. Compare up to 100,000 characters per side; large line-pair comparisons are limited to keep your browser responsive.</p>
  </div>;
}
