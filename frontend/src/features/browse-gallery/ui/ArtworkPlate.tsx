import type { Artwork } from 'entities/artwork';
import { motion } from 'motion/react';
import { t } from 'shared/i18n';
import { TiltCard } from 'shared/ui';
import styles from './ArtworkPlate.module.css';

interface ArtworkPlateProps {
  readonly artwork: Artwork;
  readonly onOpen: () => void;
}

/** A plate on a beUI tilt card; the label floats above the painting. */
export function ArtworkPlate({ artwork, onOpen }: ArtworkPlateProps) {
  return (
    <button
      type="button"
      className={styles.plate}
      onClick={onOpen}
      aria-label={`${t('gallery.open')}: ${artwork.title}`}
    >
      <TiltCard max={9} className={styles.frame}>
        <motion.div
          layoutId={`artwork-${artwork.id}`}
          style={{ aspectRatio: `${artwork.image.width} / ${artwork.image.height}` }}
        >
          <img
            src={artwork.image.src}
            alt={artwork.image.alt}
            width={artwork.image.width}
            height={artwork.image.height}
            loading="lazy"
            decoding="async"
            className={styles.image}
          />
        </motion.div>
        <div className={styles.depth} aria-hidden="true">
          <span className={`${styles.corner} ${styles.tl}`} />
          <span className={`${styles.corner} ${styles.br}`} />
        </div>
        <div className={styles.label} style={{ transform: 'translateZ(40px)' }}>
          <h3 className={styles.title}>{artwork.title}</h3>
          <span className={styles.code}>{artwork.code}</span>
        </div>
      </TiltCard>
    </button>
  );
}
