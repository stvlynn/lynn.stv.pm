import { type CalloutSide, type TraitAnchor, traitAnchors } from './figure';

export interface CalloutInput {
  readonly id: string;
  readonly code: string;
  readonly label: string;
}

export interface PlacedCallout extends CalloutInput {
  readonly anchor: TraitAnchor;
  readonly labelY: number;
}

export const LABEL_GAP = 100;
export const COLUMN = { left: -44, right: 444 } as const;

/**
 * Stacks callout labels on each side of the figure, in anchor order, so no
 * two labels are closer than LABEL_GAP. Traits without an anchor are skipped.
 */
export function placeCallouts(
  callouts: readonly CalloutInput[],
  anchors: Readonly<Record<string, TraitAnchor>> = traitAnchors,
): PlacedCallout[] {
  const placed: PlacedCallout[] = [];
  for (const side of ['left', 'right'] as const satisfies readonly CalloutSide[]) {
    const onSide = callouts
      .flatMap((callout) => {
        const anchor = anchors[callout.id];
        return anchor && anchor.side === side ? [{ ...callout, anchor }] : [];
      })
      .sort((a, b) => a.anchor.y - b.anchor.y);
    let previous = Number.NEGATIVE_INFINITY;
    for (const callout of onSide) {
      const labelY = Math.max(callout.anchor.y, previous + LABEL_GAP);
      placed.push({ ...callout, labelY });
      previous = labelY;
    }
  }
  return placed;
}
