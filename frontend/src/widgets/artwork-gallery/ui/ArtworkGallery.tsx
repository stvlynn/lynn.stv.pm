import type { Artwork } from 'entities/artwork';
import { ArtworkLightbox, ArtworkPlate } from 'features/browse-gallery';
import { useState } from 'react';
import { Reveal } from 'shared/ui';
import styles from './ArtworkGallery.module.css';

/** The art book: staggered plates that open into a lightbox. */
export function ArtworkGallery({ artworks }: { readonly artworks: readonly Artwork[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className={styles.grid}>
        {artworks.map((artwork, index) => (
          <Reveal as="li" key={artwork.id} index={index % 2} className={styles.item}>
            <ArtworkPlate artwork={artwork} onOpen={() => setOpen(index)} />
            <div className={styles.meta}>
              <p className={styles.caption}>{artwork.caption}</p>
              <span className={styles.dots} aria-hidden="true">
                {artwork.palette.map((swatch) => (
                  <span key={swatch.hex} className={styles.dot} style={{ background: swatch.hex }} />
                ))}
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
      <ArtworkLightbox artworks={artworks} index={open} onChange={setOpen} />
    </>
  );
}
