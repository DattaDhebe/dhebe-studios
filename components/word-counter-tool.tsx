'use client';

import { useDeferredValue, useState } from 'react';
import { textStatistics } from '@/lib/text-statistics';

export function WordCounterTool() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  const stats = textStatistics(deferredText);
  const duration = (seconds: number) => seconds < 60 ? `${seconds} sec` : `${Math.floor(seconds / 60)} min ${seconds % 60} sec`;
  return (
    <div className="utility-workspace">
      <dl className="utility-stat-grid" role="group" aria-label="Text statistics" aria-live="polite" aria-atomic="true">
        {Object.entries({ Words: stats.words, Characters: stats.characters, 'Characters without whitespace': stats.charactersWithoutSpaces, Paragraphs: stats.paragraphs, 'Reading time': duration(stats.readingSeconds), 'Speaking time': duration(stats.speakingSeconds) }).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <label htmlFor="counter-text" className="utility-label">Your text</label>
      <textarea id="counter-text" rows={12} maxLength={200000} placeholder="Paste or write your text here..." value={text} onChange={event => setText(event.target.value)} aria-describedby="counter-note" />
      <div className="utility-actions"><button type="button" className="utility-secondary" disabled={!text} onClick={() => setText('')}>Clear text</button><p id="counter-note">Nothing is uploaded or saved. Up to 200,000 text units.</p></div>
      <p className="utility-note">Reading and speaking times are estimates at 225 and 150 words per minute. Modern browsers count visible characters (including combined emoji); whitespace-free counts use Unicode code points. Word boundaries may differ from your editor, especially between languages.</p>
    </div>
  );
}
