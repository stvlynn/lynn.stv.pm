import { AnimatePresence, motion } from 'motion/react';
import { useId, useMemo, useState } from 'react';
import { cn, duration, ease, useMediaQuery } from '../../lib';
import { figureCamera } from './camera';
import { FigureArtwork } from './FigureArtwork';
import { FigureCamera } from './FigureCamera';
import { type FigureGeometry, FIGURE_HEIGHT, FIGURE_WIDTH, frontFigure } from './figure';
import styles from './FigureDrawing.module.css';
import { FigureStrokeMask } from './FigureStrokeMask';
import { FIGURE_DRAW_DURATION } from './stroke-timeline';
import { COLUMN, type CalloutInput, placeCallouts } from './layout';

const FULL_MARGIN = { left: 350, right: 360, top: 90, bottom: 60 };
const BARE_MARGIN = { left: 24, right: 24, top: 24, bottom: 24 };
const viewBoxFor = (margin: typeof FULL_MARGIN) =>
  `${-margin.left} ${-margin.top} ${FIGURE_WIDTH + margin.left + margin.right} ${FIGURE_HEIGHT + margin.top + margin.bottom}`;
const RULER_X = FIGURE_WIDTH + 300;

interface FigureDrawingProps {
  readonly label: string;
  readonly callouts?: readonly CalloutInput[];
  readonly activeId?: string | null;
  readonly onActiveChange?: (id: string | null) => void;
  /** Draw the strokes in on mount. */
  readonly draw?: boolean;
  readonly dimensions?: { readonly unit: string; readonly centerline: string; readonly heads: string };
  readonly className?: string;
  readonly figure?: FigureGeometry;
  readonly focusId?: string | null;
  readonly colored?: boolean;
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
  figure = frontFigure,
  focusId = null,
  colored = false,
}: FigureDrawingProps) {
  const { headTop: HEAD_TOP, chin: CHIN, centerX: CENTER_X, hem: HEM } = figure;
  const HEAD_UNIT = CHIN - HEAD_TOP;
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [completedFigure, setCompletedFigure] = useState<string | null>(null);
  const animate = draw && !reduced && figure.penStrokes !== undefined;
  const drawingInk = animate && completedFigure !== figure.id;
  const placed = useMemo(() => placeCallouts(callouts, figure.anchors), [callouts, figure.anchors]);
  const viewTransition = { duration: reduced ? 0 : duration.base, ease: ease.out };
  const maskId = `figure-reveal-${useId().replace(/:/g, '')}`;
  const drawnAt = FIGURE_DRAW_DURATION;
  const annotated = callouts.length > 0 || dimensions !== undefined;
  const MARGIN = annotated ? FULL_MARGIN : BARE_MARGIN;
  const camera = figureCamera(figure, focusId);

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
      <FigureCamera target={camera} reduced={reduced}>
        {dimensions ? (
          <motion.g animate={{ opacity: focusId ? 0 : 1 }} transition={viewTransition} {...reveal(0.2)}>
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
            <text className={styles.dimText} x={RULER_X + 14} y={FIGURE_HEIGHT + 32} textAnchor="end">
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

        {drawingInk && figure.penStrokes ? (
          <FigureStrokeMask
            id={maskId}
            strokes={figure.penStrokes}
            glasses={figure.glasses}
            onComplete={() => setCompletedFigure(figure.id)}
          />
        ) : null}

        <AnimatePresence initial={false}>
          <motion.g
            key={figure.id}
            mask={drawingInk ? `url(#${maskId})` : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={viewTransition}
          >
            <FigureArtwork figure={figure} colored={colored} />
          </motion.g>
        </AnimatePresence>

        <AnimatePresence>
          {placed.map((callout, index) => {
            const { anchor } = callout;
            const focused = focusId === callout.id;
            const left = !focused && anchor.side === 'left';
            const textX = focused ? anchor.x + 190 / camera.scale : left ? COLUMN.left : COLUMN.right;
            const elbowX = focused ? textX - 12 / camera.scale : left ? COLUMN.left + 12 : COLUMN.right - 12;
            const labelY = focused ? anchor.y - 160 / camera.scale : callout.labelY;
            const labelScale = focused ? camera.scale : 1;
            const active = callout.id === activeId;
            return (
              <motion.g
                key={callout.id}
                className={styles.callout}
                data-active={active}
                onPointerEnter={onActiveChange ? () => onActiveChange(callout.id) : undefined}
                onPointerLeave={onActiveChange ? () => onActiveChange(null) : undefined}
                animate={{ opacity: focusId && !focused ? 0 : 1 }}
                transition={viewTransition}
                {...reveal(drawnAt + index * 0.06)}
                style={{ pointerEvents: focusId ? 'none' : 'auto' }}
                exit={{ opacity: 0, transition: viewTransition }}
              >
                <motion.path
                  className={styles.leader}
                  initial={false}
                  animate={{
                    d: `M ${anchor.x} ${anchor.y} L ${elbowX} ${labelY} L ${textX + (left ? 10 : -10) / labelScale} ${labelY}`,
                  }}
                  transition={viewTransition}
                  vectorEffect="non-scaling-stroke"
                />
                <motion.circle
                  className={styles.marker}
                  initial={false}
                  animate={{ cx: anchor.x, cy: anchor.y, r: focused ? 12 / camera.scale : 5.5 }}
                  transition={viewTransition}
                  vectorEffect="non-scaling-stroke"
                />
                <AnimatePresence>
                  {active && !reduced && !focusId ? (
                    <motion.circle
                      className={styles.pulse}
                      initial={{ r: 6, opacity: 0.9, cx: anchor.x, cy: anchor.y }}
                      animate={{ r: 22, opacity: 0, cx: anchor.x, cy: anchor.y }}
                      exit={{ opacity: 0, transition: viewTransition }}
                      transition={{ duration: 1.1, ease: ease.out, repeat: 2 }}
                    />
                  ) : null}
                </AnimatePresence>
                <motion.text
                  className={styles.code}
                  initial={false}
                  animate={{
                    attrX: textX - (left ? 6 : -6) / labelScale,
                    attrY: labelY - 28 / labelScale,
                    fontSize: (focused ? 26 : 19) / labelScale,
                    strokeWidth: 8 / labelScale,
                  }}
                  transition={viewTransition}
                  textAnchor={left ? 'end' : 'start'}
                >
                  {callout.code}
                </motion.text>
                <motion.text
                  className={styles.label}
                  initial={false}
                  animate={{
                    attrX: textX - (left ? 6 : -6) / labelScale,
                    attrY: labelY + 34 / labelScale,
                    fontSize: (focused ? 48 : 36) / labelScale,
                    strokeWidth: 8 / labelScale,
                  }}
                  transition={viewTransition}
                  textAnchor={left ? 'end' : 'start'}
                >
                  {callout.label}
                </motion.text>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </FigureCamera>
    </svg>
  );
}
