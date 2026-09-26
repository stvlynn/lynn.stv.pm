import { CopyValue } from './CopyValue';
import styles from './Swatch.module.css';

interface SwatchProps {
  readonly color: string;
  readonly label: string;
  readonly value: string;
  /** Renders the value as a copy button. */
  readonly copyable?: boolean;
}

export function Swatch({ color, label, value, copyable = false }: SwatchProps) {
  return (
    <div className={styles.swatch}>
      <div className={styles.chip} style={{ background: color }} />
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{copyable ? <CopyValue value={value} /> : value}</span>
    </div>
  );
}
