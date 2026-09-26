import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useMemo } from 'react';
import { cn, duration, ease } from '../../lib';
import { CENTER_X, CHIN, FIGURE_HEIGHT, FIGURE_WIDTH, GLASSES_PATHS, HEAD_TOP, HEAD_UNIT, HEM } from './figure';
import { LINEART_PATHS } from './lineart';
import styles from './FigureDrawing.module.css';
import { COLUMN, type CalloutInput, placeCallouts } from './layout';

const FULL_MARGIN = { left: 350, right: 360, top: 90, bottom: 60 };
const BARE_MARGIN = { left: 24, right: 24, top: 24, bottom: 24 };
const viewBoxFor = (margin: typeof FULL_MARGIN) =>
  `${-margin.left} ${-margin.top} ${FIGURE_WIDTH + margin.left + margin.right} ${FIGURE_HEIGHT + margin.top + margin.bottom}`;
const RULER_X = FIGURE_WIDTH + 300;
const SCAN_OVERSHOOT = 24;

interface FigureDrawingProps {
  readonly label: string;
  readonly callouts?: readonly CalloutInput[];
  readonly activeId?: string | null;
  readonly onActiveChange?: (id: string | null) => void;
  /** Draw the strokes in on mount. */
  readonly draw?: boolean;
  readonly dimensions?: { readonly unit: string; readonly centerline: string; readonly heads: string };
  readonly className?: string;
}

