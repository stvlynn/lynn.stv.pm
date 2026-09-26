import type { ReactNode } from 'react';
import styles from './Page.module.css';

/** Centered reading column shared by every sheet except the drawing sheet. */
export function Page({ children }: { readonly children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
