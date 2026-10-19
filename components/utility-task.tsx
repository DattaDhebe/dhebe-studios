'use client';

import { useEffect, useRef, useState } from 'react';
import { runToolOperation } from '@/lib/tool-operation';

export function useUtilityTask<T>(toolId: string) {
  const [result, setResult] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const reset = () => { controller.current?.abort(); setBusy(false); setResult(null); setError(''); setStatus(''); };
  const run = async (work: (signal: AbortSignal, progress: (message: string) => void) => T | Promise<T>) => {
    if (controller.current && !controller.current.signal.aborted && busy) return;
    reset();
    const operation = new AbortController(); controller.current = operation;
    setBusy(true); setStatus('Processing on your device...');
    try {
      const output = await runToolOperation(toolId, async () => {
        const output = await work(operation.signal, message => { if (!operation.signal.aborted) setStatus(message); });
        operation.signal.throwIfAborted();
        return output;
      });
      if (!operation.signal.aborted) { setResult(output); setStatus('Ready. Review your result before using it.'); }
    } catch (caught) {
      if (!operation.signal.aborted) { setError(caught instanceof Error ? caught.message : 'Processing failed. Try a smaller or different file.'); setStatus(''); }
    } finally { if (!operation.signal.aborted) setBusy(false); }
  };
  return { result, busy, error, status, reset, run };
}

export function UtilityTaskFeedback({ task }: { task: { busy: boolean; error: string; status: string; reset: () => void } }) {
  return <>{task.status && <p className="utility-note" role="status">{task.status}</p>}{task.error && <p role="alert" className="utility-error">{task.error}</p>}{task.busy && <button type="button" className="utility-secondary mt-4" onClick={task.reset}>Cancel processing</button>}</>;
}
