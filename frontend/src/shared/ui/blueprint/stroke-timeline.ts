import { duration } from '../../lib';
import type { DrawingPhase, PenStroke } from './figure';

const PHASES: readonly { phase: DrawingPhase; duration: number }[] = [
  { phase: 'contour', duration: duration.drawn },
  { phase: 'structure', duration: duration.drawn * 0.7 },
  { phase: 'details', duration: duration.drawn * 0.3 },
];
const PHASE_PAUSE = duration.quick;
const PEN_LIFT_SHARE = 0.08;
export const INK_DURATION =
  PHASES.reduce((total, phase) => total + phase.duration, 0) + PHASE_PAUSE * (PHASES.length - 1);
export const GLASSES_DURATION = duration.slow;
export const FIGURE_DRAW_DURATION = INK_DURATION + GLASSES_DURATION;

/** Phase order is authoritative, regardless of the input path order. */
export function schedulePenStrokes(strokes: readonly PenStroke[]) {
  let phaseStart = 0;
  return PHASES.flatMap(({ phase, duration: phaseDuration }) => {
    const paths = strokes.filter((stroke) => stroke.phase === phase);
    const totalLength = paths.reduce((total, stroke) => total + stroke.length, 0);
    const liftTime = paths.length > 1 ? (phaseDuration * PEN_LIFT_SHARE) / (paths.length - 1) : 0;
    const drawingTime = phaseDuration - liftTime * Math.max(0, paths.length - 1);
    let start = phaseStart;
    phaseStart += phaseDuration + PHASE_PAUSE;
    return paths.map((stroke) => {
      const strokeDuration = (stroke.length / totalLength) * drawingTime;
      const scheduled = { stroke, delay: start, duration: strokeDuration };
      start += strokeDuration + liftTime;
      return scheduled;
    });
  });
}