/** Engineering-style front elevation of Lynn with trait callouts. */
export function FigureDrawing({
  label,
  callouts = [],
  activeId = null,
  onActiveChange,
  draw = false,
  dimensions,
  className,
}: FigureDrawingProps) {
  const reduced = useReducedMotion();
  const animate = draw && !reduced;
  const placed = useMemo(() => placeCallouts(callouts), [callouts]);
  const maskId = `figure-reveal-${useId().replace(/:/g, '')}`;
  const drawnAt = duration.drawn;
  const annotated = callouts.length > 0 || dimensions !== undefined;
  const MARGIN = annotated ? FULL_MARGIN : BARE_MARGIN;

  const reveal = (delay: number) =>
    animate
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: duration.slow, ease: ease.out, delay },
        }
      : {};

  const headTicks = Array.from(
    { length: Math.floor((FIGURE_HEIGHT - HEAD_TOP) / HEAD_UNIT) + 1 },
    (_, index) => HEAD_TOP + index * HEAD_UNIT,
  );
  const heads = ((FIGURE_HEIGHT - HEAD_TOP) / HEAD_UNIT).toFixed(2);

  return (
    <svg
      viewBox={viewBoxFor(MARGIN)}
      className={cn(styles.svg, className)}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      {dimensions ? (
        <motion.g {...reveal(0.2)}>
          <path
            className={styles.centerline}
            d={`M ${CENTER_X} ${-MARGIN.top + 24} L ${CENTER_X} ${FIGURE_HEIGHT + 40}`}
          />
          <text className={styles.dimText} x={CENTER_X + 10} y={-MARGIN.top + 44}>
            {dimensions.centerline}
          </text>
          <path className={styles.construction} d={`M ${RULER_X} ${HEAD_TOP} L ${RULER_X} ${FIGURE_HEIGHT}`} />
          <path
            className={styles.construction}
            d={`M ${RULER_X - 30} ${HEAD_TOP} L ${CENTER_X + 40} ${HEAD_TOP}`}
            strokeDasharray="6 8"
          />
          <path
            className={styles.construction}
            d={`M ${RULER_X - 30} ${CHIN} L ${CENTER_X + 40} ${CHIN}`}
            strokeDasharray="6 8"
          />
          {headTicks.map((y, index) => (
            <g key={y}>
              <path className={styles.tick} d={`M ${RULER_X - 14} ${y} L ${RULER_X + 14} ${y}`} />
              {index > 0 ? (
                <text className={styles.dimText} x={RULER_X + 22} y={y + 6}>
                  {index}
                </text>
              ) : null}
            </g>
          ))}
          <path className={styles.tick} d={`M ${RULER_X - 14} ${FIGURE_HEIGHT} L ${RULER_X + 14} ${FIGURE_HEIGHT}`} />
          <text className={styles.dimText} x={RULER_X + 22} y={FIGURE_HEIGHT + 6}>
            {heads} {dimensions.heads}
          </text>
          <text className={styles.dimText} x={RULER_X - 8} y={HEAD_TOP - 18} textAnchor="middle">
            {dimensions.unit}
          </text>
          <path className={styles.construction} d={`M ${HEM.left} ${HEM.y} L ${HEM.right} ${HEM.y}`} />
          <path
            className={styles.tick}
            d={`M ${HEM.left} ${HEM.y - 14} L ${HEM.left} ${HEM.y + 14} M ${HEM.right} ${HEM.y - 14} L ${HEM.right} ${HEM.y + 14}`}
          />
          <path
            className={styles.construction}
            d={`M ${HEM.left} ${HEM.y - 50} L ${HEM.left} ${HEM.y + 6} M ${HEM.right} ${HEM.y - 50} L ${HEM.right} ${HEM.y + 6}`}
            strokeDasharray="4 6"
          />
          <text className={styles.dimText} x={CENTER_X} y={HEM.y + 34} textAnchor="middle">
            {((HEM.right - HEM.left) / HEAD_UNIT).toFixed(2)} {dimensions.unit}
          </text>
        </motion.g>
      ) : null}

      {animate ? (
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <motion.rect
              x={-SCAN_OVERSHOOT}
              y={-SCAN_OVERSHOOT}
              width={FIGURE_WIDTH + SCAN_OVERSHOOT * 2}
              fill="white"
              initial={{ height: 0 }}
              animate={{ height: FIGURE_HEIGHT + SCAN_OVERSHOOT * 2 }}
              transition={{ duration: duration.drawn, ease: ease.inOut }}
            />
          </mask>
        </defs>
      ) : null}

      <g mask={animate ? `url(#${maskId})` : undefined}>
        <g className={styles.lineart}>
          {LINEART_PATHS.map((path, index) => (
            <path key={index} d={path} />
          ))}
        </g>
        <g className={styles.glasses}>
          {GLASSES_PATHS.map((path) => (
            <path key={path} d={path} />
          ))}
        </g>
      </g>

      {animate ? (
        <motion.path
          className={styles.scanline}
          d={`M ${-SCAN_OVERSHOOT * 2} 0 L ${FIGURE_WIDTH + SCAN_OVERSHOOT * 2} 0`}
          initial={{ y: -SCAN_OVERSHOOT, opacity: 1 }}
          animate={{ y: FIGURE_HEIGHT + SCAN_OVERSHOOT, opacity: [1, 1, 0] }}
          transition={{
            duration: duration.drawn,
            ease: ease.inOut,
            opacity: { duration: duration.drawn, times: [0, 0.92, 1] },
          }}
        />
      ) : null}

      {placed.map((callout, index) => {
        const { anchor } = callout;
        const left = anchor.side === 'left';
        const textX = left ? COLUMN.left : COLUMN.right;
        const elbowX = left ? COLUMN.left + 12 : COLUMN.right - 12;
        const active = callout.id === activeId;
        return (
          <motion.g
            key={callout.id}
            className={styles.callout}
            data-active={active}
            onPointerEnter={onActiveChange ? () => onActiveChange(callout.id) : undefined}
            onPointerLeave={onActiveChange ? () => onActiveChange(null) : undefined}
            {...reveal(drawnAt * 0.6 + index * 0.06)}
          >
            <path
              className={styles.leader}
              d={`M ${anchor.x} ${anchor.y} L ${elbowX} ${callout.labelY} L ${textX + (left ? 10 : -10)} ${callout.labelY}`}
            />
            <circle className={styles.marker} cx={anchor.x} cy={anchor.y} r={5.5} />
            <AnimatePresence>
              {active ? (
                <motion.circle
                  className={styles.pulse}
                  cx={anchor.x}
                  cy={anchor.y}
                  initial={{ r: 6, opacity: 0.9 }}
                  animate={{ r: 22, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: ease.out, repeat: 2 }}
                />
              ) : null}
            </AnimatePresence>
            <text
              className={styles.code}
              x={textX - (left ? 6 : -6)}
              y={callout.labelY - 28}
              textAnchor={left ? 'end' : 'start'}
            >
              {callout.code}
            </text>
            <text
              className={styles.label}
              x={textX - (left ? 6 : -6)}
              y={callout.labelY + 34}
              textAnchor={left ? 'end' : 'start'}
            >
              {callout.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
