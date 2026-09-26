import { useCallback, useEffect, useRef, useState } from 'react';

import { useHaptics } from './device-feedback';

const FEEDBACK_MS = 1400;

/** Copies text to the clipboard and exposes a short-lived `copied` flag. */
export function useCopy(): { copied: boolean; copy: (text: string) => Promise<void> } {
  const pulse = useHaptics();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      pulse('success');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), FEEDBACK_MS);
    },
    [pulse],
  );

  return { copied, copy };
}
