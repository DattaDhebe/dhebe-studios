'use client';

import { useEffect, useRef, useState } from 'react';

export function useCopyFeedback() {
  const [copied, setCopied] = useState(false);
  const version = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reset = () => {
    version.current++;
    clearTimeout(timer.current);
    setCopied(false);
  };
  useEffect(() => () => { version.current++; clearTimeout(timer.current); }, []);

  const copy = async (value: string, onFailure: () => void) => {
    const current = ++version.current;
    clearTimeout(timer.current);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(value);
      // Ignore clipboard completions after the input changes or the tool unmounts.
      if (current !== version.current) return;
      clearTimeout(timer.current);
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      if (current === version.current) onFailure();
    }
  };
  return { copied, copy, reset };
}
