import { motion } from 'motion/react';
import { FIGURE_HEIGHT, FIGURE_WIDTH, type PenStroke } from './figure';
import { GLASSES_DURATION, INK_DURATION, schedulePenStrokes } from './stroke-timeline';

/** Centerlines uncover the original ink, preserving its filled contours and holes. */
export function FigureStrokeMask({
  id,
  strokes,
  glasses,
  onComplete,
}: {
  readonly id: string;
  readonly strokes: readonly PenStroke[];
  readonly glasses: readonly string[];
  readonly onComplete: () => void;
}) {
  const timeline = schedulePenStrokes(strokes);

  return (
    <defs>
      <mask id={id} maskUnits="userSpaceOnUse" x={-12} y={-12} width={FIGURE_WIDTH + 24} height={FIGURE_HEIGHT + 24}>
        <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
          {timeline.map(({ stroke, delay, duration }, index) => {
            return (
              <motion.path
                key={index}
                d={stroke.d}
                data-drawing-phase={stroke.phase}
                strokeWidth={stroke.width}
                onAnimationComplete={glasses.length === 0 && index === timeline.length - 1 ? onComplete : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration, delay, ease: 'linear' },
                  opacity: { duration: 0, delay },
                }}
              />
            );
          })}
          {glasses.map((path, index) => (
            <motion.path
              key={path}
              d={path}
              data-drawing-phase="details"
              strokeWidth={4}
              onAnimationComplete={index === glasses.length - 1 ? onComplete : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: GLASSES_DURATION / glasses.length,
                  delay: INK_DURATION + (index / glasses.length) * GLASSES_DURATION,
                  ease: 'linear',
                },
                opacity: { duration: 0, delay: INK_DURATION + (index / glasses.length) * GLASSES_DURATION },
              }}
            />
          ))}
        </g>
      </mask>
    </defs>
  );
}
