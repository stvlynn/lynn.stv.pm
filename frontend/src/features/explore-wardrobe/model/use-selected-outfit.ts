import type { Outfit } from 'entities/outfit';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

const PARAM = 'look';

/** The selected outfit lives in the URL so a look can be linked directly. */
export function useSelectedOutfit(outfits: readonly Outfit[]): {
  selected: Outfit | undefined;
  select: (id: string) => void;
} {
  const [params, setParams] = useSearchParams();
  const requested = params.get(PARAM);
  const selected = outfits.find((outfit) => outfit.id === requested) ?? outfits[0];
  const select = useCallback(
    (id: string) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set(PARAM, id);
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setParams],
  );
  return { selected, select };
}
