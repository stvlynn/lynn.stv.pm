import { motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { useTiltTarget, useMediaQuery } from 'shared/lib';
import styles from './DrawingFrame.module.css';

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ROWS = ['1', '2', '3', '4', '5', '6'];

const pad = (value: number) => String(Math.round(value)).padStart(4, '0');

/**
 * The drawing-sheet border: zone letters and numbers on the edges and a live
 * pointer readout, as on a plotted engineering drawing. Decorative only.
 */
export function DrawingFrame() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tilt = useTiltTarget(x, y, 100);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const readX = useTransform(x, (value) => `X ${pad(value)}`);
  const readY = useTransform(y, (value) => `Y ${pad(value)}`);

  useEffect(() => {
    if (tilt || reduced) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y, tilt, reduced]);

  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={`${styles.zones} ${styles.top}`}>
        {COLUMNS.map((zone) => (
          <span key={zone}>{zone}</span>
        ))}
      </div>
      <div className={`${styles.zones} ${styles.bottom}`}>
        {COLUMNS.map((zone) => (
          <span key={zone}>{zone}</span>
        ))}
      </div>
      <div className={`${styles.zones} ${styles.left}`}>
        {ROWS.map((zone) => (
          <span key={zone}>{zone}</span>
        ))}
      </div>
      <div className={`${styles.zones} ${styles.right}`}>
        {ROWS.map((zone) => (
          <span key={zone}>{zone}</span>
        ))}
      </div>
      <div className={styles.readout}>
        <motion.span>{readX}</motion.span>
        <motion.span>{readY}</motion.span>
      </div>
    </div>
  );
}
