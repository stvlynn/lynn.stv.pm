import { type Artwork, wrapIndex } from 'entities/artwork';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect } from 'react';
import { t } from 'shared/i18n';
import { duration, ease } from 'shared/lib';
import { Button, Dialog, Icon, Swatch, Tag } from 'shared/ui';
import styles from './ArtworkLightbox.module.css';

interface ArtworkLightboxProps {
  readonly artworks: readonly Artwork[];
  readonly index: number | null;
  readonly onChange: (index: number | null) => void;
}

/** Full plate view. Left and right arrows step through the book. */
export function ArtworkLightbox({ artworks, index, onChange }: ArtworkLightboxProps) {
  const artwork = index === null ? undefined : artworks[index];
  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback(
    (delta: number) => {
      if (index !== null) onChange(wrapIndex(index, delta, artworks.length));
    },
    [index, onChange, artworks.length],
  );
  useEffect(() => {
    if (index === null) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, step]);

  return (
    <Dialog open={artwork !== undefined} onClose={close} label={artwork?.title ?? ''} widthClass="max-w-6xl">
      {artwork ? (
        <div className={styles.layout}>
          <div className={styles.media}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={artwork.id}
                layoutId={`artwork-${artwork.id}`}
                className={styles.frame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.slow, ease: ease.out }}
              >
                <img
                  src={artwork.image.src}
                  alt={artwork.image.alt}
                  width={artwork.image.width}
                  height={artwork.image.height}
                  className={styles.image}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={artwork.id}
              className={styles.body}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: duration.base, ease: ease.out }}
            >
              <span className={styles.code}>
                {artwork.code} · {index === null ? '' : `${index + 1} / ${artworks.length}`}
              </span>
              <h2 className={styles.title}>{artwork.title}</h2>
              <p className={styles.caption}>{artwork.caption}</p>
              <p className={styles.mood}>{artwork.mood}</p>
              <div>
                <h3 className={styles.label}>{t('gallery.palette')}</h3>
                <div className={styles.palette}>
                  {artwork.palette.map((swatch) => (
                    <Swatch key={swatch.hex} color={swatch.hex} label={swatch.label} value={swatch.hex} copyable />
                  ))}
                </div>
              </div>
              <div>
                <h3 className={styles.label}>{t('gallery.motifs')}</h3>
                <div className={styles.motifs}>
                  {artwork.motifs.map((motif) => (
                    <Tag key={motif}>{motif}</Tag>
                  ))}
                </div>
              </div>
              <div className={styles.nav}>
                <Button variant="outline" size="small" onClick={() => step(-1)}>
                  <Icon name="chevronLeft" size={14} />
                  {t('common.previous')}
                </Button>
                <Button variant="outline" size="small" onClick={() => step(1)}>
                  {t('common.next')}
                  <Icon name="chevronRight" size={14} />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </Dialog>
  );
}
