import type { Artwork } from 'entities/artwork';
import { motion } from 'motion/react';
import { useHaptics } from 'shared/lib';
import { t } from 'shared/i18n';
import { ArtworkDepth } from './ArtworkDepth';
import styles from './ArtworkPlate.module.css';

interface ArtworkPlateProps {
  readonly artwork: Artwork;
  readonly onOpen: () => void;
}

/** The frame stays still while depth displacement moves the scene inside it. */
export function ArtworkPlate({ artwork, onOpen }: ArtworkPlateProps) {
  const pulse = useHaptics();
  return (
    <button
      type="button"
      className={styles.plate}
      onClick={() => {
        pulse('medium');
        onOpen();
      }}
      aria-label={`${t('gallery.open')}: ${artwork.title}`}
    >
      <div className={styles.frame}>
        <motion.div
          layoutId={`artwork-${artwork.id}`}
          style={{ aspectRatio: `${artwork.image.width} / ${artwork.image.height}` }}
        >
          <ArtworkDepth artwork={artwork} />
        </motion.div>
        <div className={styles.depth} aria-hidden="true">
          <span className={`${styles.corner} ${styles.tl}`} />
          <span className={`${styles.corner} ${styles.br}`} />
        </div>
        <div className={styles.label}>
          <h3 className={styles.title}>{artwork.title}</h3>
          <span className={styles.code}>{artwork.code}</span>
        </div>
      </div>
    </button>
  );
}
