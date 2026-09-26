import { displayTitle, filterStickers, type Sticker, type StickerFilter } from 'entities/sticker';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useMemo, useState } from 'react';
import { t } from 'shared/i18n';
import { duration, ease } from 'shared/lib';
import { Dialog, SegmentedControl, TextField } from 'shared/ui';
import styles from './StickerSet.module.css';

const filters: readonly { value: StickerFilter; label: string }[] = [
  { value: 'all', label: t('sticker.filterAll') },
  { value: 'caption', label: t('sticker.filterCaption') },
  { value: 'expression', label: t('sticker.filterExpression') },
];

/** The published set: filter, search, and a preview at chat and source size. */
export function StickerSet({ stickers }: { readonly stickers: readonly Sticker[] }) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<StickerFilter>('all');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<Sticker | null>(null);
  const visible = useMemo(() => filterStickers(stickers, filter, query), [stickers, filter, query]);

  return (
    <>
      <div className={styles.toolbar}>
        <SegmentedControl label={t('sticker.set')} options={filters} value={filter} onChange={setFilter} />
        <div className={styles.search}>
          <TextField
            label={t('sticker.search')}
            type="search"
            value={query}
            onChange={setQuery}
            meta={<span className={styles.count}>{visible.length}</span>}
          />
        </div>
      </div>
      {visible.length === 0 ? (
        <p className={styles.empty}>{t('sticker.empty')}</p>
      ) : (
        <motion.ul layout={!reduced} className={styles.grid}>
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((sticker) => (
              <motion.li
                key={sticker.id}
                layout={!reduced}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: duration.base, ease: ease.out }}
              >
                <motion.button
                  type="button"
                  className={styles.item}
                  onClick={() => setPreview(sticker)}
                  whileHover={reduced ? undefined : { scale: 1.06, rotate: -3 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: duration.base, ease: ease.overshoot }}
                >
                  <img
                    src={sticker.image.src}
                    alt={sticker.image.alt}
                    width={sticker.image.width}
                    height={sticker.image.height}
                    loading="lazy"
                    decoding="async"
                    className={styles.image}
                  />
                  <span className={styles.title}>{displayTitle(sticker)}</span>
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
      <Dialog
        open={preview !== null}
        onClose={() => setPreview(null)}
        label={preview ? displayTitle(preview) : ''}
        widthClass="max-w-2xl"
      >
        {preview ? (
          <div className={styles.preview}>
            <img src={preview.image.src} alt={preview.image.alt} className={styles.previewLarge} />
            <div className={styles.previewMeta}>
              <p className={styles.previewNote}>{t('sticker.previewSizes')}</p>
              <img src={preview.image.src} alt="" className={styles.previewSmall} />
              <h2 className={styles.previewTitle}>{displayTitle(preview)}</h2>
              <p className={styles.previewNote}>{preview.id}</p>
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
