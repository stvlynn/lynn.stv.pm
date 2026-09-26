import { toCallouts } from 'entities/character';
import { useCharacterProfile } from 'features/explore-character';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { type PointerEvent, useMemo, useState } from 'react';
import { paths } from 'shared/config';
import { t } from 'shared/i18n';
import { duration, ease, pointerSpring, useMediaQuery } from 'shared/lib';
import { ButtonLink, FigureDrawing, Icon, TextReveal } from 'shared/ui';
import styles from './DrawingSheet.module.css';

const WORD_DELAY = 0.4;

/**
 * The opening drawing sheet: Lynn is plotted stroke by stroke as a front
 * elevation, then annotated. Pointer movement parallaxes copy, figure and
 * frame at three depths.
 */
export function DrawingSheet() {
  const reduced = useReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');
  const profile = useCharacterProfile();
  const [active, setActive] = useState<string | null>(null);
  const callouts = useMemo(() => (wide && profile.data ? toCallouts(profile.data.traits) : []), [wide, profile.data]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, pointerSpring);
  const y = useSpring(pointerY, pointerSpring);
  const figureX = useTransform(x, (value) => value * -18);
  const figureY = useTransform(y, (value) => value * -12);
  const figureRotate = useTransform(x, (value) => value * 4);
  const copyX = useTransform(x, (value) => value * 10);
  const copyY = useTransform(y, (value) => value * 8);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const credits = profile.data?.credits.slice(0, 2) ?? [];

  return (
    <section
      className={styles.sheet}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      style={{ perspective: 1400 }}
    >
      <motion.div className={styles.copy} style={{ x: copyX, y: copyY }}>
        <motion.div
          className={styles.drawingNumber}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.slow, delay: 0.2 }}
        >
          <span>{t('brand.drawingNumber')}-01</span>
          <span>{t('blueprint.title')}</span>
        </motion.div>
        <TextReveal
          as="h1"
          text={t('brand.wordmark')}
          split="char"
          className={styles.wordmark}
          delay={WORD_DELAY}
          stagger={0.08}
          blur={10}
          yOffset="40%"
        />
        {profile.data ? (
          <motion.div
            className={styles.copy}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.out, delay: WORD_DELAY + 0.5 }}
          >
            <p className={styles.tagline}>{profile.data.tagline}</p>
            <p className={styles.summary}>{profile.data.summary}</p>
            <div className={styles.actions}>
              <ButtonLink to={paths.character} variant="ink">
                {t('home.cta')}
                <Icon name="arrowRight" size={14} />
              </ButtonLink>
              <ButtonLink to={paths.wardrobe} variant="outline">
                {t('home.ctaSecondary')}
              </ButtonLink>
            </div>
          </motion.div>
        ) : null}
      </motion.div>

      <motion.div className={styles.drawing} style={{ x: figureX, y: figureY, rotateY: figureRotate }}>
        <FigureDrawing
          label={t('blueprint.figureLabel')}
          callouts={callouts}
          activeId={active}
          onActiveChange={setActive}
          draw
          {...(wide
            ? {
                dimensions: {
                  unit: t('blueprint.headUnit'),
                  centerline: t('blueprint.centerline'),
                  heads: t('blueprint.heads'),
                },
              }
            : {})}
        />
      </motion.div>

      <motion.dl
        className={styles.titleBlock}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: ease.out, delay: 2.2 }}
      >
        <div className={`${styles.cell} ${styles.cellWide}`}>
          <dt className={styles.cellLabel}>{t('blueprint.title')}</dt>
          <dd className={styles.cellValue}>
            {t('brand.wordmark')} · {t('brand.standard')}
          </dd>
        </div>
        {[
          [t('blueprint.scale'), t('blueprint.scaleValue')],
          [t('blueprint.sheet'), t('blueprint.sheetValue')],
          [t('blueprint.revision'), t('blueprint.revisionValue')],
        ].map(([label, value]) => (
          <div key={label} className={styles.cell}>
            <dt className={styles.cellLabel}>{label}</dt>
            <dd className={styles.cellValue}>{value}</dd>
          </div>
        ))}
        {credits.map((credit) => (
          <div key={credit.role} className={styles.cell}>
            <dt className={styles.cellLabel}>{credit.role}</dt>
            <dd className={styles.cellValue}>{credit.name}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
