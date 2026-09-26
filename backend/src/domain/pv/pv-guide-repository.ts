import type { PvGuide } from './pv-guide';

export interface PvGuideRepository {
  get(): Promise<PvGuide>;
}
