export type Verdict = 'do' | 'dont' | 'note';

/** A single guideline in a specification: do, don't, or a note. */
export interface Rule {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly verdict: Verdict;
}
