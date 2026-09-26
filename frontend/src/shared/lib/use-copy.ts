import { useCallback, useEffect, useRef, useState } from 'react';

const FEEDBACK_MS = 1400;

/** Copies text to the clipboard and exposes a short-lived `copied` flag. */
export function useCopy(): { copied: boolean; copy: (text: string) => Promise<void> } {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), FEEDBACK_MS);
  }, []);

  return { copied, copy };
}
