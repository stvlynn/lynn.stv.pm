import type { Outfit } from 'entities/outfit';
import { Tabs, TabsList, TabsTrigger } from '@/components/motion/tabs';
import { useSelectedOutfit } from 'features/explore-wardrobe';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { t } from 'shared/i18n';
import { duration, ease } from 'shared/lib';
import { Reveal, Swatch, Tag, TiltCard } from 'shared/ui';
import styles from './OutfitShowcase.module.css';

const PANEL_ID = 'outfit-panel';

function Stage({ outfit }: { readonly outfit: Outfit }) {
  const reduced = useReducedMotion();
  return (
    <TiltCard max={6} glare={false} className={styles.stage}>
      <span className={styles.stageCode}>{outfit.code}</span>
      <span className={styles.floor} aria-hidden="true" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={outfit.id}
          className={styles.figure}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -30, filter: 'blur(6px)' }}
          transition={{ duration: duration.slow, ease: ease.out }}
        >
          <img
            src={outfit.image.src}
            alt={outfit.image.alt}
            width={outfit.image.width}
            height={outfit.image.height}
            className={styles.image}
          />
        </motion.div>
      </AnimatePresence>
    </TiltCard>
  );
}

function Details({ outfit }: { readonly outfit: Outfit }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={outfit.id}
        className={styles.details}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: duration.base, ease: ease.out }}
      >
        <div>
          {outfit.canonical ? <Tag tone="accent">{t('wardrobe.canonical')}</Tag> : <Tag>{outfit.occasion}</Tag>}
        </div>
        <h2 className={styles.name}>{outfit.name}</h2>
        <p className={styles.summary}>{outfit.summary}</p>
        <div>
          <h3 className={styles.label}>{t('wardrobe.garments')}</h3>
          <dl className={styles.garments}>
            {outfit.garments.map((garment) => (
              <div key={garment.slot} className={styles.row}>
                <dt>{garment.slot}</dt>
                <dd>{garment.name}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h3 className={styles.label}>{t('wardrobe.palette')}</h3>
          <div className={styles.palette}>
            {outfit.palette.map((swatch) => (
              <Swatch key={swatch.label} color={swatch.hex} label={swatch.label} value={swatch.hex} copyable />
            ))}
          </div>
        </div>
        <span className={styles.source}>
          {t('wardrobe.source')} · {outfit.source}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

/** The wardrobe: pick a look from the list or the lineup; the stage swaps it in. */
export function OutfitShowcase({ outfits }: { readonly outfits: readonly Outfit[] }) {
  const { selected, select } = useSelectedOutfit(outfits);
  if (!selected) {
    return null;
  }
  return (
    <>
      <div className={styles.layout}>
        <Tabs value={selected.id} onValueChange={select} variant="pill">
          <TabsList className="border border-border">
            {outfits.map((outfit) => (
              <TabsTrigger key={outfit.id} value={outfit.id} className="gap-2 font-mono text-xs">
                <span className="opacity-60">{outfit.code}</span>
                {outfit.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div id={PANEL_ID} role="tabpanel" aria-label={selected.name} className={styles.panel}>
          <Stage outfit={selected} />
          <Details outfit={selected} />
        </div>
      </div>
      <Reveal>
        <ul className={styles.lineup} aria-label={t('wardrobe.list')}>
          {outfits.map((outfit) => (
            <li key={outfit.id}>
              <motion.button
                type="button"
                className={styles.lineupButton}
                aria-pressed={outfit.id === selected.id}
                onClick={() => select(outfit.id)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: duration.base, ease: ease.out }}
              >
                <img src={outfit.image.src} alt={outfit.name} className={styles.lineupImage} loading="lazy" />
                <span className={styles.lineupCode}>{outfit.code}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </Reveal>
    </>
  );
}
